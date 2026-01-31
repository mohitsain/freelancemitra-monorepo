"use client";

import { useQuery } from "@tanstack/react-query";
import { getBasicUserInfo } from "@/lib/user-api";
import { queryKeys } from "@/lib/query-keys";

/**
 * Basic user info for header/sidebar (name, email, profile picture from onboarding, role).
 * Cached so multiple components can use it without duplicate requests.
 */
export function useBasicUserInfo() {
  return useQuery({
    queryKey: queryKeys.user.basicInfo(),
    queryFn: getBasicUserInfo,
    // Only run when user is authenticated (call from components that already check session)
  });
}
