"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Heading,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useColorModeValue } from '@/components/ui/color-mode';
import { ColorModeButton } from '@/components/ui/color-mode';
import { Tooltip } from '@/components/ui/tooltip';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BasicContactStep from './steps/basic-contact-step';
import { UnauthorizedError } from '@/lib/api-types';
import { getOnboarding, getOnboardingStatus, submitOnboarding, updateOnboarding, type OnboardingPayload } from '@/lib/onboarding-api';
import { getCountries, getPhoneCodeByCountryName } from '@/lib/locations-api';
import { toastSuccess, toastError } from '@/components/ui/toaster';
import { getStepValidationErrors, isStepValid, areAllStepsValid } from '@/lib/onboarding-validation';
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
    imageKey: string;
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
    testimonials: [{ clientName: '', clientTitle: '', testimonial: '', imageKey: '' }],
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
    if (currentStep >= STEPS.length - 1) return;
    const errors = getStepValidationErrors(data, currentStep);
    if (errors.length > 0) {
      toastError('Required fields missing', errors[0]);
      return;
    }
    const nextIndex = currentStep + 1;
    updateOnboarding({ ...toOnboardingPayload(data), lastStepIndex: nextIndex }).then(
      () => {},
      () => {}
    );
    setCurrentStep(nextIndex);
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
    if (!areAllStepsValid(data)) {
      const stepIndex = Array.from({ length: STEPS.length }, (_, i) => i).find(
        (i) => getStepValidationErrors(data, i).length > 0
      );
      const errors = stepIndex != null ? getStepValidationErrors(data, stepIndex) : [];
      toastError(
        'Complete all required fields',
        errors[0] ?? `Please fill all mandatory fields in Step ${(stepIndex ?? 0) + 1} and earlier.`
      );
      return;
    }
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
  const isCurrentStepValid = isStepValid(data, currentStep);
  const canComplete = areAllStepsValid(data);

  const navBarHeight = 72;
  const navBarMinHeightMobile = 64;

  return (
    <Box w="full" minH="100vh" px={{ base: 3, md: 6 }} pt={4} pb={{ base: `${navBarMinHeightMobile + 24}px`, md: `${navBarHeight + 16}px` }} bg={cardBg}>
      <Stack direction="column" gap={3} align="stretch" maxW="1400px" mx="auto">
        {/* Sticky header: Step left, theme + Sign Out right */}
        <Box
          position="sticky"
          top={0}
          zIndex={20}
          bg={cardBg}
          py={3}
          mx={{ base: -3, md: -6 }}
          px={{ base: 3, md: 6 }}
          borderBottomWidth="1px"
          borderColor={borderColor}
          _dark={{ borderColor: 'gray.600' }}
        >
          <Stack direction="column" gap={3} align="stretch">
            <HStack justify="space-between" align="center" w="full" flexWrap="wrap" gap={2}>
          <HStack gap={3} align="center" minW={0} flex={1}>
            <Box
              as="img"
              src="/FreelanceMitraIcon.png"
              alt="FreelanceMitra"
              w="56px"
              h="56px"
              flexShrink={0}
              objectFit="contain"
            />
            <Box minW={0} flex={1}>
              <Text color="gray.600" fontSize="sm" _dark={{ color: 'gray.400' }}>
                Complete Your Profile
              </Text>
              <Heading
                size="md"
                color="gray.800"
                _dark={{ color: 'white' }}
                fontSize={{ base: 'md', sm: 'lg' }}
              >
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </Heading>
            </Box>
          </HStack>
          <HStack gap={2} flexShrink={0}>
            <Tooltip content="Toggle dark mode">
              <Box as="span" display="inline-block">
                <ColorModeButton size="md" variant="outline" aria-label="Toggle theme" />
              </Box>
            </Tooltip>
            <Tooltip content="Sign Out">
              <IconButton
                aria-label="Sign Out"
                variant="outline"
                colorScheme="red"
                size="md"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <FaSignOutAlt size={20} />
              </IconButton>
            </Tooltip>
          </HStack>
            </HStack>

            {/* Progress Bar: segmented by steps, step number visible in each segment; click segment to go to step */}
            <Box
              w="full"
              position="relative"
              h="40px"
              title={`Step ${currentStep + 1} of ${STEPS.length}`}
            >
              <HStack w="full" h="20px" gap="2px" align="stretch" position="absolute" top="50%" left={0} right={0} transform="translateY(-50%)">
                {Array.from({ length: STEPS.length }, (_, i) => (
                  <Box
                    key={i}
                    flex={1}
                    minW={0}
                    h="full"
                    borderRadius="full"
                    overflow="hidden"
                    bg="gray.100"
                    _dark={{ bg: 'gray.700' }}
                    position="relative"
                    cursor="pointer"
                    title={`Step ${i + 1}: ${STEPS[i].title}`}
                    onClick={() => setCurrentStep(i)}
                    _hover={{ opacity: 0.9 }}
                    transition="opacity 0.2s"
                  >
                    <Box
                      w={i <= currentStep ? '100%' : '0%'}
                      h="full"
                      bg="linear-gradient(90deg, #48BB78 0%, #38A169 100%)"
                      transition="width 0.5s ease-in-out"
                      position="relative"
                      rounded="full"
                      boxShadow="0 2px 8px rgba(72, 187, 120, 0.3)"
                    >
                      {i === currentStep && (
                        <Box
                          position="absolute"
                          top={0}
                          left="-100%"
                          h="full"
                          w="100%"
                          bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                          animation="shimmer 2s infinite"
                        />
                      )}
                    </Box>
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      zIndex={2}
                      pointerEvents="none"
                      w="20px"
                      h="20px"
                      borderRadius="full"
                      bg={i <= currentStep ? 'white' : 'white'}
                      border="2px"
                      borderColor={i <= currentStep ? 'green.500' : 'gray.300'}
                      _dark={{
                        bg: i <= currentStep ? 'gray.800' : 'gray.700',
                        borderColor: i <= currentStep ? 'green.400' : 'gray.500',
                      }}
                      boxShadow={i <= currentStep ? '0 1px 4px rgba(0, 0, 0, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.08)'}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color={i <= currentStep ? 'green.700' : 'gray.500'}
                        _dark={{
                          color: i <= currentStep ? 'green.300' : 'gray.400',
                        }}
                      >
                        {i + 1}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </HStack>
            </Box>
          </Stack>
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
          </Stack>
        </Box>
      </HStack>
    </Stack>

      {/* Sticky bottom navigation */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        minH={{ base: `${navBarMinHeightMobile}px`, md: `${navBarHeight}px` }}
        py={{ base: 3, md: 0 }}
        bg={cardBg}
        borderTopWidth="1px"
        borderColor={borderColor}
        boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
        _dark={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.3)" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={10}
      >
        <Stack direction="column" align="stretch" w="full" maxW="1400px" px={{ base: 3, md: 6 }} gap={1}>
        <HStack
          justify="space-between"
          align="center"
          alignContent={{ base: "center", md: "stretch" }}
          w="full"
          gap={{ base: 2, md: 3 }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
          flexDirection="row"
        >
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="solid"
            colorScheme="gray"
            size={{ base: "sm", md: "md" }}
            borderRadius="lg"
            px={{ base: 3, md: 6 }}
            flexShrink={0}
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

          <HStack gap={{ base: 2, md: 3 }} flexShrink={1} justify="flex-end" minW={0} ml={{ base: "auto", md: 0 }}>
            <Button
              variant="solid"
              colorScheme="teal"
              size={{ base: "sm", md: "md" }}
              onClick={handleSaveDraft}
              loading={saveDraftState === 'saving'}
              loadingText="Saving…"
              borderRadius="lg"
              px={{ base: 3, md: 5 }}
              flexShrink={0}
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
                size={{ base: "sm", md: "md" }}
                px={{ base: 4, md: 8 }}
                borderRadius="lg"
                flexShrink={0}
                bg="linear-gradient(90deg, #48BB78, #38A169)"
                loading={submitState === 'submitting'}
                loadingText="Saving…"
                disabled={!canComplete}
                _hover={canComplete ? {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px -5px rgba(72, 187, 120, 0.4)',
                  bg: 'linear-gradient(90deg, #38A169, #2F855A)'
                } : undefined}
                _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
                transition="all 0.2s"
              >
                🎉 Complete →
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                colorScheme="blue"
                size={{ base: "sm", md: "md" }}
                px={{ base: 4, md: 8 }}
                borderRadius="lg"
                flexShrink={0}
                bg="gradient-to-r from-blue.500 to-purple.600"
                disabled={!isCurrentStepValid}
                _hover={isCurrentStepValid ? {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px -5px rgba(66, 153, 225, 0.4)'
                } : undefined}
                _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
                transition="all 0.2s"
              >
                Next →
              </Button>
            )}
          </HStack>
        </HStack>
        </Stack>
      </Box>
      
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
