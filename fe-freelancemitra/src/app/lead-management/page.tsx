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
  FaUserTie, 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaShare,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle
} from 'react-icons/fa';

export default function LeadManagementPage() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const leads = [
    {
      id: 1,
      name: "John Smith",
      company: "TechCorp Inc.",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "Hot Lead",
      statusColor: "red",
      value: "$15,000",
      source: "Website",
      lastContact: "2 days ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      company: "StartupXYZ",
      email: "sarah@startupxyz.com",
      phone: "+1 (555) 987-6543",
      status: "Qualified",
      statusColor: "blue",
      value: "$8,500",
      source: "LinkedIn",
      lastContact: "1 week ago"
    },
    {
      id: 3,
      name: "Mike Wilson",
      company: "Local Business",
      email: "mike@localbiz.com",
      phone: "+1 (555) 456-7890",
      status: "Cold Lead",
      statusColor: "gray",
      value: "$3,200",
      source: "Referral",
      lastContact: "2 weeks ago"
    }
  ];

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={4}>
            <Icon as={FaUserTie} color={accentBlue} fontSize="2xl" />
            <Heading size="lg" color={textPrimary}>Lead Management</Heading>
          </HStack>
          <Text color={textSecondary} fontSize="lg">
            Track and manage your leads to convert them into clients
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaPlus} color={accentBlue} fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Add Lead</Text>
              <Button colorScheme="blue" size="sm" w="full">Add New</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaEdit} color="green.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Edit Lead</Text>
              <Button colorScheme="green" size="sm" w="full">Edit</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaPhone} color="purple.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Call Lead</Text>
              <Button colorScheme="purple" size="sm" w="full">Call</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaEnvelope} color="orange.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Email Lead</Text>
              <Button colorScheme="orange" size="sm" w="full">Email</Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Leads List */}
        <Box>
          <Heading size="md" color={textPrimary} mb={6}>Your Leads</Heading>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap={6}>
            {leads.map((lead) => (
              <Box key={lead.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between" align="start">
                    <VStack gap={2} align="start" flex={1}>
                      <HStack gap={3}>
                        <Text fontWeight="bold" color={textPrimary} fontSize="lg">{lead.name}</Text>
                        <Badge colorScheme={lead.statusColor} variant="subtle">
                          {lead.status}
                        </Badge>
                      </HStack>
                      <Text color={textSecondary} fontSize="sm">Company: {lead.company}</Text>
                      <HStack gap={4} flexWrap="wrap">
                        <HStack gap={1}>
                          <Icon as={FaEnvelope} color={textSecondary} />
                          <Text color={textSecondary} fontSize="sm">{lead.email}</Text>
                        </HStack>
                        <HStack gap={1}>
                          <Icon as={FaPhone} color={textSecondary} />
                          <Text color={textSecondary} fontSize="sm">{lead.phone}</Text>
                        </HStack>
                      </HStack>
                      <HStack gap={4}>
                        <Text color={textSecondary} fontSize="sm">Value: {lead.value}</Text>
                        <Text color={textSecondary} fontSize="sm">Source: {lead.source}</Text>
                        <Text color={textSecondary} fontSize="sm">Last Contact: {lead.lastContact}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  
                  <HStack gap={2}>
                    <Button size="sm" variant="outline"><Icon as={FaEdit} mr={2} />Edit</Button>
                    <Button size="sm" variant="outline"><Icon as={FaEye} mr={2} />View</Button>
                    <Button size="sm" variant="outline"><Icon as={FaPhone} mr={2} />Call</Button>
                    <Button size="sm" variant="outline"><Icon as={FaEnvelope} mr={2} />Email</Button>
                    <Button size="sm" variant="outline" colorScheme="red"><Icon as={FaTrash} mr={2} />Delete</Button>
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
