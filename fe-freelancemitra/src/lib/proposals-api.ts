/**
 * Proposals API client - generate, list, get, update, delete saved proposals.
 * Calls backend via /api/backend proxy (adds NextAuth JWT).
 */
import { parseApiResponse } from "@/lib/api-types";

export interface GenerateProposalRequest {
  job_description: string;
  client_name?: string | null;
  platform?: string | null;
  job_budget?: string | null;
  hourly_rate?: string | null;
}

/** Single saved proposal from API (snake_case from backend). */
export interface ProposalItemResponse {
  id: string;
  job_description: string;
  client_name: string;
  platform: string;
  job_budget: string;
  hourly_rate: string;
  proposal: string;
  created_at: string;
  updated_at: string;
}

/** Same as ProposalItemResponse but camelCase for UI. */
export interface ProposalItem {
  id: string;
  jobDescription: string;
  clientName: string;
  platform: string;
  jobBudget: string;
  hourlyRate: string;
  proposal: string;
  createdAt: string;
  updatedAt: string;
}

function toProposalItem(r: ProposalItemResponse): ProposalItem {
  return {
    id: r.id,
    jobDescription: r.job_description ?? "",
    clientName: (r as { client_name?: string }).client_name ?? "",
    platform: r.platform ?? "",
    jobBudget: r.job_budget ?? "",
    hourlyRate: r.hourly_rate ?? "",
    proposal: r.proposal ?? "",
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? "",
  };
}

interface GenerateProposalResponse {
  proposal: string;
  id: string;
}

/**
 * Generate a personalized proposal and save it to the database.
 * Returns the proposal text and the saved record id.
 */
export async function generateProposal(
  body: GenerateProposalRequest
): Promise<{ proposal: string; id: string }> {
  const res = await fetch("/api/backend/proposals/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      job_description: body.job_description,
      platform: body.platform ?? null,
      job_budget: body.job_budget ?? null,
      hourly_rate: body.hourly_rate ?? null,
    }),
  });
  const data = await parseApiResponse<GenerateProposalResponse>(res);
  if (!data?.proposal || !data?.id) throw new Error("No proposal or id in response");
  return { proposal: data.proposal, id: data.id };
}

/** Paginated list response from API. */
export interface ListProposalsPaginatedResponse {
  items: ProposalItemResponse[];
  total: number;
}

/**
 * List the current user's saved proposals with pagination (newest first).
 */
export async function listProposalsPaginated(
  page: number,
  pageSize: number
): Promise<{ items: ProposalItem[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  const res = await fetch(`/api/backend/proposals?${params}`, {
    credentials: "include",
  });
  const data = await parseApiResponse<ListProposalsPaginatedResponse>(res);
  if (!data || !Array.isArray(data.items)) {
    return { items: [], total: 0 };
  }
  return {
    items: data.items.map(toProposalItem),
    total: typeof data.total === "number" ? data.total : 0,
  };
}

/**
 * Get a single saved proposal by id.
 */
export async function getProposal(id: string): Promise<ProposalItem> {
  const res = await fetch(`/api/backend/proposals/${encodeURIComponent(id)}`, {
    credentials: "include",
  });
  const data = await parseApiResponse<ProposalItemResponse>(res);
  if (!data) throw new Error("Proposal not found");
  return toProposalItem(data);
}

export interface UpdateProposalRequest {
  job_description?: string | null;
  client_name?: string | null;
  platform?: string | null;
  job_budget?: string | null;
  hourly_rate?: string | null;
  proposal?: string | null;
}

/**
 * Update a saved proposal (any subset of fields).
 */
export async function updateProposal(
  id: string,
  body: UpdateProposalRequest
): Promise<ProposalItem> {
  const res = await fetch(`/api/backend/proposals/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      job_description: body.job_description ?? undefined,
      client_name: body.client_name ?? undefined,
      platform: body.platform ?? undefined,
      job_budget: body.job_budget ?? undefined,
      hourly_rate: body.hourly_rate ?? undefined,
      proposal: body.proposal ?? undefined,
    }),
  });
  const data = await parseApiResponse<ProposalItemResponse>(res);
  if (!data) throw new Error("Proposal not found");
  return toProposalItem(data);
}

/**
 * Delete a saved proposal.
 */
export async function deleteProposal(id: string): Promise<void> {
  const res = await fetch(`/api/backend/proposals/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  await parseApiResponse<null>(res);
}
