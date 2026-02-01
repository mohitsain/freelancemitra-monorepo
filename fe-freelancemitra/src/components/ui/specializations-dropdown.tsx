"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  HStack
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles, dropdownTriggerBorderStylesWithDarkBg, inputBorderStyles } from '@/lib/onboarding-form-styles';
import { getSpecializations, type SpecializationItem } from '@/lib/masters-api';

interface SpecializationsDropdownProps {
  selectedSpecializations: string[];
  onSpecializationsChange: (specializations: string[]) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  maxSpecializations?: number;
}

export default function SpecializationsDropdown({ 
  selectedSpecializations, 
  onSpecializationsChange, 
  placeholder = "Select specializations", 
  size = "lg",
  maxSpecializations = 10
}: SpecializationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [otherValue, setOtherValue] = useState('');
  const [specializations, setSpecializations] = useState<SpecializationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getSpecializations().then((list) => {
      if (!cancelled) {
        setSpecializations(list);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSpecializations = specializations.filter(spec => {
    const matchesSearch = spec.name.toLowerCase().includes(searchTerm.toLowerCase());
    const notAlreadySelected = !selectedSpecializations.includes(spec.name);
    return matchesSearch && notAlreadySelected;
  });

  const handleSpecializationSelect = (spec: SpecializationItem) => {
    if (selectedSpecializations.length < maxSpecializations) {
      onSpecializationsChange([...selectedSpecializations, spec.name]);
    }
  };

  const handleSpecializationRemove = (specName: string) => {
    onSpecializationsChange(selectedSpecializations.filter(spec => spec !== specName));
  };

  const handleAddOther = () => {
    const trimmed = otherValue.trim();
    if (trimmed && selectedSpecializations.length < maxSpecializations && !selectedSpecializations.includes(trimmed)) {
      onSpecializationsChange([...selectedSpecializations, trimmed]);
      setOtherValue('');
    }
  };

  const displayValue = selectedSpecializations.length > 0 
    ? `${selectedSpecializations.length} specialization${selectedSpecializations.length !== 1 ? 's' : ''} selected`
    : placeholder;

  return (
    <Box position="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        w="full"
        justifyContent="space-between"
        size={size}
        px={6}
        py={3}
        {...dropdownTriggerBorderStylesWithDarkBg}
      >
        <Text 
          color={selectedSpecializations.length > 0 ? 'inherit' : 'gray.500'} 
          textAlign="left" 
          w="full"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {displayValue}
        </Text>
        <Text ml={2} fontSize="lg">
          {isOpen ? '▲' : '▼'}
        </Text>
      </Button>

      {/* Selected Specializations Display */}
      {selectedSpecializations.length > 0 && (
        <Box mt={3}>
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
            Selected Specializations:
          </Text>
          <Stack direction="row" gap={2} flexWrap="wrap">
            {selectedSpecializations.map((specName, index) => (
              <Box
                key={index}
                px={3}
                py={1}
                bg="green.100"
                color="green.800"
                borderRadius="full"
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={2}
                border="1px"
                borderColor="green.300"
                _dark={{
                  bg: 'green.900',
                  color: 'green.200',
                  borderColor: 'green.600'
                }}
              >
                <Text>{specName}</Text>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => handleSpecializationRemove(specName)}
                  p={0}
                  minW="auto"
                  h="auto"
                  _hover={{
                    bg: 'red.100',
                    color: 'red.600'
                  }}
                  _dark={{
                    _hover: {
                      bg: 'red.900',
                      color: 'red.400'
                    }
                  }}
                >
                  ✕
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          maxH="400px"
          overflow="hidden"
          mt={1}
        >
          {/* Search Input */}
          <Box {...dropdownSearchWrapperStyles}>
            <Input
              placeholder="Search specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>

          {/* Specializations list - consistent font size sm */}
          <Box maxH="340px" overflowY="auto">
            {loading ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">Loading…</Text>
              </Box>
            ) : filteredSpecializations.length > 0 ? (
              <Stack gap={0}>
                {filteredSpecializations.map((spec) => (
                  <Box
                    key={spec.id}
                    px={6}
                    py={3}
                    cursor="pointer"
                    onClick={() => handleSpecializationSelect(spec)}
                    borderRadius="lg"
                    bg="white"
                    border="2px"
                    borderColor="gray.200"
                    transition="all 0.2s ease"
                    position="relative"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      bg: 'transparent',
                      borderRadius: '2px',
                      transition: 'background-color 0.2s ease'
                    }}
                    _hover={{ 
                      bg: 'blue.50',
                      transform: 'translateX(4px) scale(1.01)',
                      boxShadow: '0 4px 15px rgba(66, 153, 225, 0.15)',
                      borderColor: 'blue.200',
                      _before: {
                        bg: 'blue.500'
                      }
                    }}
                    _dark={{
                      bg: 'gray.700',
                      borderColor: 'gray.600',
                      _hover: {
                        bg: 'blue.900',
                        transform: 'translateX(4px) scale(1.01)',
                        boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)',
                        borderColor: 'blue.400'
                      }
                    }}
                  >
                    <Text fontWeight="medium" fontSize="sm" color="gray.800" _dark={{ color: 'white' }} textAlign="center">
                      {spec.name}
                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">
                  {selectedSpecializations.length >= maxSpecializations 
                    ? `Maximum ${maxSpecializations} specializations reached` 
                    : 'No specializations found'}
                </Text>
              </Box>
            )}

            {/* Other (type specialization name) */}
            <Box p={3} borderTop="1px" borderColor={borderColor} bg="gray.50" _dark={{ bg: 'gray.800' }}>
              <Text fontSize="sm" mb={2} color="gray.600" _dark={{ color: 'gray.400' }}>
                Other (type specialization name)
              </Text>
              <HStack gap={3} align="stretch">
                <Input
                  flex={1}
                  size="md"
                  placeholder="Type specialization name"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddOther()}
                  bg="white"
                  {...inputBorderStyles}
                  _dark={{ borderColor: 'gray.500', bg: 'gray.800' }}
                />
                <Button
                  size="md"
                  colorScheme="blue"
                  borderRadius="lg"
                  px={5}
                  onClick={handleAddOther}
                  disabled={!otherValue.trim() || selectedSpecializations.length >= maxSpecializations}
                >
                  Add
                </Button>
              </HStack>
            </Box>
          </Box>

          {/* Specializations Limit Info */}
          <Box p={3} borderTop="1px" borderColor={borderColor} bg={hoverBg}>
            <Text fontSize="sm" textAlign="center" color="gray.600">
              {selectedSpecializations.length}/{maxSpecializations} specializations selected
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
