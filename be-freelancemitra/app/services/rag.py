"""RAG (Retrieval-Augmented Generation) service using OpenAI API."""
from __future__ import annotations

from typing import Optional

import numpy as np
from openai import AsyncOpenAI

from app.config import get_settings


# Default knowledge base chunks (expand via API or DB later)
DEFAULT_CHUNKS: list[dict[str, str]] = [
    {"id": "1", "text": "FreelanceMitra is a platform for freelancers. It offers portfolio creation, lead generation, proposal building, and client acquisition."},
    {"id": "2", "text": "Users can create portfolios from profile data, use AI-powered proposal builder, and manage invoices. The app uses NextAuth for sign-in and supports Google/GitHub."},
    {"id": "3", "text": "Profile and onboarding data include: basic contact, professional overview, portfolio samples, experience, education, availability and rates, social media, and testimonials."},
    {"id": "4", "text": "The backend is FastAPI with PostgreSQL. File uploads go to S3. Temporal is used for workflow orchestration. The frontend is Next.js with Chakra UI."},
    {"id": "5", "text": "To get started: complete onboarding, create a portfolio from your profile, use the dashboard to find leads and send proposals. You can manage projects and invoices from the sidebar."},
]


def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity between two vectors."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))


class RAGService:
    """RAG agent: embed docs, retrieve by query, generate answer with OpenAI."""

    def __init__(
        self,
        *,
        api_key: Optional[str] = None,
        embedding_model: Optional[str] = None,
        chat_model: Optional[str] = None,
        chunks: Optional[list[dict[str, str]]] = None,
    ):
        settings = get_settings()
        self._client = AsyncOpenAI(api_key=api_key or settings.openai_api_key or "")
        self._embedding_model = embedding_model or settings.openai_embedding_model
        self._chat_model = chat_model or settings.openai_chat_model
        self._chunks = chunks or DEFAULT_CHUNKS
        self._embeddings: Optional[np.ndarray] = None  # shape (n_chunks, dim)

    async def _get_embeddings(self) -> np.ndarray:
        """Embed all chunks (cached)."""
        if self._embeddings is not None:
            return self._embeddings
        texts = [c["text"] for c in self._chunks]
        r = await self._client.embeddings.create(model=self._embedding_model, input=texts)
        # Assume same order as input
        self._embeddings = np.array([e.embedding for e in r.data], dtype=np.float32)
        return self._embeddings

    async def _embed_query(self, query: str) -> np.ndarray:
        """Embed a single query."""
        r = await self._client.embeddings.create(model=self._embedding_model, input=[query])
        return np.array(r.data[0].embedding, dtype=np.float32)

    async def retrieve(self, query: str, top_k: int = 3) -> list[dict[str, str]]:
        """Return top-k chunks most relevant to the query."""
        if not self._chunks:
            return []
        q_emb = await self._embed_query(query)
        doc_embs = await self._get_embeddings()
        scores = [_cosine_similarity(q_emb, doc_embs[i]) for i in range(len(self._chunks))]
        indices = np.argsort(scores)[::-1][:top_k]
        return [self._chunks[i] for i in indices]

    async def query(self, query: str, top_k: int = 3) -> dict[str, str | list[str]]:
        """
        RAG: retrieve relevant chunks, then generate answer with OpenAI.
        Returns {"answer": "...", "sources": ["chunk text 1", ...]}.
        """
        if not self._client.api_key:
            return {
                "answer": "OpenAI API key is not configured. Set OPENAI_API_KEY in .env.",
                "sources": [],
            }
        chunks = await self.retrieve(query, top_k=top_k)
        context = "\n\n".join(c["text"] for c in chunks)
        prompt = f"""Use the following context to answer the question. If the context does not contain enough information, say so briefly.

Context:
{context}

Question: {query}

Answer:"""
        try:
            r = await self._client.chat.completions.create(
                model=self._chat_model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
            )
            answer = (r.choices[0].message.content or "").strip()
        except Exception as e:
            answer = f"Error calling OpenAI: {e!s}"
        sources = [c["text"] for c in chunks]
        return {"answer": answer, "sources": sources}


async def rag_query(query: str, top_k: int = 3) -> dict[str, str | list[str]]:
    """One-off RAG query using default service."""
    service = RAGService()
    return await service.query(query, top_k=top_k)
