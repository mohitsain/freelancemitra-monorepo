/**
 * Central query keys for TanStack Query.
 * Use these in useQuery / useMutation so cache is consistent and invalidatable.
 */

export const queryKeys = {
  onboarding: {
    all: ["onboarding"] as const,
    status: () => [...queryKeys.onboarding.all, "status"] as const,
    detail: () => [...queryKeys.onboarding.all, "detail"] as const,
  },
  locations: {
    all: ["locations"] as const,
    countries: (region?: string) =>
      region ? [...queryKeys.locations.all, "countries", region] : [...queryKeys.locations.all, "countries"] as const,
    regions: () => [...queryKeys.locations.all, "regions"] as const,
    states: (countryCode: string) => [...queryKeys.locations.all, "states", countryCode] as const,
  },
  user: {
    me: () => ["user", "me"] as const,
    basicInfo: () => ["user", "me", "basic-info"] as const,
  },
} as const;
