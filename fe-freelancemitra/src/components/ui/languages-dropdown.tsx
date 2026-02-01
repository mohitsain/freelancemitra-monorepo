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
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles, dropdownTriggerBorderStylesWithDarkBg } from '@/lib/onboarding-form-styles';
import { getLanguages, type LanguageItem } from '@/lib/masters-api';

interface LanguagesDropdownProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  maxLanguages?: number;
}

export default function LanguagesDropdown({
  selectedLanguages,
  onLanguagesChange,
  placeholder = "Select languages",
  size = "lg",
  maxLanguages = 10,
}: LanguagesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getLanguages().then((list) => {
      if (!cancelled) {
        setLanguages(list);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter((lang) => {
    const matchesSearch = lang.name.toLowerCase().includes(searchTerm.toLowerCase());
    const notAlreadySelected = !selectedLanguages.includes(lang.name);
    return matchesSearch && notAlreadySelected;
  });

  const handleLanguageSelect = (lang: LanguageItem) => {
    if (selectedLanguages.length < maxLanguages) {
      onLanguagesChange([...selectedLanguages, lang.name]);
    }
  };

  const handleLanguageRemove = (name: string) => {
    onLanguagesChange(selectedLanguages.filter((n) => n !== name));
  };

  const displayValue = selectedLanguages.length > 0
    ? `${selectedLanguages.length} language${selectedLanguages.length !== 1 ? 's' : ''} selected`
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
          color={selectedLanguages.length > 0 ? 'inherit' : 'gray.500'}
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
          maxH="420px"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          mt={1}
        >
          {selectedLanguages.length > 0 && (
            <Box flexShrink={0} p={2} borderBottom="1px" borderColor={borderColor} bg={hoverBg}>
              <Stack direction="row" gap={2} wrap="wrap">
                {selectedLanguages.map((name) => (
                  <Box
                    key={name}
                    px={3}
                    py={1}
                    bg="teal.100"
                    color="teal.800"
                    borderRadius="full"
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    border="1px"
                    borderColor="teal.300"
                    _dark={{
                      bg: 'teal.900',
                      color: 'teal.200',
                      borderColor: 'teal.600'
                    }}
                  >
                    <Text>{name}</Text>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="teal"
                      onClick={(e) => { e.stopPropagation(); handleLanguageRemove(name); }}
                      p={0}
                      minW="auto"
                      h="auto"
                      _hover={{ bg: 'red.100', color: 'red.600' }}
                      _dark={{ _hover: { bg: 'red.900', color: 'red.400' } }}
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
          <Box flexShrink={0} {...dropdownSearchWrapperStyles}>
            <Input
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>

          <Box flex="1" minH={0} overflowY="auto" bg="gray.50" _dark={{ bg: 'gray.800' }}>
            {loading ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">Loading…</Text>
              </Box>
            ) : filteredLanguages.length > 0 ? (
              <Stack gap={1} p={2}>
                {filteredLanguages.map((lang) => (
                  <Box
                    key={lang.id}
                    px={6}
                    py={3}
                    cursor="pointer"
                    onClick={() => handleLanguageSelect(lang)}
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
                      bg: 'teal.50',
                      transform: 'translateX(4px) scale(1.01)',
                      boxShadow: '0 4px 15px rgba(45, 212, 191, 0.15)',
                      borderColor: 'teal.200',
                      _before: {
                        bg: 'teal.500'
                      }
                    }}
                    _dark={{
                      bg: 'gray.700',
                      borderColor: 'gray.600',
                      _hover: {
                        bg: 'teal.900',
                        transform: 'translateX(4px) scale(1.01)',
                        boxShadow: '0 4px 15px rgba(45, 212, 191, 0.3)',
                        borderColor: 'teal.400'
                      }
                    }}
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.800" _dark={{ color: 'white' }}>
                      {lang.name}
                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">
                  {selectedLanguages.length >= maxLanguages
                    ? `Maximum ${maxLanguages} languages reached`
                    : 'No languages found'}
                </Text>
              </Box>
            )}
          </Box>

          <Box flexShrink={0} p={3} borderTop="1px" borderColor={borderColor} bg={hoverBg}>
            <Text fontSize="sm" textAlign="center" color="gray.600">
              {selectedLanguages.length}/{maxLanguages} languages selected
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
