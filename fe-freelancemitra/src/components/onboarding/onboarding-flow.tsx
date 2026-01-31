"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Heading,
  Spinner
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BasicContactStep from './steps/basic-contact-step';
import { UnauthorizedError } from '@/lib/api-types';
import { getOnboarding, getOnboardingStatus, submitOnboarding, updateOnboarding, type OnboardingPayload } from '@/lib/onboarding-api';
import { getCountries, getPhoneCodeByCountryName } from '@/lib/locations-api';
import { toastSuccess, toastError } from '@/components/ui/toaster';
import ProfessionalOverviewStep from './steps/professional-overview-step';
import PortfolioStep from './steps/portfolio-step';
import ExperienceEducationStep from './steps/experience-education-step';
import AvailabilityRatesStep from './steps/availability-rates-step';
import SocialMediaStep from './steps/social-media-step';
import TestimonialsStep from './steps/testimonials-step';
import ReviewStep from './steps/review-step';
import OnboardingTipsSidebar from './onboarding-tips-sidebar';

export interface OnboardingData {
  // Basic Contact & Personal Information
  firstName: string;
  lastName: string;
  professionalTitle: string;
  countryPhoneCode: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  profilePicture: string;

  // Professional Overview & Expertise
  headline: string;
  shortSummary: string;
  detailedDescription: string;
  keySkills: string[];
  areasOfSpecialization: string[];
  yearsOfExperience: number;
  languagesSpoken: string;
  
  // Portfolio & Work Samples
  portfolioLink: string;
  portfolioSamples: Array<{
    projectTitle: string;
    client: string;
    description: string;
    skillsUsed: string[];
    portfolioLink: string;
    fileKey: string; // legacy single file
    uploadFile: File | null;
    /** Uploaded files for this sample: max 5, 25MB per sample. */
    uploadedFiles: Array<{ key: string; size: number }>;
  }>;

  // Experience & Education
  workHistory: Array<{
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
  }>;
  certifications: Array<{
    title: string;
    description: string;
    fileKey: string;
  }>;

  // Availability & Rates
  availability: 'full-time' | 'part-time' | 'project-based';
  weeklyHours: number;
  startDate: string;
  hourlyRate: number;
  projectBasedRate: string;
  retainerRate: string;
  currency: string;
  minProjectSize: string;
  
  // Social Media
  linkedinUrl: string;
  otherSocialMedia: string;
  personalWebsite: string;
  
  // Testimonials
  testimonials: Array<{
    clientName: string;
    clientTitle: string;
    testimonial: string;
  }>;
}

const STEPS = [
  { id: 'basic-contact', title: 'Basic Contact & Personal Information', component: BasicContactStep },
  { id: 'professional-overview', title: 'Professional Overview & Expertise', component: ProfessionalOverviewStep },
  { id: 'portfolio', title: 'Portfolio & Work Samples', component: PortfolioStep },
  { id: 'experience', title: 'Experience & Education', component: ExperienceEducationStep },
  { id: 'availability', title: 'Availability & Rates', component: AvailabilityRatesStep },
  { id: 'social', title: 'Social Media & Links', component: SocialMediaStep },
  { id: 'testimonials', title: 'Client Testimonials', component: TestimonialsStep },
  { id: 'review', title: 'Review & Complete', component: ReviewStep },
];

/** Strip File from portfolioSamples for API payload */
function toOnboardingPayload(data: OnboardingData): OnboardingPayload {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    professionalTitle: data.professionalTitle,
    countryPhoneCode: data.countryPhoneCode,
    phoneNumber: data.phoneNumber,
    city: data.city,
    state: data.state,
    country: data.country,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    postalCode: data.postalCode,
    profilePicture: data.profilePicture,
    headline: data.headline,
    shortSummary: data.shortSummary,
    detailedDescription: data.detailedDescription,
    keySkills: data.keySkills,
    areasOfSpecialization: data.areasOfSpecialization,
    yearsOfExperience: data.yearsOfExperience,
    languagesSpoken: data.languagesSpoken,
    portfolioLink: data.portfolioLink,
    portfolioSamples: data.portfolioSamples.map(({ uploadFile, ...rest }) => rest),
    workHistory: data.workHistory,
    education: data.education,
    certifications: data.certifications.map(({ title, description, fileKey }) => ({ title, description, fileKey })),
    availability: data.availability,
    weeklyHours: data.weeklyHours,
    startDate: data.startDate,
    hourlyRate: data.hourlyRate,
    projectBasedRate: data.projectBasedRate,
    retainerRate: data.retainerRate,
    currency: data.currency,
    minProjectSize: data.minProjectSize,
    linkedinUrl: data.linkedinUrl,
    otherSocialMedia: data.otherSocialMedia,
    personalWebsite: data.personalWebsite,
    testimonials: data.testimonials,
  };
}

/** Map API payload to full OnboardingData (add uploadFile: null, ensure fileKey). Email and lastStepIndex not in form. */
function payloadToData(payload: OnboardingPayload): OnboardingData {
  const { email: _e, lastStepIndex: _s, ...rest } = payload as OnboardingPayload & { email?: string };
  return {
    ...rest,
    availability: (rest.availability as OnboardingData['availability']) ?? 'full-time',
    portfolioSamples: payload.portfolioSamples.map((s) => ({
      ...s,
      fileKey: (s as { fileKey?: string }).fileKey ?? '',
      uploadFile: null,
      uploadedFiles: (s as { uploadedFiles?: Array<{ key: string; size: number }> }).uploadedFiles ?? [],
    })),
  };
}

type InitState = 'session' | 'status' | 'ready' | 'redirect-home' | 'error';

export default function OnboardingFlow() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [initState, setInitState] = useState<InitState>('session');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [saveDraftState, setSaveDraftState] = useState<'idle' | 'saving' | 'error'>('idle');
  const hasBeenLoadingRef = useRef(false);
  const statusRef = useRef(status);
  statusRef.current = status;
  const [data, setData] = useState<OnboardingData>({
    // Basic Contact & Personal Information
    firstName: '',
    lastName: '',
    professionalTitle: '',
    countryPhoneCode: '',
    phoneNumber: '',
    city: '',
    state: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    profilePicture: '',
    
    // Professional Overview & Expertise
    headline: '',
    shortSummary: '',
    detailedDescription: '',
    keySkills: [],
    areasOfSpecialization: [],
    yearsOfExperience: 0,
    languagesSpoken: '',
    
    // Portfolio & Work Samples
    portfolioLink: '',
    portfolioSamples: [{
      projectTitle: '',
      client: '',
      description: '',
      skillsUsed: [],
      portfolioLink: '',
      fileKey: '',
      uploadFile: null,
      uploadedFiles: []
    }],

    // Experience & Education
    workHistory: [{ company: '', jobTitle: '', startDate: '', endDate: '', responsibilities: '' }],
    education: [{ degree: '', institution: '', graduationYear: '' }],
    certifications: [{ title: '', description: '', fileKey: '' }],

    // Availability & Rates
    availability: 'full-time',
    weeklyHours: 40,
    startDate: '',
    hourlyRate: 0,
    projectBasedRate: '',
    retainerRate: '',
    currency: 'USD',
    minProjectSize: '',
    
    // Social Media
    linkedinUrl: '',
    otherSocialMedia: '',
    personalWebsite: '',
    
    // Testimonials
    testimonials: [{ clientName: '', clientTitle: '', testimonial: '' }],
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Remember we've seen "loading" so we only redirect after session has actually been fetched (avoids redirect loop after OAuth)
  useEffect(() => {
    if (status === "loading") hasBeenLoadingRef.current = true;
  }, [status]);

  // If we're still unauthenticated after 2s (e.g. never saw "loading"), allow redirect so we don't spin forever
  useEffect(() => {
    const t = setTimeout(() => {
      if (statusRef.current === "unauthenticated") hasBeenLoadingRef.current = true;
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Redirect to sign-in only after we've seen loading then unauthenticated (not on initial unauthenticated before hydrate)
  useEffect(() => {
    if (status === "unauthenticated" && hasBeenLoadingRef.current) {
      router.replace("/signin?callbackUrl=/onboarding");
    }
  }, [status, router]);

  // When authenticated: check onboarding status first; only then show form or redirect. Single loader until we know.
  useEffect(() => {
    if (status !== "authenticated") return;
    setInitState("status");
    let cancelled = false;
    getOnboardingStatus()
      .then((statusRes) => {
        if (cancelled) return;
        if (statusRes.completed) {
          setInitState("redirect-home");
          router.replace("/");
          return { redirect: true } as const;
        }
        return getOnboarding().then((payload) => ({ redirect: false, payload }));
      })
      .then((result) => {
        if (cancelled || !result || result.redirect) return;
        if (result.payload) {
          const data = payloadToData(result.payload);
          const lastStep = result.payload.lastStepIndex ?? 0;
          const step = Math.min(Math.max(0, lastStep), STEPS.length - 1);
          setCurrentStep(step);
          // Normalize country_phone_code: if DB has country name (e.g. "India"), resolve to dial code (e.g. "+91") so UI shows "IN (+91)" and we persist the code
          getCountries()
            .then((list) => {
              const code = getPhoneCodeByCountryName(list, data.countryPhoneCode);
              if (code) data.countryPhoneCode = code;
              setData(data);
              setInitState("ready");
            })
            .catch(() => {
              setData(data);
              setInitState("ready");
            });
        } else setInitState("ready");
      })
      .catch(() => {
        if (!cancelled) setInitState("error");
      });
    return () => { cancelled = true; };
  }, [status, router]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = async () => {
    if (currentStep < STEPS.length - 1) {
      const nextIndex = currentStep + 1;
      // Save data and resume step so user continues from here if they log in again
      updateOnboarding({ ...toOnboardingPayload(data), lastStepIndex: nextIndex }).then(
        () => {},
        () => {}
      );
      setCurrentStep(nextIndex);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setSaveDraftState('saving');
    try {
      await updateOnboarding({ ...toOnboardingPayload(data), lastStepIndex: currentStep });
      setSaveDraftState('idle');
      toastSuccess('Draft saved', 'Your progress has been saved. You can continue later.');
    } catch (err) {
      setSaveDraftState('error');
      if (err instanceof UnauthorizedError) {
        toastError("Session expired", "Please sign in again to save your profile.");
        router.replace("/signin?callbackUrl=/onboarding");
        return;
      }
      toastError("Could not save draft", err instanceof Error ? err.message : "Please try again.");
    }
  };

  const handleComplete = async () => {
    setSubmitState('submitting');
    try {
      await submitOnboarding(toOnboardingPayload(data));
      setSubmitState('done');
      toastSuccess('Profile saved', 'Your onboarding has been completed successfully.');
      setTimeout(() => {
        window.location.href = '/';
      }, 800);
    } catch (err) {
      setSubmitState("error");
      if (err instanceof UnauthorizedError) {
        toastError("Session expired", "Please sign in again to save your profile.");
        router.replace("/signin?callbackUrl=/onboarding");
        return;
      }
      toastError("Could not save profile", err instanceof Error ? err.message : "Please try again.");
    }
  };

  const handleSkipOnboarding = () => {
    // Redirect to home page
    router.push('/');
  };

  // Single loader: while session is loading, or while checking onboarding status (so we never flash the form when already onboarded)
  const showLoader =
    status === "loading" ||
    (status === "unauthenticated" && !hasBeenLoadingRef.current) ||
    (status === "authenticated" && (initState === "session" || initState === "status" || initState === "redirect-home"));

  if (showLoader) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} />
          <Text color="gray.500" fontSize="sm">Loading…</Text>
        </Box>
      </Box>
    );
  }
  if (status === "unauthenticated") {
    return null; // redirect to signin in progress
  }
  if (initState === "error") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="40vh">
        <Text color="red.500">Failed to load. Please refresh or sign in again.</Text>
      </Box>
    );
  }
  if (initState !== "ready") {
    return null;
  }

  const CurrentStepComponent = STEPS[currentStep].component;
  const progressPercentage = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <Box
      bg={cardBg}
      p={6}
      rounded="xl"
      shadow="2xl"
      border="1px"
      borderColor={borderColor}
      w="full"
      maxW="1200px"
      mx="auto"
    >
      <Stack direction="column" gap={3} align="stretch">
        {/* Header: common to both sections */}
        <Stack direction="column" gap={2}>
          <Stack direction="column" gap={2} align="center" w="full">
            <HStack gap={4} justify="center">
              <Box
                w={14}
                h={14}
                borderRadius="full"
                bg="gradient-to-br from-blue.500 to-purple.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 10px 25px -5px rgba(66, 153, 225, 0.4)"
              >
                <Text fontSize="2xl" color="white" fontWeight="bold">
                  🚀
                </Text>
              </Box>
              <Box textAlign="center">
                <Heading size="lg" bg="gradient-to-r from-blue.600 to-purple.600" bgClip="text" _dark={{ bgClip: 'text' }}>
                  Complete Your Profile
                </Heading>
                <Text color="gray.600" fontSize="md" mt={1} _dark={{ color: 'gray.300' }}>
                  Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
                </Text>
              </Box>
            </HStack>
            <HStack gap={3} justify="center" flexWrap="wrap">
              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
                onClick={handleSkipOnboarding}
                borderRadius="lg"
                borderWidth="2px"
                px={5}
                _hover={{
                  bg: 'blue.50',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
                }}
                transition="all 0.2s"
              >
                ⏭️ Skip Onboarding
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                borderRadius="lg"
                borderWidth="2px"
                px={5}
                _hover={{
                  bg: 'red.50',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)'
                }}
                transition="all 0.2s"
              >
                🚪 Sign Out
              </Button>
            </HStack>
          </Stack>
        </Stack>

        {/* Progress Bar: full width */}
        <Box
          w="full"
          bg="gray.100"
          rounded="full"
          h="10px"
          overflow="hidden"
          position="relative"
          cursor="pointer"
          _dark={{ bg: 'gray.700' }}
          _hover={{
            transform: 'scale(1.02)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          transition="all 0.3s ease"
          title={`${progressPercentage}% Complete - Step ${currentStep + 1} of ${STEPS.length}`}
        >
          <Box
            bg="linear-gradient(90deg, #48BB78 0%, #38A169 100%)"
            h="full"
            w={`${progressPercentage}%`}
            transition="all 0.5s ease-in-out"
            position="relative"
            rounded="full"
            boxShadow="0 2px 8px rgba(72, 187, 120, 0.3)"
            _hover={{
              boxShadow: '0 4px 16px rgba(72, 187, 120, 0.4)'
            }}
          >
            {/* Animated shimmer effect */}
            <Box
              position="absolute"
              top="0"
              left="-100%"
              h="full"
              w="100%"
              bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
              animation="shimmer 2s infinite"
            />
            
            {/* Progress indicator dot */}
            <Box
              position="absolute"
              right="1px"
              top="50%"
              transform="translateY(-50%)"
              h="6px"
              w="6px"
              bg="white"
              rounded="full"
              boxShadow="0 0 8px rgba(0, 0, 0, 0.3)"
              border="2px solid"
              borderColor="green.500"
            />
          </Box>
        </Box>

      <HStack align="stretch" gap={3} flexWrap={{ base: "wrap", lg: "nowrap" }}>
        {/* Left: Tips (30%) */}
        <OnboardingTipsSidebar currentStep={currentStep} stepTitle={STEPS[currentStep].title} />

        {/* Right: Forms (70%) */}
        <Box flex="1 1 70%" minW={0} w={{ base: "100%", lg: "70%" }}>
          <Stack direction="column" gap={3} align="stretch">
            {/* Step Content */}
            <Box minH="300px">
              {currentStep === STEPS.length - 1 ? (
                <ReviewStep
                  data={data}
                  updateData={updateData}
                  email={session?.user?.email ?? undefined}
                />
              ) : (
                <CurrentStepComponent
                  data={data}
                  updateData={updateData}
                />
              )}
            </Box>

            {/* Navigation */}
            <HStack justify="space-between" pt={4} flexWrap="wrap" gap={3}>
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="solid"
                colorScheme="gray"
                size="md"
                borderRadius="lg"
                px={6}
                bg="gray.200"
                color="gray.800"
                _dark={{ bg: 'gray.600', color: 'white' }}
                _hover={{
                  bg: 'gray.300',
                  _dark: { bg: 'gray.500' },
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                _disabled={{
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  transform: 'none',
                  boxShadow: 'none'
                }}
                transition="all 0.2s"
              >
                ← Previous
              </Button>

              <HStack gap={3} flexWrap="wrap">
                <Button
                  variant="solid"
                  colorScheme="teal"
                  size="md"
                  onClick={handleSaveDraft}
                  loading={saveDraftState === 'saving'}
                  loadingText="Saving…"
                  borderRadius="lg"
                  px={5}
                  bg="teal.500"
                  color="white"
                  _hover={{
                    bg: 'teal.600',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(45, 212, 191, 0.4)'
                  }}
                  transition="all 0.2s"
                >
                  💾 Save draft
                </Button>
                {currentStep === STEPS.length - 1 ? (
                  <Button
                    onClick={handleComplete}
                    colorScheme="green"
                    size="md"
                    px={8}
                    borderRadius="lg"
                    bg="linear-gradient(90deg, #48BB78, #38A169)"
                    isLoading={submitState === 'submitting'}
                    loadingText="Saving…"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px -5px rgba(72, 187, 120, 0.4)',
                      bg: 'linear-gradient(90deg, #38A169, #2F855A)'
                    }}
                    transition="all 0.2s"
                  >
                    🎉 Complete Profile →
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    colorScheme="blue"
                    size="md"
                    px={8}
                    borderRadius="lg"
                    bg="gradient-to-r from-blue.500 to-purple.600"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px -5px rgba(66, 153, 225, 0.4)'
                    }}
                    transition="all 0.2s"
                  >
                    Next →
                  </Button>
                )}
              </HStack>
            </HStack>
          </Stack>
        </Box>
      </HStack>
    </Stack>
      
      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </Box>
  );
}
