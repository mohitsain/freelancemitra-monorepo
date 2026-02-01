"use client";

import DashboardLayout from '@/components/layout/dashboard-layout';
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
  Separator,
  Spinner,
  Image,
} from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  FaBriefcase,
  FaMapMarkerAlt,
  FaLink,
  FaGraduationCap,
  FaQuoteLeft,
  FaGlobe,
  FaLinkedin,
} from 'react-icons/fa';
import { useOnboarding } from '@/hooks/use-onboarding-queries';
import { payloadToData, type OnboardingData } from '@/components/onboarding/onboarding-flow';
import { getDisplayUrl } from '@/lib/upload-api';
import { getCountries, getPhoneCodeByCountryName } from '@/lib/locations-api';

function getDefaultOnboardingData(): OnboardingData {
  return {
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
    headline: '',
    shortSummary: '',
    detailedDescription: '',
    keySkills: [],
    areasOfSpecialization: [],
    yearsOfExperience: 0,
    languagesSpoken: '',
    portfolioLink: '',
    portfolioSamples: [
      { projectTitle: '', client: '', description: '', skillsUsed: [], portfolioLink: '', fileKey: '', uploadFile: null, uploadedFiles: [] },
    ],
    workHistory: [{ company: '', jobTitle: '', startDate: '', endDate: '', responsibilities: '' }],
    education: [{ degree: '', institution: '', graduationYear: '' }],
    certifications: [{ title: '', description: '', fileKey: '' }],
    availability: 'full-time',
    weeklyHours: 40,
    startDate: '',
    hourlyRate: 0,
    projectBasedRate: '',
    retainerRate: '',
    currency: 'USD',
    minProjectSize: '',
    linkedinUrl: '',
    otherSocialMedia: '',
    personalWebsite: '',
    testimonials: [{ clientName: '', clientTitle: '', testimonial: '', imageKey: '' }],
  };
}

function getInitials(data: OnboardingData): string {
  const first = (data.firstName || '').trim().slice(0, 1);
  const last = (data.lastName || '').trim().slice(0, 1);
  if (first || last) return (first + last).toUpperCase();
  return 'U';
}

function formatLocation(data: OnboardingData): string {
  const parts = [data.city, data.state, data.country].filter(Boolean);
  return parts.join(', ') || '—';
}

export default function PortfolioCreationPage() {
  const { colorMode } = useColorMode();
  const { data: onboardingPayload, isLoading } = useOnboarding();
  const [data, setData] = useState<OnboardingData>(getDefaultOnboardingData);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [sampleImageUrls, setSampleImageUrls] = useState<Record<string, string>>({});
  const [testimonialImageUrls, setTestimonialImageUrls] = useState<Record<string, string>>({});
  const [imagesResolving, setImagesResolving] = useState(true);

  useEffect(() => {
    if (!onboardingPayload) {
      setData(getDefaultOnboardingData());
      return;
    }
    getCountries()
      .then((list) => {
        const mapped = payloadToData(onboardingPayload);
        const code = getPhoneCodeByCountryName(list, mapped.countryPhoneCode);
        if (code) mapped.countryPhoneCode = code;
        setData(mapped);
      })
      .catch(() => {
        setData(payloadToData(onboardingPayload));
      });
  }, [onboardingPayload]);

  const resolveImageUrls = useCallback(async (d: OnboardingData) => {
    const profileKey = d.profilePicture?.trim();
    if (profileKey) {
      try {
        const url = await getDisplayUrl(profileKey);
        setProfilePictureUrl(url);
      } catch {
        setProfilePictureUrl(null);
      }
    } else {
      setProfilePictureUrl(null);
    }

    const sampleUrls: Record<string, string> = {};
    for (const s of d.portfolioSamples || []) {
      const keys = s.uploadedFiles?.length ? s.uploadedFiles.map((f) => f.key) : s.fileKey ? [s.fileKey] : [];
      const firstKey = keys[0];
      if (firstKey) {
        try {
          sampleUrls[firstKey] = await getDisplayUrl(firstKey);
        } catch {
          /* ignore */
        }
      }
    }
    setSampleImageUrls(sampleUrls);

    const testimonialUrls: Record<string, string> = {};
    for (const t of d.testimonials || []) {
      if (t.imageKey?.trim()) {
        try {
          testimonialUrls[t.imageKey] = await getDisplayUrl(t.imageKey);
        } catch {
          /* ignore */
        }
      }
    }
    setTestimonialImageUrls(testimonialUrls);
  }, []);

  useEffect(() => {
    const hasImageKeys = !!(data.profilePicture?.trim() || (data.portfolioSamples?.length && data.portfolioSamples.some((s) => s.uploadedFiles?.length || s.fileKey)) || data.testimonials?.some((t) => t.imageKey?.trim()));
    if (hasImageKeys) {
      setImagesResolving(true);
      resolveImageUrls(data).finally(() => setImagesResolving(false));
    } else {
      setImagesResolving(false);
    }
  }, [data.profilePicture, data.portfolioSamples, data.testimonials, resolveImageUrls]);

  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.400" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.600";
  const heroBg = colorMode === "dark" ? "linear-gradient(180deg, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-900) 100%)" : "linear-gradient(180deg, var(--chakra-colors-blue-50) 0%, var(--chakra-colors-gray-50) 100%)";
  const mutedBg = colorMode === "dark" ? "gray.800" : "gray.50";

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Your Name';
  const locationStr = formatLocation(data);
  const firstSampleImageKey = (s: (typeof data.portfolioSamples)[0]) =>
    s.uploadedFiles?.length ? s.uploadedFiles[0].key : s.fileKey || '';

  if (isLoading || imagesResolving) {
    return (
      <DashboardLayout>
        <Box
          px={{ base: 4, md: 6 }}
          py={10}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minH="70vh"
          w="full"
        >
          <Spinner size="xl" color={accentBlue} />
          <Text color={textSecondary} fontSize="sm" mt={4}>
            Loading portfolio…
          </Text>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <VStack gap={3} align="stretch">
        {/* Portfolio view from onboarding data */}
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow={colorMode === 'dark' ? 'lg' : 'sm'}
        >
          {/* Hero */}
          <Box bg={heroBg} py={4} px={5}>
            <VStack gap={3} maxW="4xl" mx="auto">
              <Box
                w="120px"
                h="120px"
                borderRadius="full"
                overflow="hidden"
                flexShrink={0}
                borderWidth="4px"
                borderColor={cardBg}
                boxShadow="lg"
              >
                {profilePictureUrl ? (
                  <Image src={profilePictureUrl} alt="" w="full" h="full" fit="cover" loading="lazy" />
                ) : (
                  <Box w="full" h="full" bg={accentBlue} color="white" display="flex" alignItems="center" justifyContent="center" fontSize="3xl" fontWeight="bold">
                    {getInitials(data)}
                  </Box>
                )}
              </Box>
              <VStack gap={1}>
                <Heading size="xl" color={textPrimary}>{fullName}</Heading>
                {(data.professionalTitle || data.headline) && (
                  <Text color={accentBlue} fontSize="lg" fontWeight="semibold">
                    {data.professionalTitle || data.headline}
                  </Text>
                )}
                {data.headline && data.professionalTitle !== data.headline && (
                  <Text color={textSecondary} fontSize="md" textAlign="center" maxW="2xl">
                    {data.headline}
                  </Text>
                )}
                {locationStr && locationStr !== '—' && (
                  <HStack gap={2} color={textSecondary} fontSize="sm">
                    <Icon as={FaMapMarkerAlt} />
                    <Text>{locationStr}</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Box>

          <Box px={5} py={3}>
            {/* About */}
            {(data.shortSummary || data.detailedDescription) && (
              <Box mb={5}>
                <Heading size="md" color={textPrimary} mb={2}>About</Heading>
                <VStack align="stretch" gap={3}>
                  {data.shortSummary && (
                    <Text color={textPrimary} lineHeight="tall">{data.shortSummary}</Text>
                  )}
                  {data.detailedDescription && (
                    <Text color={textSecondary} fontSize="sm" whiteSpace="pre-wrap">{data.detailedDescription}</Text>
                  )}
                </VStack>
              </Box>
            )}

            {/* Skills */}
            {((data.keySkills?.length ?? 0) > 0 || (data.areasOfSpecialization?.length ?? 0) > 0) && (
              <Box mb={5}>
                <Heading size="md" color={textPrimary} mb={2}>Skills &amp; expertise</Heading>
                <HStack flexWrap="wrap" gap={2}>
                  {(data.keySkills || []).map((skill, i) => (
                    <Badge key={`skill-${i}`} colorScheme="blue" variant="subtle" px={3} py={1} fontSize="sm">
                      {skill}
                    </Badge>
                  ))}
                  {(data.areasOfSpecialization || []).map((area, i) => (
                    <Badge key={`area-${i}`} colorScheme="gray" variant="subtle" px={3} py={1} fontSize="sm">
                      {area}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}

            {/* Experience */}
            {(data.workHistory?.length ?? 0) > 0 && data.workHistory.some((w) => w.company || w.jobTitle) && (
              <Box mb={5}>
                <Heading size="md" color={textPrimary} mb={2}>
                  <HStack gap={2}>
                    <Icon as={FaBriefcase} color={accentBlue} />
                    <span>Experience</span>
                  </HStack>
                </Heading>
                <VStack align="stretch" gap={4}>
                  {data.workHistory.filter((w) => w.company || w.jobTitle).map((work, i) => (
                    <Box key={i} bg={mutedBg} borderRadius="lg" p={4} borderLeftWidth="4px" borderLeftColor={accentBlue}>
                      <Text fontWeight="bold" color={textPrimary}>{work.jobTitle}{work.company ? ` · ${work.company}` : ''}</Text>
                      {(work.startDate || work.endDate) && (
                        <Text fontSize="sm" color={textSecondary}>
                          {work.startDate} – {work.endDate || 'Present'}
                        </Text>
                      )}
                      {work.responsibilities && (
                        <Text fontSize="sm" color={textSecondary} mt={2} whiteSpace="pre-wrap">{work.responsibilities}</Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Education */}
            {(data.education?.length ?? 0) > 0 && data.education.some((e) => e.degree || e.institution) && (
              <Box mb={5}>
                <Heading size="md" color={textPrimary} mb={2}>
                  <HStack gap={2}>
                    <Icon as={FaGraduationCap} color={accentBlue} />
                    <span>Education</span>
                  </HStack>
                </Heading>
                <VStack align="stretch" gap={3}>
                  {data.education.filter((e) => e.degree || e.institution).map((edu, i) => (
                    <Box key={i} bg={mutedBg} borderRadius="lg" p={4}>
                      <Text fontWeight="semibold" color={textPrimary}>{edu.degree}{edu.institution ? ` · ${edu.institution}` : ''}</Text>
                      {edu.graduationYear && (
                        <Text fontSize="sm" color={textSecondary}>{edu.graduationYear}</Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Portfolio samples */}
            {(data.portfolioSamples?.length ?? 0) > 0 && data.portfolioSamples.some((s) => s.projectTitle || s.description) && (
              <Box mb={5}>
                <Heading size="md" color={textPrimary} mb={2}>Work samples</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                  {data.portfolioSamples.filter((s) => s.projectTitle || s.description).map((sample, i) => {
                    const imgKey = firstSampleImageKey(sample);
                    const imgUrl = imgKey ? sampleImageUrls[imgKey] : null;
                    return (
                      <Box key={i} bg={mutedBg} borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
                        {imgUrl && (
                          <Box aspectRatio={16 / 10} bg="gray.200" overflow="hidden">
                            <Image src={imgUrl} alt="" w="full" h="full" fit="cover" loading="lazy" />
                          </Box>
                        )}
                        <Box p={4}>
                          <Text fontWeight="bold" color={textPrimary} fontSize="lg">{sample.projectTitle || 'Project'}</Text>
                          {sample.client && (
                            <Text fontSize="sm" color={textSecondary}>Client: {sample.client}</Text>
                          )}
                          {sample.description && (
                            <Text fontSize="sm" color={textSecondary} mt={2} lineClamp={3}>{sample.description}</Text>
                          )}
                          {(sample.skillsUsed?.length ?? 0) > 0 && (
                            <Box mt={3} display="flex" flexWrap="wrap" gap={2} alignItems="center">
                              {sample.skillsUsed.slice(0, 6).map((sk, j) => (
                                <Badge key={j} variant="subtle" colorScheme="gray" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="medium">
                                  {sk}
                                </Badge>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </Box>
            )}

            {/* Testimonials */}
            {(data.testimonials?.length ?? 0) > 0 && data.testimonials.some((t) => t.testimonial || t.clientName) && (
              <Box mb={5}>
                <Heading size="md" color={textPrimary} mb={2}>
                  <HStack gap={2}>
                    <Icon as={FaQuoteLeft} color={accentBlue} />
                    <span>Testimonials</span>
                  </HStack>
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  {data.testimonials.filter((t) => t.testimonial || t.clientName).map((t, i) => (
                    <Box key={i} bg={mutedBg} borderRadius="lg" p={5} borderLeftWidth="4px" borderLeftColor={accentBlue}>
                      <Text color={textPrimary} fontSize="sm" fontStyle="italic" mb={4}>"{t.testimonial}"</Text>
                      <VStack align="stretch" gap={3}>
                        {(t.imageKey && testimonialImageUrls[t.imageKey]) ? (
                          <Box borderRadius="md" overflow="hidden" maxW="full" aspectRatio={16 / 10}>
                            <Image src={testimonialImageUrls[t.imageKey]} alt="Testimonial" w="full" h="full" fit="cover" loading="lazy" />
                          </Box>
                        ) : null}
                        <VStack align="start" gap={0}>
                          <Text fontWeight="semibold" color={textPrimary} fontSize="sm">{t.clientName}</Text>
                          {t.clientTitle && <Text fontSize="xs" color={textSecondary}>{t.clientTitle}</Text>}
                        </VStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Social & contact */}
            {(data.linkedinUrl || data.otherSocialMedia || data.personalWebsite || data.portfolioLink) && (
              <>
                <Separator my={8} />
                <Heading size="md" color={textPrimary} mb={2}>
                  <HStack gap={2}>
                    <Icon as={FaGlobe} color={accentBlue} />
                    <span>Connect</span>
                  </HStack>
                </Heading>
                <HStack flexWrap="wrap" gap={4}>
                  {data.linkedinUrl && (
                    <Link href={data.linkedinUrl.startsWith('http') ? data.linkedinUrl : `https://${data.linkedinUrl}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" colorScheme="blue">
                        <HStack gap={2} as="span">
                          <FaLinkedin />
                          LinkedIn
                        </HStack>
                      </Button>
                    </Link>
                  )}
                  {data.personalWebsite && (
                    <Link href={data.personalWebsite.startsWith('http') ? data.personalWebsite : `https://${data.personalWebsite}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" colorScheme="gray">
                        <HStack gap={2} as="span">
                          <FaGlobe />
                          Website
                        </HStack>
                      </Button>
                    </Link>
                  )}
                  {data.portfolioLink && (
                    <Link href={data.portfolioLink.startsWith('http') ? data.portfolioLink : `https://${data.portfolioLink}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" colorScheme="gray">
                        <HStack gap={2} as="span">
                          <FaLink />
                          Portfolio
                        </HStack>
                      </Button>
                    </Link>
                  )}
                  {data.otherSocialMedia && (
                    <Text fontSize="sm" color={textSecondary}>{data.otherSocialMedia}</Text>
                  )}
                </HStack>
              </>
            )}

            {/* Availability & rates summary */}
            {(data.availability || data.hourlyRate > 0 || data.currency) && (
              <Box mt={8} p={4} bg={mutedBg} borderRadius="lg">
                <Heading size="sm" color={textPrimary} mb={3}>Availability &amp; rates</Heading>
                <VStack align="stretch" gap={1} fontSize="sm">
                  {data.availability && (
                    <Text color={textSecondary}>Availability: <Text as="span" color={textPrimary} fontWeight="medium">{data.availability.replace(/-/g, ' ')}</Text></Text>
                  )}
                  {data.hourlyRate > 0 && (
                    <Text color={textSecondary}>Hourly rate: <Text as="span" color={textPrimary} fontWeight="medium">{data.currency} {data.hourlyRate}</Text></Text>
                  )}
                </VStack>
              </Box>
            )}
          </Box>
        </Box>

      </VStack>
      </Box>
    </DashboardLayout>
  );
}
