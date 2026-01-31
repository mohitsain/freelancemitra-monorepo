"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Text,
  Heading,
  Input,
  Textarea
} from '@chakra-ui/react';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStyles, textareaBorderStyles } from '@/lib/onboarding-form-styles';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function SocialMediaStep({ data, updateData }: Props) {
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
    <Stack direction="column" gap={1} align="stretch">
      {/* LinkedIn Section */}
      <Box>
        <Heading size="md" mb={2}>LinkedIn Profile</Heading>
        <Text fontSize="sm" color="gray.600" mb={2}>
          LinkedIn is essential for professional credibility and networking
        </Text>
        
        <Box>
          <Text fontWeight="medium" mb={1}>LinkedIn Profile URL</Text>
          <HStack>
            <Text fontSize="lg">🔗</Text>
            <Input
              placeholder="https://linkedin.com/in/yourprofile"
              value={data.linkedinUrl}
              onChange={(e) => updateData({ linkedinUrl: e.target.value })}
              type="url"
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </HStack>
          {!validateUrl(data.linkedinUrl) && data.linkedinUrl !== '' && (
            <Text color="red.500" fontSize="sm" mt={1}>
              Please enter a valid URL
            </Text>
          )}
        </Box>
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={1} _dark={{ borderColor: 'gray.600' }} />

      {/* Other Social Media Section */}
      <Box>
        <Heading size="md" mb={2}>Other Social Media Profiles</Heading>
        <Text fontSize="sm" color="gray.600" mb={2}>
          Add other relevant social media profiles to showcase your work and expertise
        </Text>
        
        <Stack direction="column" gap={2} align="stretch">
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Twitter/X (for writers, marketers, thought leaders)
            </Text>
            <Input
              placeholder="https://twitter.com/yourhandle"
              value={data.otherSocialMedia.includes('twitter') ? data.otherSocialMedia : ''}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              type="url"
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              GitHub (for developers, technical professionals)
            </Text>
            <Input
              placeholder="https://github.com/yourusername"
              value={data.otherSocialMedia.includes('github') ? data.otherSocialMedia : ''}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              type="url"
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Instagram (for visual artists, designers, photographers)
            </Text>
            <Input
              placeholder="https://instagram.com/yourprofile"
              value={data.otherSocialMedia.includes('instagram') ? data.otherSocialMedia : ''}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              type="url"
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Other Relevant Platforms
            </Text>
            <Textarea
              placeholder="Add any other social media profiles, portfolio sites, or professional platforms..."
              value={data.otherSocialMedia}
              onChange={(e) => updateData({ otherSocialMedia: e.target.value })}
              rows={3}
              px={6}
              py={3}
              {...textareaBorderStyles}
              _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              You can add multiple URLs separated by commas or new lines
            </Text>
          </Box>
        </Stack>
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={1} _dark={{ borderColor: 'gray.600' }} />

      {/* Personal Website Section */}
      <Box>
        <Heading size="md" mb={2}>Personal Website & Portfolio</Heading>
        <Text fontSize="sm" color="gray.600" mb={2}>
          Showcase your work and expertise with a personal website or portfolio
        </Text>
        <Input
          placeholder="https://yourwebsite.com or https://yourportfolio.com"
          value={data.personalWebsite}
          onChange={(e) => updateData({ personalWebsite: e.target.value })}
          type="url"
          size="lg"
          px={6}
          py={3}
          {...inputBorderStyles}
          _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
        />
        {!validateUrl(data.personalWebsite) && data.personalWebsite !== '' && (
          <Text color="red.500" fontSize="sm" mt={1}>
            Please enter a valid URL
          </Text>
        )}
      </Box>

    </Stack>
  );
}
