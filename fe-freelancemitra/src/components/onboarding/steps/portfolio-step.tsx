"use client"
import React, { useState } from 'react';
import {
  Box,
  Stack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import SkillsDropdown from '@/components/ui/skills-dropdown';
import MultiFileUpload from '@/components/ui/multi-file-upload';
import { inputBorderStyles, textareaBorderStyles, addSectionButtonStyles, cardStyles, labelStyles, inputSizes } from '@/lib/onboarding-form-styles';

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
    <Stack direction="column" gap={6} align="stretch">
      {/* Portfolio Links Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
          Portfolio Link (Optional)
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={4}>
          Share your external portfolio (Behance, Dribbble, GitHub, personal website)
        </Text>
        <Input
          placeholder="https://behance.net/yourportfolio or https://github.com/yourusername"
          value={data.portfolioLink}
          onChange={(e) => updateData({ portfolioLink: e.target.value })}
          type="url"
          {...inputSizes}
          {...inputBorderStyles}
          _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
        />
      </Box>

      {/* Work Samples Section */}
      <Box {...cardStyles}>
        <HStack justify="space-between" align="flex-start" mb={5} flexWrap="wrap" gap={3}>
          <Box>
            <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
              Work Samples
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              Showcase your best work with detailed project information
            </Text>
          </Box>
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
            p={5}
            border="1px"
            borderColor="gray.200"
            borderRadius="lg"
            bg="gray.50"
            mb={index < data.portfolioSamples.length - 1 ? 5 : 0}
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
            _dark={{
              borderColor: 'gray.600',
              bg: 'gray.700',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="bold" fontSize="md" color="gray.800" _dark={{ color: 'white' }}>
                Work Sample {index + 1}
              </Text>
              {data.portfolioSamples.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => removePortfolioSample(index)}
                  _hover={{ bg: 'red.50', color: 'red.600' }}
                  _dark={{ _hover: { bg: 'red.900', color: 'red.400' } }}
                >
                  🗑️ Remove
                </Button>
              )}
            </HStack>

            <Stack direction="column" gap={5} align="stretch">
              <HStack gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>Project Title *</Text>
                  <Input
                    placeholder="e.g., E-commerce Website Redesign"
                    value={sample.projectTitle}
                    onChange={(e) => updatePortfolioSample(index, 'projectTitle', e.target.value)}
                    {...inputSizes}
                    {...inputBorderStyles}
                    _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                  />
                </Box>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>Client (Optional)</Text>
                  <Input
                    placeholder="Client name or company"
                    value={sample.client}
                    onChange={(e) => updatePortfolioSample(index, 'client', e.target.value)}
                    {...inputSizes}
                    {...inputBorderStyles}
                    _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                  />
                </Box>
              </HStack>

              <Box>
                <Text {...labelStyles}>Project Description *</Text>
                <Textarea
                  placeholder="What was the project about? What was your role? What was the outcome/impact?"
                  value={sample.description}
                  onChange={(e) => updatePortfolioSample(index, 'description', e.target.value)}
                  rows={4}
                  px={4}
                  py={2.5}
                  {...textareaBorderStyles}
                  _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
                />
              </Box>

              <Box>
                <Text {...labelStyles}>Skills Used</Text>
                <SkillsDropdown
                  selectedSkills={sample.skillsUsed}
                  onSkillsChange={(skills) => updatePortfolioSample(index, 'skillsUsed', skills)}
                  placeholder="Select skills used in this project"
                  size="md"
                  maxSkills={10}
                />
              </Box>

              <Box>
                <Text {...labelStyles}>Portfolio Link (Optional)</Text>
                <Input
                  placeholder="Direct link to this project"
                  value={sample.portfolioLink}
                  onChange={(e) => updatePortfolioSample(index, 'portfolioLink', e.target.value)}
                  type="url"
                  {...inputSizes}
                  {...inputBorderStyles}
                  _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                />
              </Box>

              <Box>
                <Text {...labelStyles} fontSize="xs" _dark={{ color: 'gray.400' }}>
                  Upload files (optional) — max 5 files, 25 MB per work sample
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
