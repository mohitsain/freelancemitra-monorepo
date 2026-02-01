"use client"
import React, { useState } from 'react';
import {
  Box,
  Stack,
  HStack,
  Text,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import SkillsDropdown from '@/components/ui/skills-dropdown';
import SpecializationsDropdown from '@/components/ui/specializations-dropdown';
import LanguagesDropdown from '@/components/ui/languages-dropdown';
import { inputBorderStylesWithDarkBg, textareaBorderStylesWithDarkBg, cardStyles, labelStyles, inputSizes, requiredAsteriskStyles } from '@/lib/onboarding-form-styles';

const invalidBorder = { borderColor: 'red.500', _dark: { borderColor: 'red.400' } };

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  invalidFields?: string[];
}

export default function ProfessionalOverviewStep({ data, updateData, invalidFields }: Props) {
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
    <Stack direction="column" gap={6} align="stretch">
      {/* Headline Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
          Professional Headline <Text {...requiredAsteriskStyles}>*</Text>
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={4}>
          A concise, catchy phrase describing what you do and your main benefit
        </Text>
        <Input
          placeholder="e.g., Transforming Ideas into Engaging Web Experiences"
          value={data.headline}
          onChange={(e) => updateData({ headline: e.target.value })}
          {...inputSizes}
          {...inputBorderStylesWithDarkBg}
        />
      </Box>

      {/* Bio Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          About Me
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={4}>
          Tell clients about yourself, your experience, and what makes you unique
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          <Box>
            <Text {...labelStyles}>Short Summary (2-3 sentences) <Text {...requiredAsteriskStyles}>*</Text></Text>
            <Textarea
              placeholder="Brief introduction of yourself and your core skills..."
              value={data.shortSummary}
              onChange={(e) => updateData({ shortSummary: e.target.value })}
              rows={3}
              px={4}
              py={2.5}
              {...textareaBorderStylesWithDarkBg}
              {...(invalidFields?.includes('shortSummary') ? invalidBorder : {})}
            />
          </Box>
          <Box>
            <Text {...labelStyles}>Detailed Description (Optional)</Text>
            <Textarea
              placeholder="Expand on your experience, unique selling propositions, work philosophy, and what kind of projects you enjoy..."
              value={data.detailedDescription}
              onChange={(e) => updateData({ detailedDescription: e.target.value })}
              rows={5}
              px={4}
              py={2.5}
              {...textareaBorderStylesWithDarkBg}
            />
          </Box>
        </Stack>
      </Box>

      {/* Areas of Specialization & Key Skills */}
      <Box {...cardStyles}>
        <HStack gap={6} align="stretch" flexWrap="wrap">
          <Box flex={{ base: '1 1 100%', md: 1 }} minW={{ base: '100%', md: '280px' }} {...(invalidFields?.includes('areasOfSpecialization') ? { borderWidth: '2px', borderColor: 'red.500', borderRadius: 'lg', p: '2px', _dark: { borderColor: 'red.400' } } : {})}>
            <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
              Areas of Specialization <Text {...requiredAsteriskStyles}>*</Text>
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={3}>
              Add at least one (required)
            </Text>
            <SpecializationsDropdown
              selectedSpecializations={data.areasOfSpecialization}
              onSpecializationsChange={(specializations) => updateData({ areasOfSpecialization: specializations })}
              placeholder="Select your areas of specialization"
              size="md"
              maxSpecializations={8}
            />
          </Box>
          <Box flex={{ base: '1 1 100%', md: 1 }} minW={{ base: '100%', md: '280px' }} {...(invalidFields?.includes('keySkills') ? { borderWidth: '2px', borderColor: 'red.500', borderRadius: 'lg', p: '2px', _dark: { borderColor: 'red.400' } } : {})}>
            <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
              Key Skills <Text {...requiredAsteriskStyles}>*</Text>
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={3}>
              Add at least one (required)
            </Text>
            <SkillsDropdown
              selectedSkills={data.keySkills}
              onSkillsChange={(skills) => updateData({ keySkills: skills })}
              placeholder="Select your key skills"
              size="md"
              maxSkills={15}
            />
          </Box>
        </HStack>
      </Box>

      {/* Experience & Languages Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
          Experience & Languages
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          <HStack gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
            <Box flex={1} minW={0}>
              <Text {...labelStyles}>Years of Experience (Optional)</Text>
              <Input
                type="number"
                placeholder="5"
                value={data.yearsOfExperience}
                onChange={(e) => updateData({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                min={0}
                max={50}
                {...inputSizes}
                {...inputBorderStylesWithDarkBg}
              />
            </Box>
            <Box flex={1} minW={0} {...(invalidFields?.includes('languagesSpoken') ? { borderWidth: '2px', borderColor: 'red.500', borderRadius: 'lg', p: '2px', _dark: { borderColor: 'red.400' } } : {})}>
              <Text {...labelStyles}>Languages Spoken <Text {...requiredAsteriskStyles}>*</Text></Text>
              <LanguagesDropdown
                selectedLanguages={data.languagesSpoken ? data.languagesSpoken.split(',').map((s) => s.trim()).filter(Boolean) : []}
                onLanguagesChange={(names) => updateData({ languagesSpoken: names.join(', ') })}
                placeholder="Select languages you speak"
                size="md"
                maxLanguages={10}
              />
            </Box>
          </HStack>
        </Stack>
      </Box>
    </Stack>
  );
}
