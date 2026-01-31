"use client"
import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  HStack
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles } from '@/lib/onboarding-form-styles';
import { CURRENCIES, Currency } from '@/data/currency-data';

interface CurrencyDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CurrencyDropdown({ 
  value, 
  onChange, 
  placeholder = "Select currency", 
  size = "lg"
}: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Handle outside click manually
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCurrencies = CURRENCIES.filter(currency => {
    const matchesSearch = currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         currency.symbol.includes(searchTerm);
    return matchesSearch;
  });

  const handleCurrencySelect = (currency: Currency) => {
    onChange(currency.code);
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
        border="2px"
        borderColor="gray.200"
        px={6}
        py={3}
        _focus={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)'
        }}
        _hover={{
          borderColor: 'gray.300'
        }}
        _dark={{
          borderColor: 'gray.600',
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
          {/* Search Input */}
          <Box {...dropdownSearchWrapperStyles}>
            <Input
              placeholder="🔍 Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>

          {/* Currency list */}
          <Box maxH="400px" overflowY="auto">
            {filteredCurrencies.length > 0 ? (
              <Stack gap={0}>
                {filteredCurrencies.map((currency) => (
                  <Box
                    key={currency.code}
                    px={6}
                    py={4}
                    cursor="pointer"
                    onClick={() => handleCurrencySelect(currency)}
                    borderBottom="1px"
                    borderColor={borderColor}
                    _last={{ borderBottom: 'none' }}
                    transition="all 0.2s ease"
                    position="relative"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      bg: 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                    _hover={{ 
                      bg: 'orange.50',
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                      _before: {
                        bg: 'orange.500'
                      }
                    }}
                    _dark={{
                      _hover: {
                        bg: 'orange.900',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                      }
                    }}
                  >
                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium" fontSize="md">{currency.name}</Text>
                      </Box>
                      <Text fontSize="lg" fontWeight="bold" color="orange.600">
                        {currency.symbol}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box p={6} textAlign="center">
                <Text color="gray.500">No currencies found</Text>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
