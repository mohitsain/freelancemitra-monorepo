"use client";

import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { FaCheck, FaTimes, FaCrown } from "react-icons/fa";

const ALL_FEATURES = [
  "1 portfolio",
  "3 proposals per month",
  "Basic templates",
  "Community support",
  "5 portfolios",
  "Unlimited proposals",
  "AI proposal assistant",
  "Lead management",
  "Invoice generation",
  "Email support",
  "Unlimited portfolios",
  "AI proposal generator",
  "Lead scoring & CRM",
  "Invoices & payment tracking",
  "Extensions (LinkedIn, Upwork)",
  "Integrations & API",
  "Priority support",
] as const;

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with essential tools",
    includedCount: 4,
    popular: false,
    cta: "Current plan",
  },
  {
    id: "plus",
    name: "Plus",
    price: "$19",
    period: "/month",
    description: "For growing freelancers",
    includedCount: 10,
    popular: true,
    cta: "Upgrade to Plus",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Full toolkit for serious freelancers",
    includedCount: ALL_FEATURES.length,
    popular: false,
    cta: "Upgrade to Pro",
  },
] as const;

export default function PlanPage() {
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.400" : "gray.600";

  return (
    <DashboardLayout>
      <Box px={6} py={6}>
        <VStack gap={10} align="stretch">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={6}
            w="full"
            maxW="5xl"
            mx="auto"
          >
            {PLANS.map((plan) => (
              <Box
                key={plan.id}
                bg={cardBg}
                border="2px"
                borderColor={borderColor}
                borderRadius="xl"
                p={6}
                position="relative"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
              >
                {plan.popular && (
                  <Badge
                    position="absolute"
                    top={-3}
                    right={4}
                    colorScheme="gray"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    Most popular
                  </Badge>
                )}
                <VStack gap={5} align="stretch" textAlign="left">
                  <HStack gap={2} align="center">
                    <Icon
                      as={FaCrown}
                      color={textSecondary}
                      fontSize="xl"
                    />
                    <Heading size="md" color={textPrimary}>
                      {plan.name}
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color={textSecondary}>
                    {plan.description}
                  </Text>
                  <HStack gap={1} align="baseline">
                    <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                      {plan.price}
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      {plan.period}
                    </Text>
                  </HStack>
                  <VStack gap={3} align="stretch" py={2}>
                    {ALL_FEATURES.map((feature, i) => {
                      const included = i < plan.includedCount;
                      return (
                        <HStack key={i} gap={3} align="flex-start">
                          <Icon
                            as={included ? FaCheck : FaTimes}
                            color={included ? "green.500" : "red.500"}
                            mt={0.5}
                            flexShrink={0}
                            fontSize="sm"
                          />
                          <Text
                            fontSize="sm"
                            color={included ? textPrimary : textSecondary}
                          >
                            {feature}
                          </Text>
                        </HStack>
                      );
                    })}
                  </VStack>
                  <Button
                    colorScheme="gray"
                    variant={plan.popular ? "solid" : "outline"}
                    size="md"
                    w="full"
                    mt={2}
                    disabled={plan.id === "free"}
                  >
                    {plan.cta}
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </DashboardLayout>
  );
}
