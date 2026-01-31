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
  FaPlug, 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaShare,
  FaKey,
  FaCode,
  FaServer,
  FaDatabase,
  FaCloud,
  FaShieldAlt
} from 'react-icons/fa';

export default function IntegrationsPage() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const integrations = [
    {
      id: 1,
      name: "API Keys",
      type: "Authentication",
      icon: FaKey,
      status: "Active",
      statusColor: "green",
      description: "Manage your API keys for external services"
    },
    {
      id: 2,
      name: "Webhooks",
      type: "Communication",
      icon: FaCode,
      status: "Active",
      statusColor: "green",
      description: "Configure webhooks for real-time updates"
    },
    {
      id: 3,
      name: "Third-party Apps",
      type: "Integration",
      icon: FaServer,
      status: "Available",
      statusColor: "blue",
      description: "Connect with popular third-party applications"
    },
    {
      id: 4,
      name: "Database Sync",
      type: "Data",
      icon: FaDatabase,
      status: "Available",
      statusColor: "blue",
      description: "Synchronize data with external databases"
    }
  ];

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={4}>
            <Icon as={FaPlug} color={accentBlue} fontSize="2xl" />
            <Heading size="lg" color={textPrimary}>Integrations</Heading>
          </HStack>
          <Text color={textSecondary} fontSize="lg">
            Connect and integrate with external services and APIs
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaPlus} color={accentBlue} fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>New Integration</Text>
              <Button colorScheme="blue" size="sm" w="full">Add New</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaKey} color="green.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>API Keys</Text>
              <Button colorScheme="green" size="sm" w="full">Manage</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaCode} color="purple.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Webhooks</Text>
              <Button colorScheme="purple" size="sm" w="full">Configure</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaServer} color="orange.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Apps</Text>
              <Button colorScheme="orange" size="sm" w="full">Browse</Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Integrations List */}
        <Box>
          <Heading size="md" color={textPrimary} mb={6}>Available Integrations</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {integrations.map((integration) => (
              <Box key={integration.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
                <VStack gap={4} align="stretch">
                  <HStack gap={3}>
                    <Icon as={integration.icon} color={accentBlue} fontSize="2xl" />
                    <VStack gap={1} align="start" flex={1}>
                      <Text fontWeight="bold" color={textPrimary} fontSize="lg">{integration.name}</Text>
                      <Text color={textSecondary} fontSize="sm">{integration.type}</Text>
                    </VStack>
                    <Badge colorScheme={integration.statusColor} variant="subtle">
                      {integration.status}
                    </Badge>
                  </HStack>
                  
                  <Text color={textSecondary} fontSize="sm">{integration.description}</Text>
                  
                  <HStack gap={2}>
                    {integration.status === "Active" ? (
                      <>
                        <Button size="sm" variant="outline"><Icon as={FaEye} mr={2} />View</Button>
                        <Button size="sm" variant="outline"><Icon as={FaEdit} mr={2} />Settings</Button>
                        <Button size="sm" variant="outline" colorScheme="red"><Icon as={FaTrash} mr={2} />Disable</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" colorScheme="blue"><Icon as={FaPlus} mr={2} />Enable</Button>
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
