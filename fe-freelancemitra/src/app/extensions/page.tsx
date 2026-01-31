"use client";

import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading, 
  Button, 
  Icon, 
  SimpleGrid, 
  Badge
} from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
import { 
  FaTools, 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaShare,
  FaLinkedin,
  FaBriefcase,
  FaBehance,
  FaGithub,
  FaDribbble,
  FaInstagram
} from 'react-icons/fa';

export default function ExtensionsPage() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const extensions = [
    {
      id: 1,
      name: "LinkedIn Integration",
      platform: "LinkedIn",
      icon: FaLinkedin,
      status: "Connected",
      statusColor: "green",
      description: "Sync your LinkedIn profile and connections"
    },
    {
      id: 2,
      name: "Upwork Integration",
      platform: "Upwork",
      icon: FaBriefcase,
      status: "Connected",
      statusColor: "green",
      description: "Import projects and client data from Upwork"
    },
    {
      id: 3,
      name: "Behance Integration",
      platform: "Behance",
      icon: FaBehance,
      status: "Available",
      statusColor: "blue",
      description: "Showcase your Behance portfolio"
    },
    {
      id: 4,
      name: "GitHub Integration",
      platform: "GitHub",
      icon: FaGithub,
      status: "Available",
      statusColor: "blue",
      description: "Display your GitHub repositories"
    }
  ];

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={4}>
            <Icon as={FaTools} color={accentBlue} fontSize="2xl" />
            <Heading size="lg" color={textPrimary}>Extensions</Heading>
          </HStack>
          <Text color={textSecondary} fontSize="lg">
            Connect and integrate with external platforms and tools
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaPlus} color={accentBlue} fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Add Extension</Text>
              <Button colorScheme="blue" size="sm" w="full">Add New</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaEdit} color="green.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Manage</Text>
              <Button colorScheme="green" size="sm" w="full">Manage</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaEye} color="purple.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>View All</Text>
              <Button colorScheme="purple" size="sm" w="full">View</Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Extensions List */}
        <Box>
          <Heading size="md" color={textPrimary} mb={6}>Available Extensions</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {extensions.map((extension) => (
              <Box key={extension.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
                <VStack gap={4} align="stretch">
                  <HStack gap={3}>
                    <Icon as={extension.icon} color={accentBlue} fontSize="2xl" />
                    <VStack gap={1} align="start" flex={1}>
                      <Text fontWeight="bold" color={textPrimary} fontSize="lg">{extension.name}</Text>
                      <Text color={textSecondary} fontSize="sm">{extension.platform}</Text>
                    </VStack>
                    <Badge colorScheme={extension.statusColor} variant="subtle">
                      {extension.status}
                    </Badge>
                  </HStack>
                  
                  <Text color={textSecondary} fontSize="sm">{extension.description}</Text>
                  
                  <HStack gap={2}>
                    {extension.status === "Connected" ? (
                      <>
                        <Button size="sm" variant="outline"><Icon as={FaEye} mr={2} />View</Button>
                        <Button size="sm" variant="outline"><Icon as={FaEdit} mr={2} />Settings</Button>
                        <Button size="sm" variant="outline" colorScheme="red"><Icon as={FaTrash} mr={2} />Disconnect</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" colorScheme="blue"><Icon as={FaPlus} mr={2} />Connect</Button>
                        <Button size="sm" variant="outline"><Icon as={FaEye} mr={2} />Learn More</Button>
                      </>
                    )}
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
      </Box>
    </DashboardLayout>
  );
}
