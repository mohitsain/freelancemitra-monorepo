"use client"
import React from 'react';
import {
  Box,
  Stack,
  HStack,
  Button,
  Text,
  Heading,
  Input,
  Textarea,
  IconButton,
  Badge
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { OnboardingData } from '../onboarding-flow';
import { inputBorderStyles, textareaBorderStyles, addSectionButtonStyles } from '@/lib/onboarding-form-styles';

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
    <Stack direction="column" gap={0} align="stretch">
      {/* Header Section */}
      <Box>
        <HStack justify="space-between" align="flex-start" mb={1} flexWrap="wrap" gap={2}>
          <Box>
            <Heading size="md" mb={1}>Client Testimonials & Reviews</Heading>
            <Text fontSize="sm" color="gray.600" mb={1}>
              Add testimonials from previous clients to build trust and showcase your work quality
            </Text>
            <HStack gap={4} align="center">
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                {completedTestimonials} of {data.testimonials.length} completed
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {completedTestimonials === data.testimonials.length 
                  ? 'All testimonials completed!' 
                  : `${data.testimonials.length - completedTestimonials} remaining`}
              </Text>
            </HStack>
          </Box>
          <Button
            onClick={addTestimonial}
            colorScheme="blue"
            {...addSectionButtonStyles}
          >
            + Add Another Testimonial
          </Button>
        </HStack>
      </Box>

      <Box borderTop="1px" borderColor="gray.200" my={0} _dark={{ borderColor: 'gray.600' }} />

      {/* Testimonials List */}
      {data.testimonials.map((testimonial, index) => (
        <Box
          key={index}
          p={4}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          bg={bgColor}
          position="relative"
          mt={index > 0 ? 1 : 0}
        >
          <HStack justify="space-between" mb={2}>
            <HStack gap={3}>
              <Text fontWeight="bold" fontSize="lg">
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
          
          <Stack direction="column" gap={2} align="stretch">
            <HStack gap={3} w="full">
              <Input
                placeholder="Client Name"
                value={testimonial.clientName}
                onChange={(e) => updateTestimonial(index, 'clientName', e.target.value)}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
              <Input
                placeholder="Client Title/Position"
                value={testimonial.clientTitle}
                onChange={(e) => updateTestimonial(index, 'clientTitle', e.target.value)}
                size="lg"
                px={6}
                py={3}
                {...inputBorderStyles}
                _dark={{ ...inputBorderStyles._dark, bg: 'gray.700' }}
              />
            </HStack>
            
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Testimonial Content
              </Text>
              <Textarea
                placeholder="Copy and paste the testimonial from your client here. Include specific details about the project, your performance, and the results achieved..."
                value={testimonial.testimonial}
                onChange={(e) => updateTestimonial(index, 'testimonial', e.target.value)}
                rows={4}
                px={6}
                py={3}
                {...textareaBorderStyles}
                _dark={{ ...textareaBorderStyles._dark, bg: 'gray.700' }}
              />
            </Box>
          </Stack>
        </Box>
      ))}

      <Box borderTop="1px" borderColor="gray.200" my={1} _dark={{ borderColor: 'gray.600' }} />

      {/* Example Testimonial */}
      <Box
        p={3}
        border="1px"
        borderColor="purple.200"
        borderRadius="md"
        bg="purple.50"
        _dark={{ bg: 'purple.900', borderColor: 'purple.700' }}
      >
        <Stack direction="column" gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="purple.800" _dark={{ color: 'purple.200' }}>
            📝 Example of a Great Testimonial:
          </Text>
          <Box
            p={3}
            bg="white"
            borderRadius="md"
            border="1px"
            borderColor="purple.200"
            _dark={{ bg: 'gray.800', borderColor: 'purple.600' }}
          >
            <Text fontSize="sm" fontStyle="italic" color="gray.700" _dark={{ color: 'gray.300' }}>
              "John delivered exceptional results on our website redesign project. He completed the work 
              ahead of schedule, maintained excellent communication throughout, and exceeded our expectations 
              with his creative solutions. Our conversion rates increased by 25% after the launch. 
              Highly recommend for any web development needs!"
            </Text>
            <HStack justify="space-between" mt={2}>
              <Text fontSize="xs" fontWeight="medium" color="purple.600" _dark={{ color: 'purple.400' }}>
                — Sarah Johnson, Marketing Director at TechCorp
              </Text>
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
