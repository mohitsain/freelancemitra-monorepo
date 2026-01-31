"use client"
import React, { useState } from 'react';
import {
  Box,
  Stack,
  HStack,
  Text,
  Heading,
  Input,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import SkillsDropdown from '@/components/ui/skills-dropdown';
import MultiFileUpload from '@/components/ui/multi-file-upload';
import { inputBorderStyles, textareaBorderStyles, addBlockButtonStyles, addSectionButtonStyles } from '@/lib/onboarding-form-styles';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function PortfolioStep({ data, updateData }: Props) {
  const [skillInput, setSkillInput] = useState('');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const addPortfolioSample = () => {
    const newSample = {
      projectTitle: '',
      client: '',
      description: '',
      skillsUsed: [],
      portfolioLink: '',
      fileKey: '',
      uploadFile: null as File | null,
      uploadedFiles: [] as Array<{ key: string; size: number }>,
    };
    updateData({ portfolioSamples: [...data.portfolioSamples, newSample] });
  };

  const removePortfolioSample = (index: number) => {
    const newSamples = data.portfolioSamples.filter((_, i) => i !== index);
    updateData({ portfolioSamples: newSamples });
  };

  const updatePortfolioSample = (index: number, field: string, value: any) => {
    const newSamples = [...data.portfolioSamples];
    newSamples[index] = { ...newSamples[index], [field]: value };
    updateData({ portfolioSamples: newSamples });
  };

  const addSkillToSample = (sampleIndex: number) => {
    if (skillInput.trim() && !data.portfolioSamples[sampleIndex].skillsUsed.includes(skillInput.trim())) {
      const newSkills = [...data.portfolioSamples[sampleIndex].skillsUsed, skillInput.trim()];
      updatePortfolioSample(sampleIndex, 'skillsUsed', newSkills);
      setSkillInput('');
    }
  };

  const removeSkillFromSample = (sampleIndex: number, skillToRemove: string) => {
    const newSkills = data.portfolioSamples[sampleIndex].skillsUsed.filter(skill => skill !== skillToRemove);
    updatePortfolioSample(sampleIndex, 'skillsUsed', newSkills);
  };

  return (
    <Stack direction="column" gap={1} align="stretch">
      {/* Portfolio Links Section */}
      <Box
        p={8}
        bg="white"
        borderRadius="xl"
        border="1px"
        borderColor="gray.100"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        _dark={{
          bg: 'gray.800',
          borderColor: 'gray.700',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        }}
      >
        <HStack gap={3} mb={6}>
          <Box
            w={12}
            h={12}
            borderRadius="full"
            bg="orange.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl" color="white" fontWeight="bold">
              🔗
            </Text>
          </Box>
          <Box>
            <Heading size="md" color="gray.800" _dark={{ color: 'white' }}>
              Portfolio Links
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
              Share your external portfolio links (Behance, Dribbble, GitHub, personal website)
            </Text>
          </Box>
        </HStack>
        
        <Stack direction="column" gap={4} align="stretch">
          <Box>
            <Text fontWeight="semibold" mb={3} color="gray.700" _dark={{ color: 'gray.300' }}>
              Portfolio Link (Optional)
            </Text>
            <Input
              placeholder="https://behance.net/yourportfolio or https://github.com/yourusername"
              value={data.portfolioLink}
              onChange={(e) => updateData({ portfolioLink: e.target.value })}
              type="url"
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
        </Stack>
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={1} _dark={{ borderColor: 'gray.600' }} />

      {/* Work Samples Section */}
      <Box
        p={8}
        bg="white"
        borderRadius="xl"
        border="1px"
        borderColor="gray.100"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        _dark={{
          bg: 'gray.800',
          borderColor: 'gray.700',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        }}
      >
        <HStack justify="space-between" align="flex-start" mb={6} flexWrap="wrap" gap={3}>
          <HStack gap={3}>
            <Box
              w={12}
              h={12}
              borderRadius="full"
              bg="pink.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xl" color="white" fontWeight="bold">
                🎨
              </Text>
            </Box>
            <Box>
              <Heading size="md" color="gray.800" _dark={{ color: 'white' }}>
                Work Samples
              </Heading>
              <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
                Showcase your best work with detailed project information
              </Text>
            </Box>
          </HStack>
          <Button
            onClick={addPortfolioSample}
            colorScheme="blue"
            {...addSectionButtonStyles}
          >
            + Add Another Work Sample
          </Button>
        </HStack>
        
        {data.portfolioSamples.map((sample, index) => (
          <Box
            key={index}
            p={6}
            border="1px"
            borderColor="gray.200"
            borderRadius="xl"
            bg="gray.50"
            mb={6}
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
            _dark={{
              borderColor: 'gray.600',
              bg: 'gray.700',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <HStack justify="space-between" mb={6}>
              <HStack gap={3}>
                <Box
                  w={8}
                  h={8}
                  borderRadius="full"
                  bg="pink.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _dark={{ bg: 'pink.900' }}
                >
                  <Text fontSize="sm" color="pink.600" fontWeight="bold" _dark={{ color: 'pink.300' }}>
                    {index + 1}
                  </Text>
                </Box>
                <Text fontWeight="bold" fontSize="lg" color="gray.800" _dark={{ color: 'white' }}>
                  Work Sample {index + 1}
                </Text>
              </HStack>
              {data.portfolioSamples.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => removePortfolioSample(index)}
                  _hover={{
                    bg: 'red.50',
                    color: 'red.600'
                  }}
                  _dark={{
                    _hover: {
                      bg: 'red.900',
                      color: 'red.400'
                    }
                  }}
                >
                  🗑️ Remove
                </Button>
              )}
            </HStack>
            
            <Stack direction="column" gap={4} align="stretch">
              <HStack gap={4} w="full">
                <Box flex={1}>
                  <Text fontWeight="medium" mb={2}>Project Title *</Text>
                  <Input
                    placeholder="e.g., E-commerce Website Redesign"
                    value={sample.projectTitle}
                    onChange={(e) => updatePortfolioSample(index, 'projectTitle', e.target.value)}
                    size="lg"
                    px={6}
                    py={3}
                    {...inputBorderStyles}
                    _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                  />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="medium" mb={2}>Client (Optional)</Text>
                  <Input
                    placeholder="Client name or company"
                    value={sample.client}
                    onChange={(e) => updatePortfolioSample(index, 'client', e.target.value)}
                    size="lg"
                    px={6}
                    py={3}
                    {...inputBorderStyles}
                    _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                  />
                </Box>
              </HStack>
              
              <Box>
                <Text fontWeight="medium" mb={2}>Project Description *</Text>
                <Textarea
                  placeholder="What was the project about? What was your role? What was the outcome/impact?"
                  value={sample.description}
                  onChange={(e) => updatePortfolioSample(index, 'description', e.target.value)}
                  rows={4}
                  px={6}
                  py={3}
                  {...textareaBorderStyles}
                  _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
                />
              </Box>
              
              <Box>
                <Text fontWeight="medium" mb={2}>Skills Used</Text>
                <SkillsDropdown
                  selectedSkills={sample.skillsUsed}
                  onSkillsChange={(skills) => updatePortfolioSample(index, 'skillsUsed', skills)}
                  placeholder="Select skills used in this project"
                  size="md"
                  maxSkills={10}
                />
              </Box>
              
              <Box>
                <Text fontWeight="medium" mb={2}>Portfolio Link (Optional)</Text>
                <Input
                  placeholder="Direct link to this project"
                  value={sample.portfolioLink}
                  onChange={(e) => updatePortfolioSample(index, 'portfolioLink', e.target.value)}
                  type="url"
                  size="lg"
                  px={6}
                  py={3}
                  {...inputBorderStyles}
                  _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>Upload files (Optional)</Text>
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                  Max 5 files, 25 MB total per work sample.
                </Text>
                <MultiFileUpload
                  files={sample.uploadedFiles ?? []}
                  onFilesChange={(files) => updatePortfolioSample(index, 'uploadedFiles', files)}
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
