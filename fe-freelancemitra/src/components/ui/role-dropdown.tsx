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
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles, inputBorderStyles } from '@/lib/onboarding-form-styles';
import { PROFESSIONAL_ROLES, ROLE_CATEGORIES, ProfessionalRole } from '@/data/professional-roles';

interface RoleDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RoleDropdown({ value, onChange, placeholder = "Select your professional role", size = "lg" }: RoleDropdownProps) {
  const DROPDOWN_OPTION_FONT = 'sm';
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [otherValue, setOtherValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRoles = PROFESSIONAL_ROLES.filter((role) =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOther = value && value.trim() && !PROFESSIONAL_ROLES.some((r) => r.title === value);

  const handleRoleSelect = (role: ProfessionalRole) => {
    onChange(role.title);
    setOtherValue('');
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleOtherInput = (v: string) => {
    setOtherValue(v);
    onChange(v);
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
          zIndex={1000}
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          maxH={{ base: "400px", md: "500px" }}
          w={{ base: "100vw", sm: "100%", md: "500px" }}
          maxW={{ base: "calc(100vw - 32px)", sm: "100%", md: "500px" }}
          left={{ base: "-16px", sm: 0 }}
          right={{ base: "-16px", sm: 0 }}
          overflow="hidden"
          mt={1}
        >
          <Box {...dropdownSearchWrapperStyles}>
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>
          <Box maxH="280px" overflowY="auto">
            <Stack gap={0}>
              {filteredRoles.map((role) => (
                <Box
                  key={role.id}
                  px={4}
                  py={3}
                  cursor="pointer"
                  onClick={() => handleRoleSelect(role)}
                  borderBottom="1px"
                  borderColor={borderColor}
                  _last={{ borderBottom: 'none' }}
                  _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
                >
                  <Text fontWeight="medium" fontSize={DROPDOWN_OPTION_FONT}>
                    {role.title}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>
          <Box p={3} borderTop="1px" borderColor={borderColor} bg="gray.50" _dark={{ bg: 'gray.800' }}>
            <Text fontSize="sm" mb={2} color="gray.600" _dark={{ color: 'gray.400' }}>
              Other (type custom role)
            </Text>
            <Input
              size="md"
              placeholder="Type your role"
              value={isOther ? value : otherValue}
              onChange={(e) => handleOtherInput(e.target.value)}
              bg="white"
              {...inputBorderStyles}
              _dark={{ borderColor: 'gray.500', bg: 'gray.800' }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
