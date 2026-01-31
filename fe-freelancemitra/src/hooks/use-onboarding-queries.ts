"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getOnboardingStatus,
  getOnboarding,
  submitOnboarding,
  updateOnboarding,
} from "@/lib/onboarding-api";
import { queryKeys } from "@/lib/query-keys";

/**
 * TanStack Query hooks for onboarding (server state).
 * Use these instead of raw fetch + useState for caching, refetch, and loading/error state.
 */

export function useOnboardingStatus() {
  return useQuery({
    queryKey: queryKeys.onboarding.status(),
    queryFn: getOnboardingStatus,
    // Only run when user is authenticated (call from components that already check session)
  });
}

export function useOnboarding() {
  return useQuery({
    queryKey: queryKeys.onboarding.detail(),
    queryFn: getOnboarding,
  });
}

export function useSubmitOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.basicInfo() });
    },
  });
}

export function useUpdateOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.basicInfo() });
    },
  });
}
