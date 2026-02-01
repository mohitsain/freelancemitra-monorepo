"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStylesWithDarkBg, textareaBorderStylesWithDarkBg, addSectionButtonStyles, cardStyles, labelStyles, inputSizes, requiredAsteriskStyles } from '@/lib/onboarding-form-styles';
import SingleFileUpload from '@/components/ui/single-file-upload';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  invalidFields?: string[];
}

export default function ExperienceEducationStep({ data, updateData, invalidFields }: Props) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const addWorkHistory = () => {
    const newWorkHistory = [...data.workHistory, {
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      responsibilities: ''
    }];
    updateData({ workHistory: newWorkHistory });
  };

  const removeWorkHistory = (index: number) => {
    const newWorkHistory = data.workHistory.filter((_, i) => i !== index);
    updateData({ workHistory: newWorkHistory });
  };

  const updateWorkHistory = (index: number, field: string, value: string) => {
    const newWorkHistory = [...data.workHistory];
    newWorkHistory[index] = { ...newWorkHistory[index], [field]: value };
    updateData({ workHistory: newWorkHistory });
  };

  const addEducation = () => {
    const newEducation = [...data.education, {
      degree: '',
      institution: '',
      graduationYear: ''
    }];
    updateData({ education: newEducation });
  };

  const removeEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    updateData({ education: newEducation });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    updateData({ education: newEducation });
  };

  const addCertification = () => {
    const newCertifications = [...data.certifications, { title: '', description: '', fileKey: '' }];
    updateData({ certifications: newCertifications });
  };

  const removeCertification = (index: number) => {
    const newCertifications = data.certifications.filter((_, i) => i !== index);
    updateData({ certifications: newCertifications });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const newCertifications = [...data.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    updateData({ certifications: newCertifications });
  };

  return (
    <Stack direction="column" gap={6} align="stretch">
      {/* Work History Section */}
      <Box {...cardStyles} {...(invalidFields?.includes('workHistory') ? { borderWidth: '2px', borderColor: 'red.500', _dark: { borderColor: 'red.400' } } : {})}>
        <HStack justify="space-between" align="flex-start" mb={5} flexWrap="wrap" gap={3}>
          <Box>
            <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
              Work History <Text {...requiredAsteriskStyles}>*</Text>
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              Add at least one position with company, job title, start date, end date (or Till date), and key responsibilities
            </Text>
          </Box>
          <Button onClick={addWorkHistory} colorScheme="blue" {...addSectionButtonStyles}>
            + Add Another Position
          </Button>
        </HStack>

        {data.workHistory.map((work, index) => (
          <Box
            key={index}
            p={5}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
            mb={index < data.workHistory.length - 1 ? 5 : 0}
            _dark={{ borderColor: 'gray.600', bg: 'gray.700' }}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="medium" color="gray.700" _dark={{ color: 'gray.300' }}>
                Position {index + 1}
              </Text>
              <Button aria-label="Remove work history" size="sm" variant="ghost" colorScheme="red" onClick={() => removeWorkHistory(index)}>
                ✕
              </Button>
            </HStack>
            <Stack direction="column" gap={5}>
              <HStack gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>Company/Client Name <Text {...requiredAsteriskStyles}>*</Text></Text>
                  <Input
                    placeholder="Company or client name"
                    value={work.company}
                    onChange={(e) => updateWorkHistory(index, 'company', e.target.value)}
                    {...inputSizes}
                    {...inputBorderStylesWithDarkBg}
                  />
                </Box>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>Job Title/Role <Text {...requiredAsteriskStyles}>*</Text></Text>
                  <Input
                    placeholder="Job title or role"
                    value={work.jobTitle}
                    onChange={(e) => updateWorkHistory(index, 'jobTitle', e.target.value)}
                    {...inputSizes}
                    {...inputBorderStylesWithDarkBg}
                  />
                </Box>
              </HStack>
              <HStack gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>Start Date <Text {...requiredAsteriskStyles}>*</Text></Text>
                  <Input
                    type="date"
                    value={work.startDate}
                    onChange={(e) => updateWorkHistory(index, 'startDate', e.target.value)}
                    {...inputSizes}
                    {...inputBorderStylesWithDarkBg}
                  />
                </Box>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>End Date <Text {...requiredAsteriskStyles}>*</Text></Text>
                  <HStack gap={3} align="center" flexWrap="wrap">
                    <Input
                      type="date"
                      value={work.endDate === 'Present' ? '' : work.endDate}
                      onChange={(e) => updateWorkHistory(index, 'endDate', e.target.value)}
                      {...inputSizes}
                      {...inputBorderStylesWithDarkBg}
                      disabled={work.endDate === 'Present'}
                      flex={{ base: '1 1 100%', sm: '1' }}
                      minW={0}
                    />
                    <Box
                      as="label"
                      display="flex"
                      alignItems="center"
                      gap={2}
                      cursor="pointer"
                      whiteSpace="nowrap"
                      fontSize="sm"
                      color="gray.700"
                      _dark={{ color: 'gray.300' }}
                    >
                      <input
                        type="checkbox"
                        checked={work.endDate === 'Present'}
                        onChange={(e) => updateWorkHistory(index, 'endDate', e.target.checked ? 'Present' : '')}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                      Till date
                    </Box>
                  </HStack>
                </Box>
              </HStack>
              <Box>
                <Text {...labelStyles}>Key Responsibilities & Achievements <Text {...requiredAsteriskStyles}>*</Text></Text>
                <Textarea
                  placeholder="Describe your key responsibilities and achievements..."
                  value={work.responsibilities}
                  onChange={(e) => updateWorkHistory(index, 'responsibilities', e.target.value)}
                  rows={3}
                  px={4}
                  py={2.5}
                  {...textareaBorderStylesWithDarkBg}
                />
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Education Section */}
      <Box {...cardStyles}>
        <HStack justify="space-between" align="flex-start" mb={5} flexWrap="wrap" gap={3}>
          <Box>
            <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
              Education
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              Add your educational background
            </Text>
          </Box>
          <Button onClick={addEducation} colorScheme="blue" {...addSectionButtonStyles}>
            + Add Another Education
          </Button>
        </HStack>

        {data.education.map((edu, index) => (
          <Box
            key={index}
            p={5}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
            mb={index < data.education.length - 1 ? 5 : 0}
            _dark={{ borderColor: 'gray.600', bg: 'gray.700' }}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="medium" color="gray.700" _dark={{ color: 'gray.300' }}>
                Education {index + 1}
              </Text>
              <Button aria-label="Remove education" size="sm" variant="ghost" colorScheme="red" onClick={() => removeEducation(index)}>
                ✕
              </Button>
            </HStack>
            <Stack direction="column" gap={5}>
              <Box>
                <Text {...labelStyles}>Degree/Certification</Text>
                <Input
                  placeholder="Degree or certification"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  {...inputSizes}
                  {...inputBorderStylesWithDarkBg}
                />
              </Box>
              <Box>
                <Text {...labelStyles}>Institution Name</Text>
                <Input
                  placeholder="Institution name"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  {...inputSizes}
                  {...inputBorderStylesWithDarkBg}
                />
              </Box>
              <Box>
                <Text {...labelStyles}>Year of Graduation (Optional)</Text>
                <Input
                  placeholder="e.g. 2020"
                  value={edu.graduationYear}
                  onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
                  {...inputSizes}
                  {...inputBorderStylesWithDarkBg}
                />
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Certifications & Awards Section */}
      <Box {...cardStyles}>
        <HStack justify="space-between" align="flex-start" mb={5} flexWrap="wrap" gap={3}>
          <Box>
            <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
              Certifications & Awards
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              List relevant certifications or awards; optional file per item (max 10 MB)
            </Text>
          </Box>
          <Button onClick={addCertification} colorScheme="blue" {...addSectionButtonStyles}>
            + Add Certification
          </Button>
        </HStack>

        {data.certifications.map((cert, index) => (
          <Box
            key={index}
            p={5}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
            mb={index < data.certifications.length - 1 ? 5 : 0}
            _dark={{ borderColor: 'gray.600', bg: 'gray.700' }}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="medium" color="gray.700" _dark={{ color: 'gray.300' }}>
                Certification {index + 1}
              </Text>
              <Button aria-label="Remove certification" size="sm" variant="ghost" colorScheme="red" onClick={() => removeCertification(index)}>
                ✕
              </Button>
            </HStack>
            <Stack direction="column" gap={5}>
              <Box>
                <Text {...labelStyles}>Title</Text>
                <Input
                  placeholder="e.g. AWS Certified, PMP"
                  value={cert.title}
                  onChange={(e) => updateCertification(index, 'title', e.target.value)}
                  {...inputSizes}
                  {...inputBorderStylesWithDarkBg}
                />
              </Box>
              <Box>
                <Text {...labelStyles}>Description or issuing body</Text>
                <Textarea
                  placeholder="Description or issuing body..."
                  value={cert.description}
                  onChange={(e) => updateCertification(index, 'description', e.target.value)}
                  rows={2}
                  px={4}
                  py={2.5}
                  {...textareaBorderStylesWithDarkBg}
                />
              </Box>
              <Box>
                <Text {...labelStyles}>Attachment (optional, max 10 MB)</Text>
                <SingleFileUpload
                  file={cert.fileKey ? { key: cert.fileKey, size: 0 } : null}
                  onFileChange={(entry) => updateCertification(index, 'fileKey', entry?.key ?? '')}
                  category="projects"
                />
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
