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
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles, dropdownTriggerBorderStyles, inputBorderStyles } from '@/lib/onboarding-form-styles';
import { getSkills, type SkillItem } from '@/lib/masters-api';

interface SkillsDropdownProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  maxSkills?: number;
}

export default function SkillsDropdown({ 
  selectedSkills, 
  onSkillsChange, 
  placeholder = "Select skills", 
  size = "lg",
  maxSkills = 20
}: SkillsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [otherSkillValue, setOtherSkillValue] = useState('');
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getSkills().then((list) => {
      if (!cancelled) {
        setSkills(list);
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

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const notAlreadySelected = !selectedSkills.includes(skill.name);
    return matchesSearch && notAlreadySelected;
  });

  const handleSkillSelect = (skill: SkillItem) => {
    if (selectedSkills.length < maxSkills) {
      onSkillsChange([...selectedSkills, skill.name]);
    }
  };

  const handleSkillRemove = (skillName: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillName));
  };

  const handleAddOtherSkill = () => {
    const trimmed = otherSkillValue.trim();
    if (trimmed && selectedSkills.length < maxSkills && !selectedSkills.includes(trimmed)) {
      onSkillsChange([...selectedSkills, trimmed]);
      setOtherSkillValue('');
    }
  };

  const displayValue = selectedSkills.length > 0 
    ? `${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} selected`
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
        {...dropdownTriggerBorderStyles}
        _dark={{ ...dropdownTriggerBorderStyles._dark, bg: 'gray.700' }}
      >
        <Text 
          color={selectedSkills.length > 0 ? 'inherit' : 'gray.500'} 
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

      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <Box mt={3}>
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700" _dark={{ color: 'gray.300' }}>
            Selected Skills:
          </Text>
          <Stack direction="row" gap={2} wrap="wrap">
            {selectedSkills.map((skillName, index) => (
              <Box
                key={index}
                px={3}
                py={1}
                bg="blue.100"
                color="blue.800"
                borderRadius="full"
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={2}
                border="1px"
                borderColor="blue.300"
                _dark={{
                  bg: 'blue.900',
                  color: 'blue.200',
                  borderColor: 'blue.600'
                }}
              >
                <Text>{skillName}</Text>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => handleSkillRemove(skillName)}
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
          maxH="420px"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          mt={1}
        >
          {/* Search Input - fixed at top */}
          <Box flexShrink={0} {...dropdownSearchWrapperStyles}>
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>

          {/* Skills list - scrollable middle; takes remaining space */}
          <Box flex="1" minH={0} overflowY="auto" bg="gray.50" _dark={{ bg: 'gray.800' }}>
            {loading ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">Loading…</Text>
              </Box>
            ) : filteredSkills.length > 0 ? (
              <Stack gap={1} p={2}>
                {filteredSkills.map((skill) => (
                  <Box
                    key={skill.id}
                    px={6}
                    py={3}
                    cursor="pointer"
                    onClick={() => handleSkillSelect(skill)}
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
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.15)',
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
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                        borderColor: 'blue.400'
                      }
                    }}
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.800" _dark={{ color: 'white' }}>
                      {skill.name}
                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm">
                  {selectedSkills.length >= maxSkills 
                    ? `Maximum ${maxSkills} skills reached` 
                    : 'No skills found'}
                </Text>
              </Box>
            )}
          </Box>

          {/* Other (type skill name) - fixed at bottom, always visible */}
          <Box flexShrink={0} p={3} borderTop="1px" borderColor={borderColor} bg="white" _dark={{ bg: 'gray.700' }}>
            <Text fontSize="sm" mb={2} color="gray.600" _dark={{ color: 'gray.400' }}>
              Other (type skill name)
            </Text>
            <HStack gap={3} align="stretch">
              <Input
                flex={1}
                size="md"
                placeholder="Type skill name"
                value={otherSkillValue}
                onChange={(e) => setOtherSkillValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOtherSkill()}
                bg="white"
                {...inputBorderStyles}
                _dark={{ borderColor: 'gray.500', bg: 'gray.800' }}
              />
              <Button
                size="md"
                colorScheme="blue"
                borderRadius="lg"
                px={5}
                onClick={handleAddOtherSkill}
                disabled={!otherSkillValue.trim() || selectedSkills.length >= maxSkills}
              >
                Add
              </Button>
            </HStack>
          </Box>

          {/* Skills Limit Info - fixed at bottom */}
          <Box flexShrink={0} p={3} borderTop="1px" borderColor={borderColor} bg={hoverBg}>
            <Text fontSize="sm" textAlign="center" color="gray.600">
              {selectedSkills.length}/{maxSkills} skills selected
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
