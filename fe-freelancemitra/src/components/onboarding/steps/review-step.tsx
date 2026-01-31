"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Text,
  Heading,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import { cardStyles } from '@/lib/onboarding-form-styles';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  /** Email from session (captured at login); not editable in onboarding */
  email?: string;
}

export default function ReviewStep({ data, email: sessionEmail }: Props) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const formatCurrency = (amount: number, currency: string) => {
    if (amount === 0) return 'Not set';
    return `${currency} ${amount.toFixed(2)}/hour`;
  };

  const getCompletionStatus = () => {
    const totalFields = 15;
    let completedFields = 0;

    // Work History
    data.workHistory.forEach(work => {
      if (work.company && work.jobTitle && work.startDate && work.endDate && work.responsibilities) {
        completedFields += 5;
      }
    });

    // Education
    data.education.forEach(edu => {
      if (edu.degree && edu.institution) {
        completedFields += 2;
      }
    });

    // Basic fields
    if (Array.isArray(data.certifications) && data.certifications.some((c) => c.title || c.description || c.fileKey)) completedFields += 1;
    if (data.availability) completedFields += 1;
    if (data.weeklyHours) completedFields += 1;
    if (data.startDate) completedFields += 1;
    if (data.hourlyRate > 0) completedFields += 1;
    if (data.currency) completedFields += 1;
    if (data.linkedinUrl) completedFields += 1;
    if (data.personalWebsite) completedFields += 1;

    // Testimonials
    data.testimonials.forEach(testimonial => {
      if (testimonial.clientName && testimonial.clientTitle && testimonial.testimonial) {
        completedFields += 3;
      }
    });

    return Math.min(Math.round((completedFields / totalFields) * 100), 100);
  };

  const completionPercentage = getCompletionStatus();

  return (
    <Stack direction="column" gap={6} align="stretch">
      {/* Header Section */}
      <Box textAlign="center">
        <Heading size="lg" mb={4} color="gray.800" _dark={{ color: 'white' }}>
          Review Your Profile
        </Heading>
        <Text color="gray.600" _dark={{ color: 'gray.300' }} mb={4}>
          Please review all the information below before completing your profile
        </Text>
        
        <Box
          p={4}
          border="2px"
          borderColor={completionPercentage >= 80 ? 'green.300' : 'orange.300'}
          borderRadius="lg"
          bg={completionPercentage >= 80 ? 'green.50' : 'orange.50'}
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.08)"
          _dark={{
            bg: completionPercentage >= 80 ? 'green.900' : 'orange.900',
            borderColor: completionPercentage >= 80 ? 'green.600' : 'orange.600',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          <HStack justify="center" gap={3}>
            <Text fontSize="2xl">
              {completionPercentage >= 80 ? '✅' : 'ℹ️'}
            </Text>
            <Text
              fontWeight="semibold"
              fontSize="md"
              color={completionPercentage >= 80 ? 'green.800' : 'orange.800'}
              _dark={{ color: 'white' }}
            >
              Profile Completion: {completionPercentage}%
            </Text>
          </HStack>
          {completionPercentage < 80 && (
            <Text
              fontSize="sm"
              color="orange.700"
              _dark={{ color: 'orange.200' }}
              mt={2}
              textAlign="center"
            >
              Consider completing more sections for a stronger profile
            </Text>
          )}
        </Box>
      </Box>

      {/* Basic Contact & Personal Information Review */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Basic Contact & Personal Information
        </Text>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <GridItem>
            <Text fontWeight="medium">Full Name:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : 'Not provided'}
            </Text>
          </GridItem>
          
          <GridItem>
            <Text fontWeight="medium">Professional Title:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {data.professionalTitle || 'Not provided'}
            </Text>
          </GridItem>
          
          <GridItem>
            <Text fontWeight="medium">Email:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {sessionEmail || 'Not provided'}
            </Text>
          </GridItem>
          
          <GridItem>
            <Text fontWeight="medium">Phone:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {[data.countryPhoneCode, data.phoneNumber].filter(Boolean).join(' ') || 'Not provided'}
            </Text>
          </GridItem>
          
          <GridItem>
            <Text fontWeight="medium">Location:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {data.city && data.state && data.country ? `${data.city}, ${data.state}, ${data.country}` : 'Not provided'}
            </Text>
          </GridItem>
          {(data.addressLine1 || data.addressLine2 || data.postalCode) ? (
            <>
              <GridItem>
                <Text fontWeight="medium">Address:</Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {[data.addressLine1, data.addressLine2].filter(Boolean).join(', ') || '—'}
                </Text>
              </GridItem>
              {data.postalCode ? (
                <GridItem>
                  <Text fontWeight="medium">Postal code:</Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>{data.postalCode}</Text>
                </GridItem>
              ) : null}
            </>
          ) : null}
          
          <GridItem>
            <Text fontWeight="medium">Profile Picture:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {data.profilePicture ? '✓ Uploaded' : 'Not uploaded'}
            </Text>
          </GridItem>
        </Grid>
      </Box>

      {/* Professional Overview & Expertise Review */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Professional Overview & Expertise
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          <Box>
            <Text fontWeight="medium" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>Professional Headline:</Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              {data.headline || 'Not provided'}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>Short Summary:</Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              {data.shortSummary || 'Not provided'}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>Detailed Description:</Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              {data.detailedDescription || 'Not provided'}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>Key Skills:</Text>
            {data.keySkills.length > 0 ? (
              <HStack gap={2} wrap="wrap" mt={2}>
                {data.keySkills.map((skill, index) => (
                  <Badge key={index} colorScheme="blue" variant="subtle">
                    {skill}
                  </Badge>
                ))}
              </HStack>
            ) : (
              <Text fontSize="sm" color="red.500">No skills added</Text>
            )}
          </Box>
          <Box>
            <Text fontWeight="medium" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>Areas of Specialization:</Text>
            {data.areasOfSpecialization.length > 0 ? (
              <HStack gap={2} wrap="wrap" mt={2}>
                {data.areasOfSpecialization.map((spec, index) => (
                  <Badge key={index} colorScheme="green" variant="subtle">
                    {spec}
                  </Badge>
                ))}
              </HStack>
            ) : (
              <Text fontSize="sm" color="red.500">No specializations added</Text>
            )}
          </Box>
          
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <GridItem>
              <Text fontWeight="medium">Years of Experience:</Text>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {data.yearsOfExperience || 0} years
              </Text>
            </GridItem>
            
            <GridItem>
              <Text fontWeight="medium">Languages Spoken:</Text>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {data.languagesSpoken || 'Not specified'}
              </Text>
            </GridItem>
          </Grid>
        </Stack>
      </Box>

      {/* Portfolio & Work Samples Review */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Portfolio & Work Samples
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          {data.portfolioLink && (
            <Box>
              <Text fontWeight="medium" mb={2}>Portfolio Link:</Text>
              <HStack>
                <Text fontSize="sm" color="blue.600" _dark={{ color: 'blue.400' }}>
                  {data.portfolioLink}
                </Text>
                <Text fontSize="sm" color="blue.500">🔗</Text>
              </HStack>
            </Box>
          )}
          
          <Box>
            <Text fontWeight="medium" mb={2}>Work Samples:</Text>
            {data.portfolioSamples.map((sample, index) => (
              <Box
                key={index}
                p={3}
                border="1px"
                borderColor={borderColor}
                borderRadius="md"
                bg={bgColor}
                mb={3}
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="semibold">
                    {sample.projectTitle || 'Project title not specified'}
                  </Text>
                  <Badge 
                    colorScheme={sample.projectTitle && sample.description ? 'green' : 'red'} 
                    variant="subtle"
                  >
                    {sample.projectTitle && sample.description ? 'Complete' : 'Incomplete'}
                  </Badge>
                </HStack>
                
                <Text fontSize="sm" color="gray.600" mb={2}>
                  <strong>Client:</strong> {sample.client || 'Not specified'}
                </Text>
                
                {sample.description && (
                  <Text fontSize="sm" mb={2}>
                    <strong>Description:</strong> {sample.description}
                  </Text>
                )}
                
                {sample.skillsUsed.length > 0 && (
                  <Box mb={2}>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Skills Used:</Text>
                    <HStack gap={1} wrap="wrap">
                      {sample.skillsUsed.map((skill, skillIndex) => (
                        <Badge key={skillIndex} size="sm" colorScheme="blue" variant="subtle">
                          {skill}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}
                
                <HStack gap={4} fontSize="sm" color="gray.600">
                  {sample.portfolioLink && (
                    <HStack>
                      <Text>🔗</Text>
                      <Text>{sample.portfolioLink}</Text>
                    </HStack>
                  )}
                  {(sample.uploadedFiles && sample.uploadedFiles.length > 0) && (
                    <HStack gap={2} flexWrap="wrap" align="flex-start">
                      <Text>📎</Text>
                      <Stack gap={1} fontSize="sm" color="gray.600">
                        {sample.uploadedFiles.map((f, i) => (
                          <Text key={f.key}>{f.key.split('/').pop() || `File ${i + 1}`}</Text>
                        ))}
                      </Stack>
                    </HStack>
                  )}
                </HStack>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>

      {/* Experience & Education Review */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Experience & Education
        </Text>
        {/* Work History */}
        <Stack direction="column" gap={4} align="stretch" mb={5}>
          <Text fontWeight="medium">Work History:</Text>
          {data.workHistory.map((work, index) => (
            <Box
              key={index}
              p={3}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={bgColor}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="semibold">{work.company || 'Company not specified'}</Text>
                <Badge colorScheme={work.company ? 'green' : 'red'} variant="subtle">
                  {work.company ? 'Complete' : 'Incomplete'}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                {work.jobTitle || 'Job title not specified'} • {work.startDate || 'Start date not specified'} - {work.endDate === 'Present' ? 'Till date' : (work.endDate || 'End date not specified')}
              </Text>
              {work.responsibilities && (
                <Text fontSize="sm" mt={2}>
                  {work.responsibilities}
                </Text>
              )}
            </Box>
          ))}
        </Stack>

        {/* Education */}
        <Stack direction="column" gap={4} align="stretch">
          <Text fontWeight="medium">Education:</Text>
          {data.education.map((edu, index) => (
            <Box
              key={index}
              p={3}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={bgColor}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="semibold">{edu.degree || 'Degree not specified'}</Text>
                <Badge colorScheme={edu.degree && edu.institution ? 'green' : 'red'} variant="subtle">
                  {edu.degree && edu.institution ? 'Complete' : 'Incomplete'}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                {edu.institution || 'Institution not specified'}
                {edu.graduationYear && ` • ${edu.graduationYear}`}
              </Text>
            </Box>
          ))}
        </Stack>

        {Array.isArray(data.certifications) && data.certifications.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="medium" mb={2}>Certifications & Awards:</Text>
            <Stack gap={3}>
              {data.certifications.map((cert, i) => (
                <Box key={i} p={3} bg={bgColor} borderRadius="md" border="1px" borderColor={borderColor}>
                  {cert.title && <Text fontWeight="semibold" fontSize="sm">{cert.title}</Text>}
                  {cert.description && <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mt={1}>{cert.description}</Text>}
                  {cert.fileKey && (
                    <Text fontSize="sm" mt={2}>📎 {cert.fileKey.split('/').pop() || 'Attachment'}</Text>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Availability & Rates Review */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Availability & Rates
        </Text>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <GridItem>
            <Text fontWeight="medium">Work Type:</Text>
            <Badge colorScheme="blue" variant="subtle" mt={1}>
              {data.availability.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </GridItem>
          
          <GridItem>
            <Text fontWeight="medium">Weekly Hours:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {data.weeklyHours} hours/week
            </Text>
          </GridItem>
          
          <GridItem>
            <Text fontWeight="medium">Start Date:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {data.startDate || 'Not specified'}
            </Text>
          </GridItem>
          
          <GridItem>
            <Text fontWeight="medium">Hourly Rate:</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {formatCurrency(data.hourlyRate, data.currency)}
            </Text>
          </GridItem>
        </Grid>

        {(data.projectBasedRate || data.retainerRate || data.minProjectSize) && (
          <Box mt={4}>
            <Text fontWeight="medium" mb={2}>Additional Pricing:</Text>
            <Stack direction="column" gap={2} align="stretch">
              {data.projectBasedRate && (
                <Text fontSize="sm">
                  <strong>Project-based:</strong> {data.projectBasedRate}
                </Text>
              )}
              {data.retainerRate && (
                <Text fontSize="sm">
                  <strong>Retainer:</strong> {data.retainerRate}
                </Text>
              )}
              {data.minProjectSize && (
                <Text fontSize="sm">
                  <strong>Min Project Size:</strong> {data.minProjectSize}
                </Text>
              )}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Social Media & Links Review */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Social Media & Links
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          <Box>
            <Text fontWeight="medium" mb={2}>LinkedIn Profile:</Text>
            {data.linkedinUrl ? (
              <HStack>
                <Text fontSize="sm" color="blue.600" _dark={{ color: 'blue.400' }}>
                  {data.linkedinUrl}
                </Text>
                <Text fontSize="sm" color="blue.500">🔗</Text>
              </HStack>
            ) : (
              <Text fontSize="sm" color="red.500">Not provided</Text>
            )}
          </Box>

          <Box>
            <Text fontWeight="medium" mb={2}>Personal Website:</Text>
            {data.personalWebsite ? (
              <HStack>
                <Text fontSize="sm" color="blue.600" _dark={{ color: 'blue.400' }}>
                  {data.personalWebsite}
                </Text>
                <Text fontSize="sm" color="blue.500">🔗</Text>
              </HStack>
            ) : (
              <Text fontSize="sm" color="gray.500">Not provided</Text>
            )}
          </Box>

          {data.otherSocialMedia && (
            <Box>
              <Text fontWeight="medium" mb={2}>Other Social Media:</Text>
              <Text fontSize="sm" color="gray.600">
                {data.otherSocialMedia}
              </Text>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Testimonials Review */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Client Testimonials
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          {data.testimonials.map((testimonial, index) => (
            <Box
              key={index}
              p={3}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={bgColor}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="semibold">
                  {testimonial.clientName || 'Client name not specified'}
                </Text>
                <Badge 
                  colorScheme={testimonial.clientName && testimonial.clientTitle && testimonial.testimonial ? 'green' : 'red'} 
                  variant="subtle"
                >
                  {testimonial.clientName && testimonial.clientTitle && testimonial.testimonial ? 'Complete' : 'Incomplete'}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600" mb={2}>
                {testimonial.clientTitle || 'Title not specified'}
              </Text>
              {testimonial.testimonial && (
                <Text fontSize="sm" fontStyle="italic">
                  "{testimonial.testimonial}"
                </Text>
              )}
            </Box>
          ))}
        </Stack>
      </Box>

    </Stack>
  );
}
