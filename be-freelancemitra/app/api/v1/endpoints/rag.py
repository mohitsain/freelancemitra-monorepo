"""RAG Agent API: query with retrieval-augmented generation (OpenAI)."""
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.schemas.response import ApiResponse
from app.services.rag import rag_query

router = APIRouter()


class RAGQueryRequest(BaseModel):
    """Request body for RAG query."""

    query: str = Field(..., min_length=1, description="Question or search text")
    top_k: int = Field(3, ge=1, le=10, description="Number of document chunks to retrieve")


class RAGQueryResponse(BaseModel):
    """RAG response: answer and source chunks."""

    answer: str
    sources: list[str]


@router.post("/query", response_model=ApiResponse)
async def post_rag_query(body: RAGQueryRequest):
    """
    RAG Agent: retrieve relevant context from the knowledge base, then generate an answer using OpenAI.
    Requires OPENAI_API_KEY in .env.
    """
    result = await rag_query(query=body.query, top_k=body.top_k)
    return ApiResponse(success=True, data=RAGQueryResponse(**result))
