'use client';

import React from 'react';
import { Box, VStack, Skeleton } from '@chakra-ui/react';

/**
 * Shown in route loading.tsx while the dashboard page RSC payload is loading.
 * Gives instant feedback so the first click doesn’t feel stuck.
 */
export function DashboardPageSkeleton() {
  return (
    <Box px={6} py={6}>
      <VStack gap={8} align="stretch">
        <VStack gap={3} align="stretch">
          <Skeleton height="32px" width="240px" borderRadius="md" />
          <Skeleton height="20px" width="360px" borderRadius="md" />
        </VStack>
        <VStack gap={4} align="stretch">
          <Skeleton height="28px" width="180px" borderRadius="md" />
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="200px" borderRadius="lg" />
            ))}
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
}
