"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Box,
  VStack,
  Text,
  Heading,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { useOnboarding, useUpdateOnboarding, useSubmitOnboarding } from "@/hooks/use-onboarding-queries";
import {
  payloadToData,
  toOnboardingPayload,
  type OnboardingData,
} from "@/components/onboarding/onboarding-flow";
import BasicContactStep from "@/components/onboarding/steps/basic-contact-step";
import ProfessionalOverviewStep from "@/components/onboarding/steps/professional-overview-step";
import PortfolioStep from "@/components/onboarding/steps/portfolio-step";
import ExperienceEducationStep from "@/components/onboarding/steps/experience-education-step";
import AvailabilityRatesStep from "@/components/onboarding/steps/availability-rates-step";
import SocialMediaStep from "@/components/onboarding/steps/social-media-step";
import TestimonialsStep from "@/components/onboarding/steps/testimonials-step";
import { toastSuccess, toastError } from "@/components/ui/toaster";
import { getCountries, getPhoneCodeByCountryName } from "@/lib/locations-api";
import { areAllStepsValid, getInvalidFieldKeys, getStepValidationErrors } from "@/lib/onboarding-validation";
import Link from "next/link";

const PROFILE_SECTIONS = [
  { id: "basic-contact", title: "Basic Contact & Personal Information" },
  { id: "professional-overview", title: "Professional Overview & Expertise" },
  { id: "portfolio", title: "Portfolio & Work Samples" },
  { id: "experience", title: "Experience & Education" },
  { id: "availability", title: "Availability & Rates" },
  { id: "social", title: "Social Media & Links" },
  { id: "testimonials", title: "Client Testimonials" },
] as const;

function getDefaultOnboardingData(): OnboardingData {
  return {
    firstName: "",
    lastName: "",
    professionalTitle: "",
    countryPhoneCode: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    profilePicture: "",
    headline: "",
    shortSummary: "",
    detailedDescription: "",
    keySkills: [],
    areasOfSpecialization: [],
    yearsOfExperience: 0,
    languagesSpoken: "",
    portfolioLink: "",
    portfolioSamples: [
      {
        projectTitle: "",
        client: "",
        description: "",
        skillsUsed: [],
        portfolioLink: "",
        fileKey: "",
        uploadFile: null,
        uploadedFiles: [],
      },
    ],
    workHistory: [
      { company: "", jobTitle: "", startDate: "", endDate: "", responsibilities: "" },
    ],
    education: [{ degree: "", institution: "", graduationYear: "" }],
    certifications: [{ title: "", description: "", fileKey: "" }],
    availability: "full-time",
    weeklyHours: 40,
    startDate: "",
    hourlyRate: 0,
    projectBasedRate: "",
    retainerRate: "",
    currency: "USD",
    minProjectSize: "",
    linkedinUrl: "",
    otherSocialMedia: "",
    personalWebsite: "",
    testimonials: [
      { clientName: "", clientTitle: "", testimonial: "", imageKey: "" },
    ],
  };
}

const SECTION_COMPONENTS = [
  BasicContactStep,
  ProfessionalOverviewStep,
  PortfolioStep,
  ExperienceEducationStep,
  AvailabilityRatesStep,
  SocialMediaStep,
  TestimonialsStep,
] as const;

export default function ProfilePage() {
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.400" : "gray.600";

  const { data: onboardingPayload, isLoading, isError } = useOnboarding();
  const updateMutation = useUpdateOnboarding();
  const submitMutation = useSubmitOnboarding();

  const [data, setData] = useState<OnboardingData>(getDefaultOnboardingData);
  const [saving, setSaving] = useState(false);
  const [invalidFieldKeys, setInvalidFieldKeys] = useState<string[]>([]);
  const lastSavedSnapshotRef = useRef<string>("");

  useEffect(() => {
    if (onboardingPayload) {
      getCountries()
        .then((list) => {
          const mapped = payloadToData(onboardingPayload);
          const code = getPhoneCodeByCountryName(list, mapped.countryPhoneCode);
          if (code) mapped.countryPhoneCode = code;
          setData(mapped);
          lastSavedSnapshotRef.current = JSON.stringify(toOnboardingPayload(mapped));
        })
        .catch(() => {
          const mapped = payloadToData(onboardingPayload);
          setData(mapped);
          lastSavedSnapshotRef.current = JSON.stringify(toOnboardingPayload(mapped));
        });
    } else if (!isLoading && !isError) {
      const defaultData = getDefaultOnboardingData();
      setData(defaultData);
      lastSavedSnapshotRef.current = JSON.stringify(toOnboardingPayload(defaultData));
    }
  }, [onboardingPayload, isLoading, isError]);

  const hasChanges = JSON.stringify(toOnboardingPayload(data)) !== lastSavedSnapshotRef.current;

  const updateData = useCallback((partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setInvalidFieldKeys((prev) => prev.filter((key) => !(key in partial)));
  }, []);

  const handleSave = useCallback(async () => {
    if (!areAllStepsValid(data)) {
      const keys = getInvalidFieldKeys(data);
      setInvalidFieldKeys(keys);
      const firstStepWithError = [0, 1, 2, 3, 4, 5, 6].find((i) =>
        getStepValidationErrors(data, i).length
      );
      const sectionId = firstStepWithError !== undefined ? PROFILE_SECTIONS[firstStepWithError]?.id : PROFILE_SECTIONS[0].id;
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      toastError("Please fill in all required fields. Invalid fields are highlighted.");
      return;
    }
    setInvalidFieldKeys([]);
    setSaving(true);
    try {
      const payload = toOnboardingPayload(data);
      if (onboardingPayload) {
        await updateMutation.mutateAsync(payload);
        toastSuccess("Profile saved.");
      } else {
        await submitMutation.mutateAsync(payload);
        toastSuccess("Profile saved.");
      }
      lastSavedSnapshotRef.current = JSON.stringify(payload);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }, [data, onboardingPayload, updateMutation, submitMutation]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="lg" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box display="flex" flexDirection={{ base: "column", lg: "row" }} gap={4}>
        {/* Left: sticky bookmarks */}
        <Box
          as="nav"
          aria-label="Profile sections"
          w={{ base: "full", lg: "220px" }}
          flexShrink={0}
          position={{ lg: "sticky" }}
          top={{ lg: "100px" }}
          alignSelf={{ lg: "flex-start" }}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
          h="fit-content"
        >
          <Text fontSize="xs" fontWeight="semibold" color={textPrimary} textTransform="uppercase" mb={3}>
            Sections
          </Text>
          <VStack gap={1} align="stretch">
            {PROFILE_SECTIONS.map((section) => (
              <Link key={section.id} href={`/profile#${section.id}`} style={{ textDecoration: "none" }}>
                <Box
                  fontSize="sm"
                  color={textPrimary}
                  py={2}
                  px={2}
                  borderRadius="md"
                  _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}
                  transition="background 0.2s"
                >
                  {section.title}
                </Box>
              </Link>
            ))}
          </VStack>
          <Box pt={6} mt={6} borderTopWidth="1px" borderColor={borderColor}>
            <Button
              size="md"
              colorScheme={hasChanges ? "blue" : "gray"}
              variant="solid"
              w="full"
              onClick={handleSave}
              loading={saving}
              disabled={!hasChanges}
              cursor={hasChanges ? "pointer" : "not-allowed"}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

        {/* Right: scrollable sections */}
        <Box flex={1} minW={0}>
          <VStack gap={8} align="stretch">
            {PROFILE_SECTIONS.map((section, index) => {
              const SectionComponent = SECTION_COMPONENTS[index];
              return (
                <Box
                  key={section.id}
                  id={section.id}
                  scrollMarginTop="120px"
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={6}
                >
                  <Heading size="md" color={textPrimary} mb={4}>
                    {section.title}
                  </Heading>
                  <SectionComponent data={data} updateData={updateData} invalidFields={invalidFieldKeys} />
                </Box>
              );
            })}
          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
