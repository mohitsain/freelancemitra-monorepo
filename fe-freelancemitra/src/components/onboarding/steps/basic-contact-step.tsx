"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  HStack,
  Text,
  Heading,
  Input,
  Textarea,
  Button,
  Spinner
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import RoleDropdown from '@/components/ui/role-dropdown';
import CountryDropdown from '@/components/ui/country-dropdown';
import StateDropdown from '@/components/ui/state-dropdown';
import PhoneCodeDropdown from '@/components/ui/phone-code-dropdown';
import { getCountries, getCountryCodeByName } from '@/lib/locations-api';
import { uploadOnboardingFile, getDisplayUrl } from '@/lib/upload-api';
import { toastError, toastSuccess } from '@/components/ui/toaster';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  invalidFields?: string[];
}

/** True if value is an S3 key (to be resolved to display URL). */
function isS3Key(value: string): boolean {
  return value.startsWith('users/') || value.startsWith('onboarding/');
}

import { inputBorderStylesWithDarkBg, invalidBorderForInput, cardStyles, labelStyles, requiredAsteriskStyles } from '@/lib/onboarding-form-styles';

function invalidInputStyles(invalid: boolean) {
  return invalid ? { borderColor: 'red.500' as const } : {};
}

export default function BasicContactStep({ data, updateData, invalidFields }: Props) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const avatarCircleBg = useColorModeValue('gray.200', 'gray.600');
  const avatarIconColor = useColorModeValue('gray.600', 'gray.300');
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  // Resolve country name to code when data is pre-filled (e.g. from API)
  useEffect(() => {
    if (!data.country) {
      setSelectedCountryCode('');
      return;
    }
    getCountries().then((list) => {
      const code = getCountryCodeByName(list, data.country);
      if (code) setSelectedCountryCode(code);
    });
  }, [data.country]);

  // Resolve S3 key to presigned display URL for img src
  useEffect(() => {
    if (!data.profilePicture || !isS3Key(data.profilePicture)) {
      setDisplayUrl(null);
      return;
    }
    let cancelled = false;
    getDisplayUrl(data.profilePicture)
      .then((url) => { if (!cancelled) setDisplayUrl(url); })
      .catch(() => { if (!cancelled) setDisplayUrl(null); });
    return () => { cancelled = true; };
  }, [data.profilePicture]);

  const profilePictureSrc = data.profilePicture
    ? (isS3Key(data.profilePicture) ? displayUrl : data.profilePicture)
    : null;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toastError('Please select an image file (e.g. JPEG, PNG).');
      return;
    }
    setUploading(true);
    try {
      const key = await uploadOnboardingFile(file, 'profile');
      updateData({ profilePicture: key });
      toastSuccess('Profile picture uploaded.');
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <Stack direction="column" gap={6} align="stretch">
      {/* Two cards: left = Profile Picture, right = Contact details */}
      <HStack
        gap={6}
        align="stretch"
        flexDirection={{ base: 'column', md: 'row' }}
        w="full"
      >
        {/* Left card: Profile Picture */}
        <Box
          flex={{ base: 'none', md: '0 0 280px' }}
          {...cardStyles}
          display="flex"
          flexDirection="column"
          minH={{ base: 'auto', md: '380px' }}
        >
          <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
            Profile Picture
          </Text>
          <Stack align="center" gap={4} flex={1} justify="flex-start">
            <Box
              w={{ base: '140px', md: '180px' }}
              h={{ base: '140px', md: '180px' }}
              flexShrink={0}
              borderRadius="full"
              bg={avatarCircleBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              border="3px"
              borderColor="white"
              boxShadow="0 8px 20px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)"
              _dark={{
                borderColor: 'gray.700'
              }}
            >
              {profilePictureSrc ? (
                <img
                  src={profilePictureSrc}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Box
                  position="relative"
                  zIndex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="full"
                  h="full"
                  aria-hidden
                >
                  <Box boxSize={{ base: 16, md: 20 }} flexShrink={0}>
                    <svg
                      viewBox="0 0 448 512"
                      width="100%"
                      height="100%"
                      fill={avatarIconColor}
                      aria-hidden
                    >
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>
                  </Box>
                </Box>
              )}
            </Box>
          </Stack>
          <Box mt="auto" pt={4}>
            <Button
              variant="solid"
              colorScheme="blue"
              size="md"
              w="full"
              py={3}
              borderRadius="lg"
              disabled={uploading}
              onClick={() => document.getElementById('profile-upload')?.click()}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.2)'
              }}
              transition="all 0.2s"
            >
              {uploading ? (
                <HStack gap={2}><Spinner size="sm" /> Uploading…</HStack>
              ) : (
                '📁 Upload Photo'
              )}
            </Button>
            {profilePictureSrc && (
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                w="full"
                mt={3}
                py={2}
                borderRadius="lg"
                disabled={uploading}
                onClick={() => updateData({ profilePicture: '' })}
              >
                Remove photo
              </Button>
            )}
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </Box>
        </Box>

        {/* Right card: Name, role, phone */}
        <Box flex={{ base: '1 1 auto', md: '1' }} minW={0} {...cardStyles}>
          <Text fontWeight="semibold" mb={4} color="gray.700" _dark={{ color: 'gray.300' }}>
            Contact details
          </Text>
          <Stack gap={5}>
            <HStack gap={4} w="full" align="flex-start" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
              <Box flex={{ base: '1 1 100%', sm: '1' }} minW={0}>
                <Text {...labelStyles}>
                  First Name <Text {...requiredAsteriskStyles}>*</Text>
                </Text>
                <Input
                  placeholder="Your first name"
                  value={data.firstName}
                  onChange={(e) => updateData({ firstName: e.target.value })}
                  required
                  size="md"
                  px={4}
                  py={2.5}
                  {...inputBorderStylesWithDarkBg}
                  {...(invalidFields?.includes('firstName') ? invalidBorderForInput : {})}
                  {...invalidInputStyles(!!invalidFields?.includes('firstName'))}
                />
              </Box>
              <Box flex={{ base: '1 1 100%', sm: '1' }} minW={0}>
                <Text {...labelStyles}>
                  Last Name <Text {...requiredAsteriskStyles}>*</Text>
                </Text>
                <Input
                  placeholder="Your last name"
                  value={data.lastName}
                  onChange={(e) => updateData({ lastName: e.target.value })}
                  required
                  size="md"
                  px={4}
                  py={2.5}
                  {...inputBorderStylesWithDarkBg}
                  {...(invalidFields?.includes('lastName') ? invalidBorderForInput : {})}
                  {...invalidInputStyles(!!invalidFields?.includes('lastName'))}
                />
              </Box>
            </HStack>
            <Box>
              <Text {...labelStyles}>
                Professional Title/Role <Text {...requiredAsteriskStyles}>*</Text>
              </Text>
              <Box {...(invalidFields?.includes('professionalTitle') ? { borderWidth: '2px', borderColor: 'red.500', borderRadius: 'lg', p: '2px', _dark: { borderColor: 'red.400' } } : {})}>
                <RoleDropdown
                  value={data.professionalTitle}
                  onChange={(value) => updateData({ professionalTitle: value })}
                  placeholder="Select your professional role"
                  size="md"
                />
              </Box>
            </Box>
            <HStack gap={3} w="full" align="flex-end" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
              <Box minW={{ base: '100%', sm: '140px' }} w={{ sm: '160px' }}>
                <Text {...labelStyles}>
                  Country code <Text {...requiredAsteriskStyles}>*</Text>
                </Text>
                <Box {...(invalidFields?.includes('countryPhoneCode') ? { borderWidth: '2px', borderColor: 'red.500', borderRadius: 'lg', p: '2px', _dark: { borderColor: 'red.400' } } : {})}>
                <PhoneCodeDropdown
                  value={data.countryPhoneCode}
                  onChange={(value) => updateData({ countryPhoneCode: value })}
                  placeholder="Code"
                  size="md"
                />
              </Box>
              </Box>
              <Box flex={1} minW={0}>
                <Text {...labelStyles}>
                  Phone number <Text {...requiredAsteriskStyles}>*</Text>
                </Text>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={data.phoneNumber}
                  onChange={(e) => updateData({ phoneNumber: e.target.value })}
                  size="md"
                  px={4}
                  py={2.5}
                  {...inputBorderStylesWithDarkBg}
                  {...(invalidFields?.includes('phoneNumber') ? invalidBorderForInput : {})}
                  {...invalidInputStyles(!!invalidFields?.includes('phoneNumber'))}
                />
              </Box>
            </HStack>
          </Stack>
        </Box>
      </HStack>

      {/* Full-width card: Address details */}
      <Box {...cardStyles}>
        <Heading size="md" mb={4} color="gray.800" _dark={{ color: 'white' }}>
          Address details
        </Heading>
        <Stack gap={4}>
              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
                  Address line 1 <Text {...requiredAsteriskStyles}>*</Text>
                </Text>
                <Input
                  placeholder="Street address, P.O. box"
                  value={data.addressLine1}
                  onChange={(e) => updateData({ addressLine1: e.target.value })}
                  size="lg"
                  px={6}
                  py={3}
                  {...inputBorderStylesWithDarkBg}
                  {...(invalidFields?.includes('addressLine1') ? invalidBorderForInput : {})}
                  {...invalidInputStyles(!!invalidFields?.includes('addressLine1'))}
                />
              </Box>
              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
                  Address line 2
                </Text>
                <Input
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={data.addressLine2}
                  onChange={(e) => updateData({ addressLine2: e.target.value })}
                  size="lg"
                  px={6}
                  py={3}
                  {...inputBorderStylesWithDarkBg}
                />
              </Box>
              <Box>
                <HStack gap={4} flexWrap="wrap" align="flex-end">
                  <Box flex="1 1 120px" minW="120px">
                    <Text {...labelStyles}>
                      City <Text {...requiredAsteriskStyles}>*</Text>
                    </Text>
                    <Input
                      placeholder="City"
                      value={data.city}
                      onChange={(e) => updateData({ city: e.target.value })}
                      size="lg"
                      px={6}
                      py={3}
                      {...inputBorderStylesWithDarkBg}
                      {...(invalidFields?.includes('city') ? invalidBorderForInput : {})}
                      {...invalidInputStyles(!!invalidFields?.includes('city'))}
                    />
                  </Box>
                  <Box flex="1 1 100px" minW="100px">
                    <Text {...labelStyles}>Postal code</Text>
                    <Input
                      placeholder="Postal code"
                      value={data.postalCode}
                      onChange={(e) => updateData({ postalCode: e.target.value })}
                      size="lg"
                      px={6}
                      py={3}
                      {...inputBorderStylesWithDarkBg}
                    />
                  </Box>
                  <Box flex="1 1 140px" minW="140px">
                    <Text {...labelStyles}>
                      Country <Text {...requiredAsteriskStyles}>*</Text>
                    </Text>
                    <Box {...(invalidFields?.includes('country') ? { borderWidth: '2px', borderColor: 'red.500', borderRadius: 'lg', p: '2px', _dark: { borderColor: 'red.400' } } : {})}>
                    <CountryDropdown
                      value={data.country}
                      onChange={(value) => updateData({ country: value })}
                      onCountrySelect={(code) => {
                        setSelectedCountryCode(code);
                        if (!data.state) updateData({ state: '' });
                      }}
                      placeholder="Country"
                      size="lg"
                    />
                  </Box>
                  </Box>
                  <Box flex="1 1 140px" minW="140px">
                    <Text {...labelStyles}>State / Province</Text>
                    <StateDropdown
                      countryCode={selectedCountryCode}
                      value={data.state}
                      onChange={(value) => updateData({ state: value })}
                      placeholder="State / Province"
                      size="lg"
                    />
                  </Box>
                </HStack>
              </Box>
            </Stack>
      </Box>
    </Stack>
  );
}
