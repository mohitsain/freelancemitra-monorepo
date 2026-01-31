"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { getCountriesFromBackend, type CountryItem } from "@/lib/locations-api";
import { dropdownSearchInputStyles, dropdownSearchWrapperStyles } from "@/lib/onboarding-form-styles";

const DROPDOWN_OPTION_FONT = "sm";

interface PhoneCodeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
}

export default function PhoneCodeDropdown({
  value,
  onChange,
  placeholder = "Code",
  size = "lg",
}: PhoneCodeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    let cancelled = false;
    getCountriesFromBackend()
      .then((list) => {
        if (!cancelled) {
          setCountries(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = countries.filter(
    (c) =>
      (c.phone_code && c.phone_code.includes(searchTerm)) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayLabel = (c: CountryItem) => {
    const dial = (c.phone_code || "").trim();
    const prefix = dial ? (dial.startsWith("+") ? dial : `+${dial}`) : "";
    return prefix ? `${c.code} (${prefix})` : `${c.code}`;
  };

  const handleSelect = (code: string) => {
    onChange(code || "");
    setIsOpen(false);
    setSearchTerm("");
  };

  const findCountry = (v: string) =>
    countries.find((c) => (c.phone_code || c.code || "") === v) ??
    countries.find((c) => c.name.toLowerCase() === (v || "").toLowerCase());

  const displayValue =
    value === ""
      ? placeholder
      : (() => {
          const c = findCountry(value);
          return c ? displayLabel(c) : value;
        })();

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
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
        _hover={{ borderColor: "gray.400" }}
        _dark={{ borderColor: "gray.500", bg: "gray.700", _focus: { borderColor: "blue.400" } }}
      >
        <Text
          color={value ? "inherit" : "gray.500"}
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
          {isOpen ? "▲" : "▼"}
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
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              {...dropdownSearchInputStyles}
            />
          </Box>
          <Box maxH="220px" overflowY="auto">
            {loading ? (
              <Box p={4} textAlign="center">
                <Text fontSize={DROPDOWN_OPTION_FONT} color="gray.500">
                  Loading…
                </Text>
              </Box>
            ) : filtered.length === 0 ? (
              <Box p={4} textAlign="center">
                <Text fontSize={DROPDOWN_OPTION_FONT} color="gray.500">
                  No countries loaded. Ensure backend is running and countries are seeded.
                </Text>
              </Box>
            ) : (
              <Stack gap={0}>
                {filtered.map((c) => {
                  const code = c.phone_code || c.code || "";
                  return (
                    <Box
                      key={c.code}
                      px={4}
                      py={2}
                      cursor="pointer"
                      onClick={() => handleSelect(code)}
                      borderBottom="1px"
                      borderColor={borderColor}
                      _last={{ borderBottom: "none" }}
                      _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                    >
                      <Text fontWeight="medium" fontSize={DROPDOWN_OPTION_FONT}>
                        {displayLabel(c)}
                      </Text>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
