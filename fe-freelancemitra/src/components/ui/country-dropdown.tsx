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
import { getCountries, type CountryItem } from '@/lib/locations-api';
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles } from '@/lib/onboarding-form-styles';

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  /** Called with (code, name) when user selects a country so parent can load states */
  onCountrySelect?: (code: string, name: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountryDropdown({
  value,
  onChange,
  onCountrySelect,
  placeholder = "Select country",
  size = "lg"
}: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const DROPDOWN_OPTION_FONT = 'sm';
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    let cancelled = false;
    getCountries().then((list) => {
      if (!cancelled) {
        // Dedupe by code so React keys are unique (e.g. backend may return duplicate BJ)
        const seen = new Set<string>();
        const deduped = list.filter((c) => {
          if (seen.has(c.code)) return false;
          seen.add(c.code);
          return true;
        });
        setCountries(deduped);
        setLoading(false);
      }
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: CountryItem) => {
    onChange(country.name);
    onCountrySelect?.(country.code, country.name);
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayValue = value || placeholder;

  return (
    <Box position="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
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
          borderColor: 'gray.400'
        }}
        _dark={{
          borderColor: 'gray.500',
          bg: 'gray.700',
          _focus: {
            borderColor: 'blue.400'
          }
        }}
      >
        <Text
          color={value ? 'inherit' : 'gray.500'}
          textAlign="left"
          w="full"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize="sm"
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
          maxH="400px"
          overflow="hidden"
          mt={1}
        >
          <Box {...dropdownSearchWrapperStyles}>
            <Input
              placeholder="🔍 Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>

          <Box maxH="360px" overflowY="auto">
            {loading ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">Loading countries…</Text>
              </Box>
            ) : filteredCountries.length > 0 ? (
              <Stack gap={0}>
                {filteredCountries.map((country) => (
                  <Box
                    key={country.code}
                    px={4}
                    py={3}
                    cursor="pointer"
                    onClick={() => handleCountrySelect(country)}
                    borderBottom="1px"
                    borderColor={borderColor}
                    _last={{ borderBottom: 'none' }}
                    _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
                  >
                    <Text fontWeight="medium" fontSize="sm">{country.name}</Text>
                  </Box>
                ))}
              </Stack>
            ) : null}
          </Box>
        </Box>
      )}
    </Box>
  );
}
