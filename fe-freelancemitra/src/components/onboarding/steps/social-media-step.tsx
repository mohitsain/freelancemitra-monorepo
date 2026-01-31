"use client"
import React from 'react';
import {
  Box,
  Stack,
  Text,
  Input,
  Textarea
} from '@chakra-ui/react';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStyles, textareaBorderStyles, cardStyles, labelStyles, inputSizes } from '@/lib/onboarding-form-styles';

const invalidBorder = { borderColor: 'red.500', _dark: { borderColor: 'red.400' } };

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  invalidFields?: string[];
}

export default function SocialMediaStep({ data, updateData, invalidFields }: Props) {
  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Stack direction="column" gap={6} align="stretch">
      {/* LinkedIn Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
          LinkedIn Profile
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={4}>
          LinkedIn is essential for professional credibility and networking
        </Text>
        <Box>
          <Text {...labelStyles}>LinkedIn Profile URL</Text>
          <Input
            placeholder="https://linkedin.com/in/yourprofile"
            value={data.linkedinUrl}
            onChange={(e) => updateData({ linkedinUrl: e.target.value })}
            type="url"
            {...inputSizes}
            {...inputBorderStyles}
            _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            {...(invalidFields?.includes('linkedinUrl') ? invalidBorder : {})}
          />
          {!validateUrl(data.linkedinUrl) && data.linkedinUrl !== '' && (
            <Text color="red.500" fontSize="sm" mt={2}>
              Please enter a valid URL
            </Text>
          )}
        </Box>
      </Box>

      {/* Other Social Media Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
          Other Social Media Profiles
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={5}>
          Add other relevant social media profiles to showcase your work and expertise
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          <Box>
            <Text {...labelStyles}>Twitter/X (for writers, marketers, thought leaders)</Text>
            <Input
              placeholder="https://twitter.com/yourhandle"
              value={data.otherSocialMedia.includes('twitter') ? data.otherSocialMedia : ''}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              type="url"
              {...inputSizes}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
          <Box>
            <Text {...labelStyles}>GitHub (for developers, technical professionals)</Text>
            <Input
              placeholder="https://github.com/yourusername"
              value={data.otherSocialMedia.includes('github') ? data.otherSocialMedia : ''}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              type="url"
              {...inputSizes}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
          <Box>
            <Text {...labelStyles}>Instagram (for visual artists, designers, photographers)</Text>
            <Input
              placeholder="https://instagram.com/yourprofile"
              value={data.otherSocialMedia.includes('instagram') ? data.otherSocialMedia : ''}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              type="url"
              {...inputSizes}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
          <Box>
            <Text {...labelStyles}>Other Relevant Platforms</Text>
            <Textarea
              placeholder="Add any other social media profiles, portfolio sites, or professional platforms..."
              value={data.otherSocialMedia}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              rows={3}
              px={4}
              py={2.5}
              {...textareaBorderStyles}
              _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
            />
            <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }} mt={2}>
              You can add multiple URLs separated by commas or new lines
            </Text>
          </Box>
        </Stack>
      </Box>

      {/* Personal Website Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
          Personal Website & Portfolio
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={4}>
          Showcase your work and expertise with a personal website or portfolio
        </Text>
        <Box>
          <Text {...labelStyles}>Website URL</Text>
          <Input
            placeholder="https://yourwebsite.com or https://yourportfolio.com"
            value={data.personalWebsite}
            onChange={(e) => updateData({ personalWebsite: e.target.value })}
            type="url"
            {...inputSizes}
            {...inputBorderStyles}
            _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
          />
          {!validateUrl(data.personalWebsite) && data.personalWebsite !== '' && (
            <Text color="red.500" fontSize="sm" mt={2}>
              Please enter a valid URL
            </Text>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
