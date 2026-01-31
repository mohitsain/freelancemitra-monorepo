"use client";

import React from "react";
import { Box, Stack, Text, HStack } from "@chakra-ui/react";

const TIPS_BOX = {
  base: {
    p: 4,
    border: "1px",
    borderRadius: "lg",
    fontSize: "sm",
  },
  green: {
    borderColor: "green.200",
    bg: "green.50",
    _dark: { borderColor: "green.700", bg: "green.900" },
    titleColor: "green.800" as const,
    textColor: "green.700" as const,
    _darkTitle: { color: "green.200" },
    _darkText: { color: "green.300" },
  },
  blue: {
    borderColor: "blue.200",
    bg: "blue.50",
    _dark: { borderColor: "blue.700", bg: "blue.900" },
    titleColor: "blue.800" as const,
    textColor: "blue.700" as const,
    _darkTitle: { color: "blue.200" },
    _darkText: { color: "blue.300" },
  },
  purple: {
    borderColor: "purple.200",
    bg: "purple.50",
    _dark: { borderColor: "purple.700", bg: "purple.900" },
    titleColor: "purple.800" as const,
    textColor: "purple.700" as const,
    _darkTitle: { color: "purple.200" },
    _darkText: { color: "purple.300" },
  },
};

export interface OnboardingTipsSidebarProps {
  currentStep: number;
  stepTitle: string;
}

export default function OnboardingTipsSidebar({ currentStep, stepTitle }: OnboardingTipsSidebarProps) {
  const stepId = [
    "basic-contact",
    "professional-overview",
    "portfolio",
    "experience",
    "availability",
    "social",
    "testimonials",
    "review",
  ][currentStep];

  // Stick below the onboarding sticky header (~header + progress bar height)
  const stickyHeaderHeight = "120px";

  return (
    <Box
      flex="0 0 30%"
      minW={{ base: "100%", lg: "260px" }}
      maxW={{ lg: "360px" }}
      position="sticky"
      top={stickyHeaderHeight}
      alignSelf="flex-start"
      zIndex={10}
    >
      <Stack gap={2}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.600" _dark={{ color: "gray.400" }}>
          💡 Tips
        </Text>
        {stepId === "basic-contact" && (
          <Box {...TIPS_BOX.base} {...TIPS_BOX.blue}>
            <Text fontWeight="semibold" mb={2} color={TIPS_BOX.blue.titleColor} _dark={TIPS_BOX.blue._darkTitle}>
              Contact & profile
            </Text>
            <Stack gap={2} color={TIPS_BOX.blue.textColor} _dark={TIPS_BOX.blue._darkText}>
              <Text>• Use a clear, professional profile photo.</Text>
              <Text>• Recommended: square image, 400×400px or larger.</Text>
              <Text>• Double-check phone number with country code.</Text>
            </Stack>
          </Box>
        )}
        {stepId === "professional-overview" && (
          <Box {...TIPS_BOX.base} {...TIPS_BOX.green}>
            <Text fontWeight="semibold" mb={2} color={TIPS_BOX.green.titleColor} _dark={TIPS_BOX.green._darkTitle}>
              Headline & bio
            </Text>
            <Stack gap={2} color={TIPS_BOX.green.textColor} _dark={TIPS_BOX.green._darkText}>
              <Text>• Headline: one short, catchy phrase that says what you do.</Text>
              <Text>• Summary: 2–3 sentences; detailed description can be longer.</Text>
              <Text>• Pick skills and specializations that match your real expertise.</Text>
            </Stack>
          </Box>
        )}
        {stepId === "portfolio" && (
          <Box {...TIPS_BOX.base} {...TIPS_BOX.green}>
            <Text fontWeight="semibold" mb={2} color={TIPS_BOX.green.titleColor} _dark={TIPS_BOX.green._darkTitle}>
              Great work samples
            </Text>
            <Stack gap={2} color={TIPS_BOX.green.textColor} _dark={TIPS_BOX.green._darkText}>
              <HStack gap={2} align="flex-start">
                <Text>🎯</Text>
                <Text>Include diverse projects that showcase different skills</Text>
              </HStack>
              <HStack gap={2} align="flex-start">
                <Text>📈</Text>
                <Text>Focus on outcomes and impact, not just what you did</Text>
              </HStack>
              <HStack gap={2} align="flex-start">
                <Text>📊</Text>
                <Text>Use specific metrics (e.g. “Increased conversion by 25%”)</Text>
              </HStack>
              <HStack gap={2} align="flex-start">
                <Text>✍️</Text>
                <Text>Keep descriptions concise but informative</Text>
              </HStack>
              <HStack gap={2} align="flex-start">
                <Text>🛠️</Text>
                <Text>Include both technical and soft skills used</Text>
              </HStack>
            </Stack>
          </Box>
        )}
        {stepId === "experience" && (
          <Box {...TIPS_BOX.base} {...TIPS_BOX.blue}>
            <Text fontWeight="semibold" mb={2} color={TIPS_BOX.blue.titleColor} _dark={TIPS_BOX.blue._darkTitle}>
              Experience & education
            </Text>
            <Stack gap={2} color={TIPS_BOX.blue.textColor} _dark={TIPS_BOX.blue._darkText}>
              <Text>• List most recent roles first.</Text>
              <Text>• Emphasize results and responsibilities.</Text>
              <Text>• Add degrees, certifications, and relevant training.</Text>
            </Stack>
          </Box>
        )}
        {stepId === "availability" && (
          <Box {...TIPS_BOX.base} {...TIPS_BOX.green}>
            <Text fontWeight="semibold" mb={2} color={TIPS_BOX.green.titleColor} _dark={TIPS_BOX.green._darkTitle}>
              Availability & rates
            </Text>
            <Stack gap={2} color={TIPS_BOX.green.textColor} _dark={TIPS_BOX.green._darkText}>
              <Text>• Set realistic hours and start date.</Text>
              <Text>• Hourly/project/retainer rates help clients filter and compare.</Text>
              <Text>• You can adjust rates later in your profile.</Text>
            </Stack>
          </Box>
        )}
        {stepId === "social" && (
          <Box {...TIPS_BOX.base} {...TIPS_BOX.green}>
            <Text fontWeight="semibold" mb={2} color={TIPS_BOX.green.titleColor} _dark={TIPS_BOX.green._darkTitle}>
              Profile visibility
            </Text>
            <Stack gap={2} color={TIPS_BOX.green.textColor} _dark={TIPS_BOX.green._darkText}>
              <Text>• Keep LinkedIn updated and professional</Text>
              <Text>• Use social links to showcase expertise and recent work</Text>
              <Text>• A personal website helps credibility and portfolio</Text>
              <Text>• Ensure all links work and are up to date</Text>
            </Stack>
          </Box>
        )}
        {stepId === "testimonials" && (
          <>
            <Box {...TIPS_BOX.base} {...TIPS_BOX.blue}>
              <Text fontWeight="semibold" mb={2} color={TIPS_BOX.blue.titleColor} _dark={TIPS_BOX.blue._darkTitle}>
                Great testimonials
              </Text>
              <Stack gap={2} color={TIPS_BOX.blue.textColor} _dark={TIPS_BOX.blue._darkText}>
                <Text>• Ask for specific feedback on quality and results</Text>
                <Text>• Request shortly after project completion</Text>
                <Text>• Include scope, timeline, and outcomes</Text>
                <Text>• Get permission for name and company</Text>
                <Text>• Aim for 3–5 strong testimonials</Text>
              </Stack>
            </Box>
            <Box {...TIPS_BOX.base} {...TIPS_BOX.purple}>
              <Text fontWeight="semibold" mb={2} color={TIPS_BOX.purple.titleColor} _dark={TIPS_BOX.purple._darkTitle}>
                Example
              </Text>
              <Text fontStyle="italic" color={TIPS_BOX.purple.textColor} _dark={TIPS_BOX.purple._darkText} fontSize="xs">
                "John delivered exceptional results… completed ahead of schedule, excellent communication, 
                conversion rates increased by 25%. Highly recommend!"
              </Text>
            </Box>
          </>
        )}
        {stepId === "review" && (
          <Box {...TIPS_BOX.base} {...TIPS_BOX.green}>
            <Text fontWeight="semibold" mb={2} color={TIPS_BOX.green.titleColor} _dark={TIPS_BOX.green._darkTitle}>
              Almost done
            </Text>
            <Stack gap={2} color={TIPS_BOX.green.textColor} _dark={TIPS_BOX.green._darkText}>
              <Text>• Review all sections for accuracy.</Text>
              <Text>• Click “Complete Profile” to save and finish.</Text>
              <Text>• You can edit your profile anytime from the dashboard.</Text>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
