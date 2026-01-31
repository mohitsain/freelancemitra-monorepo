"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { 
  FaBriefcase, 
  FaChartLine, 
  FaFileAlt, 
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { useColorMode } from '@/components/ui/color-mode';

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  // Single loader only: one spinner while session is loading
  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} />
          <Text color="gray.500" fontSize="sm">Loading…</Text>
        </Box>
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return null; // redirect in progress
  }

  // Authenticated: show dashboard immediately (no second loader, no null flash)
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}



// Dashboard Content Component
function DashboardContent() {
  const { colorMode } = useColorMode();
  const { data: session } = useSession();
  const cardBg = colorMode === 'dark' ? 'gray.800' : 'white';
  const borderColor = colorMode === 'dark' ? 'gray.700' : 'gray.200';
  const textPrimary = colorMode === 'dark' ? 'white' : 'gray.800';
  const textSecondary = colorMode === 'dark' ? 'gray.300' : 'gray.600';
  const textTertiary = colorMode === 'dark' ? 'gray.400' : 'gray.500';
  const accentBlue = 'blue.500';
  const accentGreen = 'green.500';



  return (
    <Container maxW="7xl" p={0}>
      {/* Get Started Section */}
      <Box mb={8}>
        <Text fontSize="xl" fontWeight="bold" color={textPrimary} mb={4}>
          Get Started
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
          {/* Create Portfolio Card */}
          <Box
            bg="blue.50"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="blue.200"
            cursor="pointer"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            <VStack align="center" gap={3}>
              <Box
                w="48px"
                h="48px"
                bg="blue.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaBriefcase} color="white" fontSize="20px" />
              </Box>
              <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                Create Portfolio
              </Text>
            </VStack>
          </Box>

          {/* Find Leads Card */}
          <Box
            bg="green.50"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="green.200"
            cursor="pointer"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            <VStack align="center" gap={3}>
              <Box
                w="48px"
                h="48px"
                bg="green.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaChartLine} color="white" fontSize="20px" />
              </Box>
              <Text fontSize="sm" fontWeight="semibold" color="green.700">
                Find Leads
              </Text>
            </VStack>
          </Box>

          {/* Build Proposal Card */}
          <Box
            bg="purple.50"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="purple.200"
            cursor="pointer"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            <VStack align="center" gap={3}>
              <Box
                w="48px"
                h="48px"
                bg="purple.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaFileAlt} color="white" fontSize="20px" />
              </Box>
              <Text fontSize="sm" fontWeight="semibold" color="purple.700">
                Build Proposal
              </Text>
            </VStack>
          </Box>

          {/* Generate Invoice Card */}
          <Box
            bg="yellow.50"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="yellow.200"
            cursor="pointer"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            <VStack align="center" gap={3}>
              <Box
                w="48px"
                h="48px"
                bg="yellow.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaFileInvoiceDollar} color="white" fontSize="20px" />
              </Box>
              <Text fontSize="sm" fontWeight="semibold" color="yellow.700">
                Generate Invoice
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Analytics Overview and My Progress Section */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={8}>
        {/* Analytics Overview */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <VStack align="start" gap={4}>
            <HStack justify="space-between" w="100%">
              <Text fontSize="xl" fontWeight="bold" color={textPrimary}>
                Analytics Overview
              </Text>
              <HStack gap={2}>
                <Box
                  px={4}
                  py={2}
                  bg="gray.100"
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: "gray.200" }}
                >
                  <Text fontSize="sm" color="gray.600">Month</Text>
                </Box>
                <Box
                  px={4}
                  py={2}
                  bg="blue.500"
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: "blue.600" }}
                >
                  <Text fontSize="sm" color="white">Year</Text>
                </Box>
              </HStack>
            </HStack>
            
            {/* Chart Placeholder */}
            <Box
              w="100%"
              h="200px"
              bg="white"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap={2}
            >
              <Icon as={FaChartLine} color="blue.500" fontSize="32px" />
              <Text color="gray.500" fontSize="sm">Revenue Chart</Text>
              <Text color="gray.400" fontSize="xs" textAlign="center">
                Jan 2024: Behance ($7,200), Gumroad ($8,234),<br />
                Dribbble ($4,136), Patreon ($2,022)
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* My Progress */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <VStack align="start" gap={4}>
            <HStack justify="space-between" w="100%">
              <Text fontSize="xl" fontWeight="bold" color={textPrimary}>
                My Progress
              </Text>
              <Text color="blue.500" fontSize="sm" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                View All
              </Text>
            </HStack>
            
            <VStack align="start" gap={4} w="100%">
              {/* Proposals Sent */}
              <Box w="100%">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color={textSecondary}>Proposals Sent</Text>
                  <Text fontSize="sm" fontWeight="semibold" color="blue.500">25 / 50</Text>
                </HStack>
                <Box w="100%" bg="gray.200" borderRadius="full" h="8px">
                  <Box w="50%" bg="blue.500" h="8px" borderRadius="full" />
                </Box>
              </Box>

              {/* Clients Onboarded */}
              <Box w="100%">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color={textSecondary}>Clients Onboarded</Text>
                  <Text fontSize="sm" fontWeight="semibold" color="green.500">5 / 10</Text>
                </HStack>
                <Box w="100%" bg="gray.200" borderRadius="full" h="8px">
                  <Box w="50%" bg="green.500" h="8px" borderRadius="full" />
                </Box>
              </Box>

              {/* Profile Completion */}
              <Box w="100%">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color={textSecondary}>Profile Completion</Text>
                  <Text fontSize="sm" fontWeight="semibold" color="purple.500">85%</Text>
                </HStack>
                <Box w="100%" bg="gray.200" borderRadius="full" h="8px">
                  <Box w="85%" bg="purple.500" h="8px" borderRadius="full" />
                </Box>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Active Leads Section */}
      <Box
        bg={cardBg}
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <VStack align="start" gap={4}>
          <Text fontSize="xl" fontWeight="bold" color={textPrimary}>
            Active Leads
          </Text>
          {/* Content placeholder - currently empty as shown in the image */}
          <Box
            w="100%"
            h="100px"
            bg="gray.50"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.400" fontSize="sm">No active leads at the moment</Text>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
}
