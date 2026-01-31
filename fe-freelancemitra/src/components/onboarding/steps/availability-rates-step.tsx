"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Input
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStyles, cardStyles, labelStyles, inputSizes, requiredAsteriskStyles } from '@/lib/onboarding-form-styles';
import CurrencyDropdown from '@/components/ui/currency-dropdown';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function AvailabilityRatesStep({ data, updateData }: Props) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Stack direction="column" gap={6} align="stretch">
      {/* Availability Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
          Availability
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={5}>
          Let clients know when you're available and how much time you can dedicate
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          <Box>
            <Text {...labelStyles}>Work Type</Text>
            <HStack gap={3} flexWrap="wrap">
              <Button
                size="md"
                variant="outline"
                colorScheme="blue"
                borderRadius="lg"
                borderWidth="2px"
                borderColor={data.availability === 'full-time' ? 'blue.500' : 'gray.300'}
                bg={data.availability === 'full-time' ? 'blue.50' : undefined}
                color={data.availability === 'full-time' ? 'blue.700' : undefined}
                px={5}
                transition="all 0.2s"
                _dark={{
                  borderColor: data.availability === 'full-time' ? 'blue.400' : 'gray.500',
                  bg: data.availability === 'full-time' ? 'blue.900' : undefined,
                  color: data.availability === 'full-time' ? 'blue.100' : undefined,
                }}
                _hover={{
                  borderColor: 'blue.400',
                  bg: data.availability === 'full-time' ? 'blue.100' : 'gray.50',
                  boxShadow: '0 10px 25px -5px rgba(66, 153, 225, 0.3)',
                  transform: 'translateY(-2px)',
                  _dark: { bg: data.availability === 'full-time' ? 'blue.800' : 'gray.700' },
                }}
                onClick={() => updateData({ availability: 'full-time' })}
              >
                Full-time
              </Button>
              <Button
                size="md"
                variant="outline"
                colorScheme="blue"
                borderRadius="lg"
                borderWidth="2px"
                borderColor={data.availability === 'part-time' ? 'blue.500' : 'gray.300'}
                bg={data.availability === 'part-time' ? 'blue.50' : undefined}
                color={data.availability === 'part-time' ? 'blue.700' : undefined}
                px={5}
                transition="all 0.2s"
                _dark={{
                  borderColor: data.availability === 'part-time' ? 'blue.400' : 'gray.500',
                  bg: data.availability === 'part-time' ? 'blue.900' : undefined,
                  color: data.availability === 'part-time' ? 'blue.100' : undefined,
                }}
                _hover={{
                  borderColor: 'blue.400',
                  bg: data.availability === 'part-time' ? 'blue.100' : 'gray.50',
                  boxShadow: '0 10px 25px -5px rgba(66, 153, 225, 0.3)',
                  transform: 'translateY(-2px)',
                  _dark: { bg: data.availability === 'part-time' ? 'blue.800' : 'gray.700' },
                }}
                onClick={() => updateData({ availability: 'part-time' })}
              >
                Part-time
              </Button>
              <Button
                size="md"
                variant="outline"
                colorScheme="blue"
                borderRadius="lg"
                borderWidth="2px"
                borderColor={data.availability === 'project-based' ? 'blue.500' : 'gray.300'}
                bg={data.availability === 'project-based' ? 'blue.50' : undefined}
                color={data.availability === 'project-based' ? 'blue.700' : undefined}
                px={5}
                transition="all 0.2s"
                _dark={{
                  borderColor: data.availability === 'project-based' ? 'blue.400' : 'gray.500',
                  bg: data.availability === 'project-based' ? 'blue.900' : undefined,
                  color: data.availability === 'project-based' ? 'blue.100' : undefined,
                }}
                _hover={{
                  borderColor: 'blue.400',
                  bg: data.availability === 'project-based' ? 'blue.100' : 'gray.50',
                  boxShadow: '0 10px 25px -5px rgba(66, 153, 225, 0.3)',
                  transform: 'translateY(-2px)',
                  _dark: { bg: data.availability === 'project-based' ? 'blue.800' : 'gray.700' },
                }}
                onClick={() => updateData({ availability: 'project-based' })}
              >
                Project-based
              </Button>
            </HStack>
          </Box>

          <HStack gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
            <Box flex={1} minW={0}>
              <Text {...labelStyles}>Weekly Hours Available</Text>
              <Input
                type="number"
                value={data.weeklyHours}
                onChange={(e) => updateData({ weeklyHours: parseInt(e.target.value) || 0 })}
                min={1}
                max={168}
                placeholder="40"
                {...inputSizes}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>
            <Box flex={1} minW={0}>
              <Text {...labelStyles}>Start Date Availability <Text {...requiredAsteriskStyles}>*</Text></Text>
              <Input
                type="date"
                value={data.startDate}
                onChange={(e) => updateData({ startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                {...inputSizes}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>
          </HStack>
        </Stack>
      </Box>

      {/* Pricing Section */}
      <Box {...cardStyles}>
        <Text fontWeight="semibold" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
          Pricing & Rates
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={5}>
          Set your rates and pricing model to attract the right clients
        </Text>
        <Stack direction="column" gap={5} align="stretch">
          <HStack gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
            <Box flex={1} minW={0}>
              <Text {...labelStyles}>Currency <Text {...requiredAsteriskStyles}>*</Text></Text>
              <CurrencyDropdown
                value={data.currency}
                onChange={(value) => updateData({ currency: value })}
                placeholder="Select currency"
                size="md"
              />
            </Box>
            <Box flex={1} minW={0}>
              <Text {...labelStyles}>
                Hourly Rate {(data.availability === 'full-time' || data.availability === 'part-time') && <Text {...requiredAsteriskStyles}>*</Text>}
              </Text>
              <Input
                type="number"
                placeholder="0.00"
                value={data.hourlyRate}
                onChange={(e) => updateData({ hourlyRate: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
                {...inputSizes}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>
          </HStack>

          <Box>
            <Text {...labelStyles}>
              Project-based Rate {data.availability === 'project-based' && <Text {...requiredAsteriskStyles}>*</Text>}
            </Text>
            {data.availability === 'project-based' && (
              <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }} mb={2}>
                At least one of project-based or retainer rate required
              </Text>
            )}
            <Input
              placeholder="e.g., Starting from $500 or Custom quotes"
              value={data.projectBasedRate}
              onChange={(e) => updateData({ projectBasedRate: e.target.value })}
              {...inputSizes}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>

          <Box>
            <Text {...labelStyles}>
              Retainer Rate {data.availability === 'project-based' && <Text {...requiredAsteriskStyles}>*</Text>}
            </Text>
            <Input
              placeholder="e.g., $2000/month for 20 hours"
              value={data.retainerRate}
              onChange={(e) => updateData({ retainerRate: e.target.value })}
              {...inputSizes}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>

          <Box>
            <Text {...labelStyles}>Minimum Project Size/Budget (Optional)</Text>
            <Input
              placeholder="e.g., $100 minimum or Large projects only"
              value={data.minProjectSize}
              onChange={(e) => updateData({ minProjectSize: e.target.value })}
              {...inputSizes}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
