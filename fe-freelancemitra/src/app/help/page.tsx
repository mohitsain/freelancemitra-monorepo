"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Box,
  Container,
  Text,
  VStack,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { FaQuestionCircle, FaEnvelope, FaBook } from "react-icons/fa";
import { useColorMode } from "@/components/ui/color-mode";

export default function HelpPage() {
  const router = useRouter();
  const { status } = useSession();
  const { colorMode } = useColorMode();
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <DashboardLayout>
      <Container maxW="4xl" py={8}>
        <VStack align="stretch" gap={8}>
          <VStack align="start" gap={2}>
            <Heading size="lg" color={textPrimary}>
              Help
            </Heading>
            <Text color={textSecondary} fontSize="md">
              Find answers and get support for FreelanceMitra.
            </Text>
          </VStack>

          <VStack align="stretch" gap={4}>
            <Box
              p={6}
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack align="start" gap={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FaBook color="var(--chakra-colors-blue-500)" size={20} />
                  <Text fontWeight="semibold" color={textPrimary}>
                    Documentation
                  </Text>
                </Box>
                <Text color={textSecondary} fontSize="sm">
                  Learn how to use FreelanceMitra: creating portfolios, proposals, managing leads, and more.
                </Text>
              </VStack>
            </Box>

            <Box
              p={6}
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack align="start" gap={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FaQuestionCircle color="var(--chakra-colors-blue-500)" size={20} />
                  <Text fontWeight="semibold" color={textPrimary}>
                    FAQ
                  </Text>
                </Box>
                <Text color={textSecondary} fontSize="sm">
                  Common questions about billing, account settings, and features.
                </Text>
              </VStack>
            </Box>

            <Box
              p={6}
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack align="start" gap={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FaEnvelope color="var(--chakra-colors-blue-500)" size={20} />
                  <Text fontWeight="semibold" color={textPrimary}>
                    Contact support
                  </Text>
                </Box>
                <Text color={textSecondary} fontSize="sm">
                  Need help? Reach out to our support team and we’ll get back to you as soon as we can.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </DashboardLayout>
  );
}
