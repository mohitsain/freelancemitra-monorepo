"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Input,
  Textarea,
  Badge
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStyles, textareaBorderStyles, addSectionButtonStyles, cardStyles, labelStyles, inputSizes } from '@/lib/onboarding-form-styles';

interface Props {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function TestimonialsStep({ data, updateData }: Props) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const addTestimonial = () => {
    const newTestimonials = [...data.testimonials, {
      clientName: '',
      clientTitle: '',
      testimonial: ''
    }];
    updateData({ testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = data.testimonials.filter((_, i) => i !== index);
    updateData({ testimonials: newTestimonials });
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    const newTestimonials = [...data.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    updateData({ testimonials: newTestimonials });
  };

  const completedTestimonials = data.testimonials.filter(
    t => t.clientName && t.clientTitle && t.testimonial
  ).length;

  return (
    <Stack direction="column" gap={6} align="stretch">
      {/* Header + Testimonials in one card */}
      <Box {...cardStyles}>
        <HStack justify="space-between" align="flex-start" mb={5} flexWrap="wrap" gap={3}>
          <Box>
            <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
              Client Testimonials & Reviews
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
              Add testimonials from previous clients to build trust and showcase your work quality
            </Text>
            <HStack gap={3} align="center">
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                {completedTestimonials} of {data.testimonials.length} completed
              </Badge>
              <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
                {completedTestimonials === data.testimonials.length
                  ? 'All testimonials completed!'
                  : `${data.testimonials.length - completedTestimonials} remaining`}
              </Text>
            </HStack>
          </Box>
          <Button onClick={addTestimonial} colorScheme="blue" {...addSectionButtonStyles}>
            + Add Another Testimonial
          </Button>
        </HStack>

        {data.testimonials.map((testimonial, index) => (
          <Box
            key={index}
            p={5}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
            mb={index < data.testimonials.length - 1 ? 5 : 0}
            _dark={{ borderColor: 'gray.600', bg: 'gray.700' }}
          >
            <HStack justify="space-between" mb={4}>
              <HStack gap={3}>
                <Text fontWeight="bold" fontSize="md" color="gray.800" _dark={{ color: 'white' }}>
                  Testimonial {index + 1}
                </Text>
                {testimonial.clientName && testimonial.clientTitle && testimonial.testimonial && (
                  <Badge colorScheme="green" variant="subtle">
                    Complete
                  </Badge>
                )}
              </HStack>
              {data.testimonials.length > 1 && (
                <Button
                  aria-label="Remove testimonial"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => removeTestimonial(index)}
                >
                  ✕
                </Button>
              )}
            </HStack>

            <Stack direction="column" gap={5} align="stretch">
              <HStack gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>Client Name</Text>
                  <Input
                    placeholder="Client name"
                    value={testimonial.clientName}
                    onChange={(e) => updateTestimonial(index, 'clientName', e.target.value)}
                    {...inputSizes}
                    {...inputBorderStyles}
                    _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                  />
                </Box>
                <Box flex={1} minW={0}>
                  <Text {...labelStyles}>Client Title/Position</Text>
                  <Input
                    placeholder="Client title or position"
                    value={testimonial.clientTitle}
                    onChange={(e) => updateTestimonial(index, 'clientTitle', e.target.value)}
                    {...inputSizes}
                    {...inputBorderStyles}
                    _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
                  />
                </Box>
              </HStack>

              <Box>
                <Text {...labelStyles}>Testimonial Content</Text>
                <Textarea
                  placeholder="Copy and paste the testimonial from your client here. Include specific details about the project, your performance, and the results achieved..."
                  value={testimonial.testimonial}
                  onChange={(e) => updateTestimonial(index, 'testimonial', e.target.value)}
                  rows={4}
                  px={4}
                  py={2.5}
                  {...textareaBorderStyles}
                  _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
                />
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
