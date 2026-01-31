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
  Button
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import SkillsDropdown from '@/components/ui/skills-dropdown';
import SpecializationsDropdown from '@/components/ui/specializations-dropdown';
import LanguagesDropdown from '@/components/ui/languages-dropdown';
import { inputBorderStyles, textareaBorderStyles } from '@/lib/onboarding-form-styles';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function ProfessionalOverviewStep({ data, updateData }: Props) {
  const [skillInput, setSkillInput] = useState('');
  const [specializationInput, setSpecializationInput] = useState('');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const addSkill = () => {
    if (skillInput.trim() && !data.keySkills.includes(skillInput.trim())) {
      updateData({ keySkills: [...data.keySkills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateData({ keySkills: data.keySkills.filter(skill => skill !== skillToRemove) });
  };

  const addSpecialization = () => {
    if (specializationInput.trim() && !data.areasOfSpecialization.includes(specializationInput.trim())) {
      updateData({ areasOfSpecialization: [...data.areasOfSpecialization, specializationInput.trim()] });
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (specToRemove: string) => {
    updateData({ areasOfSpecialization: data.areasOfSpecialization.filter(spec => spec !== specToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Stack direction="column" gap={1} align="stretch">
      {/* Headline Section */}
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
            bg="purple.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl" color="white" fontWeight="bold">
              ✨
            </Text>
          </Box>
          <Box>
            <Heading size="md" color="gray.800" _dark={{ color: 'white' }}>
              Professional Headline
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
              A concise, catchy phrase describing what you do and your main benefit
            </Text>
          </Box>
        </HStack>
        
        <Input
          placeholder="e.g., Transforming Ideas into Engaging Web Experiences"
          value={data.headline}
          onChange={(e) => updateData({ headline: e.target.value })}
          size="lg"
          px={6}
          py={3}
          {...inputBorderStyles}
          _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
        />
      </Box>

      {/* Bio Section */}
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
            bg="teal.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl" color="white" fontWeight="bold">
              📝
            </Text>
          </Box>
          <Box>
            <Heading size="md" color="gray.800" _dark={{ color: 'white' }}>
              About Me
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
              Tell clients about yourself, your experience, and what makes you unique
            </Text>
          </Box>
        </HStack>
        
        <Stack direction="column" gap={6} align="stretch">
          <Box>
            <Text fontWeight="semibold" mb={3} color="gray.700" _dark={{ color: 'gray.300' }}>
              Short Summary (2-3 sentences) *
            </Text>
            <Textarea
              placeholder="Brief introduction of yourself and your core skills..."
              value={data.shortSummary}
              onChange={(e) => updateData({ shortSummary: e.target.value })}
              rows={3}
              px={6}
              py={3}
              {...textareaBorderStyles}
              _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
          
          <Box>
            <Text fontWeight="semibold" mb={3} color="gray.700" _dark={{ color: 'gray.300' }}>
              Detailed Description *
            </Text>
            <Textarea
              placeholder="Expand on your experience, unique selling propositions, work philosophy, and what kind of projects you enjoy..."
              value={data.detailedDescription}
              onChange={(e) => updateData({ detailedDescription: e.target.value })}
              rows={5}
              px={6}
              py={3}
              {...textareaBorderStyles}
              _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Areas of Specialization & Key Skills - same row */}
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
        <HStack gap={6} align="stretch" flexWrap="wrap">
          <Box flex={{ base: '1 1 100%', md: 1 }} minW={{ base: '100%', md: '280px' }}>
            <Heading size="md" mb={2} color="gray.800" _dark={{ color: 'white' }}>
              Areas of Specialization
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }} mb={3}>
              More specific expertise within your field
            </Text>
            <SpecializationsDropdown
              selectedSpecializations={data.areasOfSpecialization}
              onSpecializationsChange={(specializations) => updateData({ areasOfSpecialization: specializations })}
              placeholder="Select your areas of specialization"
              size="lg"
              maxSpecializations={8}
            />
          </Box>
          <Box flex={{ base: '1 1 100%', md: 1 }} minW={{ base: '100%', md: '280px' }}>
            <Heading size="md" mb={2} color="gray.800" _dark={{ color: 'white' }}>
              Key Skills
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }} mb={3}>
              List your most relevant technical and soft skills
            </Text>
            <SkillsDropdown
              selectedSkills={data.keySkills}
              onSkillsChange={(skills) => updateData({ keySkills: skills })}
              placeholder="Select your key skills"
              size="lg"
              maxSkills={15}
            />
          </Box>
        </HStack>
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={1} _dark={{ borderColor: 'gray.600' }} />

      {/* Experience & Languages Section */}
      <Box>
        <Heading size="md" mb={4}>Experience & Languages</Heading>
        
        <Stack direction="column" gap={4} align="stretch">
          <HStack gap={4} w="full">
            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>Years of Experience *</Text>
              <Input
                type="number"
                placeholder="5"
                value={data.yearsOfExperience}
                onChange={(e) => updateData({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                min={0}
                max={50}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>
            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>Languages Spoken (Optional)</Text>
              <LanguagesDropdown
                selectedLanguages={data.languagesSpoken ? data.languagesSpoken.split(',').map((s) => s.trim()).filter(Boolean) : []}
                onLanguagesChange={(names) => updateData({ languagesSpoken: names.join(', ') })}
                placeholder="Select languages you speak"
                size="lg"
                maxLanguages={10}
              />
            </Box>
          </HStack>
        </Stack>
      </Box>
    </Stack>
  );
}
