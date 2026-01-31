/**
 * User API client - basic user info for header/sidebar (from onboarding + user).
 * Calls backend via /api/backend proxy (adds NextAuth JWT).
 */
import { parseApiResponse } from "@/lib/api-types";

/** Backend basic user info response (snake_case). */
interface BasicUserInfoResponse {
  name: string;
  email: string | null;
  profile_picture_url: string | null;
  role: string;
}

/** Basic user info for display (camelCase). Used in header, sidebar, account menu. */
export interface BasicUserInfo {
  name: string;
  email: string | null;
  profilePictureUrl: string | null;
  role: string;
}

function mapBasicUserInfo(res: BasicUserInfoResponse): BasicUserInfo {
  return {
    name: res.name,
    email: res.email ?? null,
    profilePictureUrl: res.profile_picture_url ?? null,
    role: res.role,
  };
}

/**
 * Fetch basic user info (name, email, profile picture URL from onboarding, role).
 * Used in multiple places: top bar avatar, sidebar profile, account menu.
 */
export async function getBasicUserInfo(): Promise<BasicUserInfo | null> {
  const res = await fetch("/api/backend/users/me/basic-info", {
    credentials: "include",
  });
  const data = await parseApiResponse<BasicUserInfoResponse>(res);
  return data ? mapBasicUserInfo(data) : null;
}
