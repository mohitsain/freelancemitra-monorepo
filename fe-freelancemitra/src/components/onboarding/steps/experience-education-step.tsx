"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Heading,
  Input,
  Textarea,
  Select,
  IconButton
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStyles, textareaBorderStyles, addSectionButtonStyles } from '@/lib/onboarding-form-styles';
import SingleFileUpload from '@/components/ui/single-file-upload';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function ExperienceEducationStep({ data, updateData }: Props) {
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
    <Stack direction="column" gap={1} align="stretch">
      {/* Work History Section */}
      <Box>
        <HStack justify="space-between" align="flex-start" mb={2} flexWrap="wrap" gap={2}>
          <Box>
            <Heading size="md" mb={1}>Work History</Heading>
            <Text fontSize="sm" color="gray.600">
              Add your relevant work experience to showcase your expertise
            </Text>
          </Box>
          <Button
            onClick={addWorkHistory}
            colorScheme="blue"
            {...addSectionButtonStyles}
          >
            + Add Another Position
          </Button>
        </HStack>
        
        {data.workHistory.map((work, index) => (
          <Box
            key={index}
            p={4}
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            bg={bgColor}
            mb={2}
          >
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="medium">Position {index + 1}</Text>
              {data.workHistory.length > 1 && (
                <Button
                  aria-label="Remove work history"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => removeWorkHistory(index)}
                >
                  ✕
                </Button>
              )}
            </HStack>
            
            <Stack direction="column" gap={3}>
              <HStack gap={3} w="full">
                <Input
                  placeholder="Company/Client Name"
                  value={work.company}
                  onChange={(e) => updateWorkHistory(index, 'company', e.target.value)}
                  size="lg"
                  px={6}
                  py={3}
                  {...inputBorderStyles}
                  _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                />
                <Input
                  placeholder="Job Title/Role"
                  value={work.jobTitle}
                  onChange={(e) => updateWorkHistory(index, 'jobTitle', e.target.value)}
                  size="lg"
                  px={6}
                  py={3}
                  {...inputBorderStyles}
                  _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                />
              </HStack>
              
              <HStack gap={3} w="full">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={work.startDate}
                  onChange={(e) => updateWorkHistory(index, 'startDate', e.target.value)}
                  size="lg"
                  px={6}
                  py={3}
                  {...inputBorderStyles}
                  _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={work.endDate}
                  onChange={(e) => updateWorkHistory(index, 'endDate', e.target.value)}
                  size="lg"
                  px={6}
                  py={3}
                  {...inputBorderStyles}
                  _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                />
              </HStack>
              
              <Textarea
                placeholder="Key Responsibilities & Achievements"
                value={work.responsibilities}
                onChange={(e) => updateWorkHistory(index, 'responsibilities', e.target.value)}
                rows={3}
                px={6}
                py={3}
                {...textareaBorderStyles}
                _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
              />
            </Stack>
          </Box>
        ))}
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={1} _dark={{ borderColor: 'gray.600' }} />

      {/* Education Section */}
      <Box>
        <HStack justify="space-between" align="flex-start" mb={2} flexWrap="wrap" gap={2}>
          <Box>
            <Heading size="md" mb={1}>Education</Heading>
            <Text fontSize="sm" color="gray.600">
              Add your educational background and certifications
            </Text>
          </Box>
          <Button
            onClick={addEducation}
            colorScheme="blue"
            {...addSectionButtonStyles}
          >
            + Add Another Education
          </Button>
        </HStack>
        
        {data.education.map((edu, index) => (
          <Box
            key={index}
            p={4}
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            bg={bgColor}
            mb={2}
          >
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="medium">Education {index + 1}</Text>
              {data.education.length > 1 && (
                <Button
                  aria-label="Remove education"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => removeEducation(index)}
                >
                  ✕
                </Button>
              )}
            </HStack>
            
            <Stack direction="column" gap={3}>
              <Input
                placeholder="Degree/Certification"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
              
              <Input
                placeholder="Institution Name"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
              
              <Input
                placeholder="Year of Graduation (Optional)"
                value={edu.graduationYear}
                onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Stack>
          </Box>
        ))}
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={1} _dark={{ borderColor: 'gray.600' }} />

      {/* Certifications & Awards Section */}
      <Box>
        <HStack justify="space-between" align="flex-start" mb={2} flexWrap="wrap" gap={2}>
          <Box>
            <Heading size="md" mb={1}>Certifications & Awards</Heading>
            <Text fontSize="sm" color="gray.600">
              List relevant certifications or awards; optional file per item (max 10 MB)
            </Text>
          </Box>
          <Button
            onClick={addCertification}
            colorScheme="blue"
            {...addSectionButtonStyles}
          >
            + Add Certification
          </Button>
        </HStack>

        {data.certifications.map((cert, index) => (
          <Box
            key={index}
            p={4}
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            bg={bgColor}
            mb={2}
          >
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="medium">Certification {index + 1}</Text>
              {data.certifications.length > 1 && (
                <Button
                  aria-label="Remove certification"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => removeCertification(index)}
                >
                  ✕
                </Button>
              )}
            </HStack>
            <Stack direction="column" gap={3}>
              <Input
                placeholder="Title (e.g. AWS Certified, PMP)"
                value={cert.title}
                onChange={(e) => updateCertification(index, 'title', e.target.value)}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
              <Textarea
                placeholder="Description or issuing body..."
                value={cert.description}
                onChange={(e) => updateCertification(index, 'description', e.target.value)}
                rows={2}
                px={6}
                py={3}
                {...textareaBorderStyles}
                _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
              />
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Attachment (optional, max 10 MB)</Text>
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
