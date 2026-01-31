"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { getStates, type StateItem } from '@/lib/locations-api';
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles } from '@/lib/onboarding-form-styles';

interface StateDropdownProps {
  countryCode: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StateDropdown({
  countryCode,
  value,
  onChange,
  placeholder = "Select state / province",
  size = "lg"
}: StateDropdownProps) {
  const DROPDOWN_OPTION_FONT = 'sm';
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [states, setStates] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (!countryCode) {
      setStates([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getStates(countryCode).then((list) => {
      if (!cancelled) {
        setStates(list);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setStates([]);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [countryCode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStates = states.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (state: StateItem) => {
    onChange(state.name);
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayValue = value || placeholder;
  const disabled = !countryCode;

  return (
    <Box position="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        w="full"
        justifyContent="space-between"
        size={size}
        borderRadius="lg"
        border="2px solid"
        borderColor="gray.300"
        px={6}
        py={3}
        _focus={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)'
        }}
        _hover={{
          borderColor: disabled ? undefined : 'gray.400'
        }}
        _dark={{
          borderColor: 'gray.500',
          bg: 'gray.700',
          _focus: { borderColor: 'blue.400' }
        }}
      >
        <Text
          color={value ? 'inherit' : 'gray.500'}
          textAlign="left"
          w="full"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize={DROPDOWN_OPTION_FONT}
        >
          {displayValue}
        </Text>
        <Text ml={2} fontSize="lg">
          {isOpen ? '▲' : '▼'}
        </Text>
      </Button>

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
          maxH="320px"
          overflow="hidden"
          mt={1}
        >
          <Box {...dropdownSearchWrapperStyles}>
            <Input
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>

          <Box maxH="280px" overflowY="auto">
            {loading ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">Loading states…</Text>
              </Box>
            ) : filteredStates.length > 0 ? (
              <Stack gap={0}>
                {filteredStates.map((s) => (
                  <Box
                    key={`${s.code}-${s.name}`}
                    px={4}
                    py={3}
                    cursor="pointer"
                    onClick={() => handleSelect(s)}
                    borderBottom="1px"
                    borderColor={borderColor}
                    _last={{ borderBottom: 'none' }}
                    _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
                  >
                    <Text fontWeight="medium" fontSize={DROPDOWN_OPTION_FONT}>{s.name}</Text>
                  </Box>
                ))}
              </Stack>
            ) : null}
            {states.length === 0 && !countryCode && (
              <Box p={4} textAlign="center">
                <Text color="gray.500" fontSize="sm">Select a country first</Text>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
