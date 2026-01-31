/**
 * Upload API client - presigned S3 URLs via /api/backend proxy.
 */
import { parseApiResponse, parseApiResponseRequired } from "@/lib/api-types";

const BASE = "/api/backend";

export interface PresignedUploadResponse {
  upload_url: string;
  key: string;
}

export interface DisplayUrlResponse {
  url: string;
}

/** Allowed S3 categories: users/{user_id}/{category}/ */
export const UPLOAD_CATEGORIES = ["profile", "projects"] as const;
export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

/** POST /upload/presigned-url - get presigned PUT URL and key to store. */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  category: UploadCategory = "profile"
): Promise<PresignedUploadResponse> {
  const res = await fetch(`${BASE}/upload/presigned-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ filename, content_type: contentType, category }),
  });
  return parseApiResponseRequired<PresignedUploadResponse>(res);
}

/** GET /upload/display-url?key=... - get presigned GET URL for displaying an S3 object. */
export async function getDisplayUrl(key: string): Promise<string> {
  const res = await fetch(
    `${BASE}/upload/display-url?${new URLSearchParams({ key })}`,
    { credentials: "include" }
  );
  const data = await parseApiResponseRequired<DisplayUrlResponse>(res);
  return data.url;
}

/**
 * Upload a file to S3 using a presigned PUT URL.
 * Call getPresignedUploadUrl first, then this.
 */
export async function uploadFileToS3(
  uploadUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Upload failed: ${res.status}`);
  }
}

/**
 * Upload a file to the user's S3 folder by category; returns key to store.
 */
export async function uploadOnboardingFile(
  file: File,
  category: UploadCategory = "profile"
): Promise<string> {
  const { upload_url, key } = await getPresignedUploadUrl(
    file.name,
    file.type,
    category
  );
  await uploadFileToS3(upload_url, file);
  return key;
}
