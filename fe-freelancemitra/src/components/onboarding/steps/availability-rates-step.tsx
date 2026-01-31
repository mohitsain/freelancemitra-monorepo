"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Heading,
  Input
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStyles } from '@/lib/onboarding-form-styles';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function AvailabilityRatesStep({ data, updateData }: Props) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
  ];

  return (
    <Stack direction="column" gap={6} align="stretch">
      {/* Availability Section */}
      <Box>
        <Heading size="md" mb={4}>Availability</Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Let clients know when you're available and how much time you can dedicate
        </Text>
        
        <Stack direction="column" gap={4} align="stretch">
          <Box>
            <Text fontWeight="medium" mb={2}>Work Type</Text>
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

          <HStack gap={4} w="full">
            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>Weekly Hours Available</Text>
              <Input
                type="number"
                value={data.weeklyHours}
                onChange={(e) => updateData({ weeklyHours: parseInt(e.target.value) || 0 })}
                min={1}
                max={168}
                placeholder="40"
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>

            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>Start Date Availability</Text>
              <Input
                type="date"
                value={data.startDate}
                onChange={(e) => updateData({ startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>
          </HStack>
        </Stack>
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={6} />

      {/* Pricing Section */}
      <Box>
        <Heading size="md" mb={4}>Pricing & Rates</Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Set your rates and pricing model to attract the right clients
        </Text>
        
        <Stack direction="column" gap={4} align="stretch">
          <HStack gap={4} w="full">
            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>Currency</Text>
              <select
                value={data.currency}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData({ currency: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </Box>

            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>Hourly Rate</Text>
              <Input
                type="number"
                placeholder="0.00"
                value={data.hourlyRate}
                onChange={(e) => updateData({ hourlyRate: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>
          </HStack>

          <Box>
            <Text fontWeight="medium" mb={2}>Project-based Rate (Optional)</Text>
            <Input
              placeholder="e.g., Starting from $500 or Custom quotes"
              value={data.projectBasedRate}
              onChange={(e) => updateData({ projectBasedRate: e.target.value })}
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={2}>Retainer Rate (Optional)</Text>
            <Input
              placeholder="e.g., $2000/month for 20 hours"
              value={data.retainerRate}
              onChange={(e) => updateData({ retainerRate: e.target.value })}
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={2}>Minimum Project Size/Budget (Optional)</Text>
            <Input
              placeholder="e.g., $100 minimum or Large projects only"
              value={data.minProjectSize}
              onChange={(e) => updateData({ minProjectSize: e.target.value })}
              size="lg"
              px={6}
              py={3}
              {...inputBorderStyles}
              _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
            />
          </Box>
        </Stack>
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={6} />

      {/* Pricing Visibility Note */}
      <Box
        p={4}
        border="1px"
        borderColor="blue.200"
        borderRadius="md"
        bg="blue.50"
        _dark={{ bg: 'blue.900', borderColor: 'blue.700' }}
      >
        <Text fontSize="sm" color="blue.800" _dark={{ color: 'blue.200' }}>
          <strong>Note:</strong> Your hourly rate will be publicly displayed on your profile. 
          Project-based rates and retainer information will only be visible to approved clients.
        </Text>
      </Box>
    </Stack>
  );
}
