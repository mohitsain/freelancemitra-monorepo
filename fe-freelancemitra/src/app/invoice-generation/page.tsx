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
  FaFileInvoiceDollar, 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaDownload, 
  FaShare,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';

export default function InvoiceGenerationPage() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const invoices = [
    {
      id: 1,
      number: "INV-001",
      client: "TechCorp Inc.",
      amount: "$8,500",
      status: "Paid",
      statusColor: "green",
      dueDate: "2024-01-15",
      issueDate: "2024-01-01"
    },
    {
      id: 2,
      number: "INV-002",
      client: "StartupXYZ",
      amount: "$3,200",
      status: "Pending",
      statusColor: "yellow",
      dueDate: "2024-02-01",
      issueDate: "2024-01-15"
    },
    {
      id: 3,
      number: "INV-003",
      client: "Local Business",
      amount: "$2,800",
      status: "Overdue",
      statusColor: "red",
      dueDate: "2024-01-10",
      issueDate: "2024-01-01"
    }
  ];

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={4}>
            <Icon as={FaFileInvoiceDollar} color={accentBlue} fontSize="2xl" />
            <Heading size="lg" color={textPrimary}>Invoice Generation</Heading>
          </HStack>
          <Text color={textSecondary} fontSize="lg">
            Create and manage professional invoices for your clients
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaPlus} color={accentBlue} fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>New Invoice</Text>
              <Button colorScheme="blue" size="sm" w="full">Create</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaEdit} color="green.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Edit Invoice</Text>
              <Button colorScheme="green" size="sm" w="full">Edit</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaDownload} color="purple.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Download</Text>
              <Button colorScheme="purple" size="sm" w="full">Download</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaShare} color="orange.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Send</Text>
              <Button colorScheme="orange" size="sm" w="full">Send</Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Invoices List */}
        <Box>
          <Heading size="md" color={textPrimary} mb={6}>Your Invoices</Heading>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap={6}>
            {invoices.map((invoice) => (
              <Box key={invoice.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between" align="start">
                    <VStack gap={2} align="start" flex={1}>
                      <HStack gap={3}>
                        <Text fontWeight="bold" color={textPrimary} fontSize="lg">{invoice.number}</Text>
                        <Badge colorScheme={invoice.statusColor} variant="subtle">
                          {invoice.status}
                        </Badge>
                      </HStack>
                      <Text color={textSecondary} fontSize="sm">Client: {invoice.client}</Text>
                      <HStack gap={4}>
                        <Text color={textSecondary} fontSize="sm">Amount: {invoice.amount}</Text>
                        <Text color={textSecondary} fontSize="sm">Issue Date: {invoice.issueDate}</Text>
                        <Text color={textSecondary} fontSize="sm">Due Date: {invoice.dueDate}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  
                  <HStack gap={2}>
                    <Button size="sm" variant="outline"><Icon as={FaEdit} mr={2} />Edit</Button>
                    <Button size="sm" variant="outline"><Icon as={FaEye} mr={2} />View</Button>
                    <Button size="sm" variant="outline"><Icon as={FaDownload} mr={2} />Download</Button>
                    <Button size="sm" variant="outline"><Icon as={FaShare} mr={2} />Send</Button>
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
