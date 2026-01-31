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
  Badge,
  Progress
} from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
import { 
  FaFileAlt, 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaDownload, 
  FaShare,
  FaStar,
  FaUsers,
  FaEye as FaViews,
  FaRocket,
  FaChartLine,
  FaCopy
} from 'react-icons/fa';

export default function ProposalBuildingPage() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const proposalTemplates = [
    {
      id: 1,
      name: "Web Development",
      category: "Development",
      rating: 4.8,
      views: 1240,
      downloads: 89,
      image: "💻",
      description: "Professional web development proposal template"
    },
    {
      id: 2,
      name: "Design Services",
      category: "Design",
      rating: 4.9,
      views: 2156,
      downloads: 156,
      image: "🎨",
      description: "Creative design services proposal template"
    },
    {
      id: 3,
      name: "Marketing Campaign",
      category: "Marketing",
      rating: 4.7,
      views: 987,
      downloads: 67,
      image: "📈",
      description: "Digital marketing campaign proposal template"
    },
    {
      id: 4,
      name: "Consulting",
      category: "Consulting",
      rating: 4.6,
      views: 756,
      downloads: 43,
      image: "💼",
      description: "Business consulting proposal template"
    }
  ];

  const recentProposals = [
    {
      id: 1,
      title: "E-commerce Website Redesign",
      client: "TechCorp Inc.",
      status: "Sent",
      statusColor: "blue",
      value: "$8,500",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "Brand Identity Package",
      client: "StartupXYZ",
      status: "Draft",
      statusColor: "yellow",
      value: "$3,200",
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      title: "SEO Optimization",
      client: "Local Business",
      status: "Accepted",
      statusColor: "green",
      value: "$2,800",
      lastUpdated: "3 days ago"
    }
  ];

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={4}>
            <Icon as={FaFileAlt} color={accentBlue} fontSize="2xl" />
            <Heading size="lg" color={textPrimary}>Proposal Building</Heading>
          </HStack>
          <Text color={textSecondary} fontSize="lg">
            Create compelling proposals that win clients and projects
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaPlus} color={accentBlue} fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>New Proposal</Text>
              <Text fontSize="sm" color={textSecondary}>Start from scratch</Text>
              <Button colorScheme="blue" size="sm" w="full">Create</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaRocket} color="green.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>AI Generator</Text>
              <Text fontSize="sm" color={textSecondary}>AI-powered proposals</Text>
              <Button colorScheme="green" size="sm" w="full">Generate</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaCopy} color="purple.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Templates</Text>
              <Text fontSize="sm" color={textSecondary}>Use existing templates</Text>
              <Button colorScheme="purple" size="sm" w="full">Browse</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaChartLine} color="orange.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Analytics</Text>
              <Text fontSize="sm" color={textSecondary}>Track performance</Text>
              <Button colorScheme="orange" size="sm" w="full">View</Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Recent Proposals */}
        <Box>
          <Heading size="md" color={textPrimary} mb={6}>Recent Proposals</Heading>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap={6}>
            {recentProposals.map((proposal) => (
              <Box key={proposal.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between" align="start">
                    <VStack gap={2} align="start" flex={1}>
                      <Text fontWeight="bold" color={textPrimary} fontSize="lg">{proposal.title}</Text>
                      <Text color={textSecondary} fontSize="sm">Client: {proposal.client}</Text>
                      <Text color={textSecondary} fontSize="sm">Value: {proposal.value}</Text>
                      <Text color={textSecondary} fontSize="sm">Updated: {proposal.lastUpdated}</Text>
                    </VStack>
                    
                    <VStack gap={2} align="end">
                      <Badge colorScheme={proposal.statusColor} variant="subtle">
                        {proposal.status}
                      </Badge>
                      <HStack gap={2}>
                        <Button size="sm" variant="outline"><Icon as={FaEdit} mr={2} />Edit</Button>
                        <Button size="sm" variant="outline"><Icon as={FaEye} mr={2} />View</Button>
                        <Button size="sm" variant="outline"><Icon as={FaShare} mr={2} />Share</Button>
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Templates Section */}
        <Box>
          <Heading size="md" color={textPrimary} mb={6}>Proposal Templates</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {proposalTemplates.map((template) => (
              <Box key={template.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6} _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }} transition="all 0.2s">
                <VStack gap={3} align="stretch">
                  <VStack gap={2}>
                    <Text fontSize="4xl">{template.image}</Text>
                    <Badge colorScheme="blue" variant="subtle">{template.category}</Badge>
                  </VStack>
                  
                  <Text fontWeight="bold" color={textPrimary} fontSize="lg">{template.name}</Text>
                  <Text fontSize="sm" color={textSecondary} textAlign="center">{template.description}</Text>
                  
                  <HStack justify="space-between" fontSize="sm">
                    <HStack gap={1}>
                      <Icon as={FaStar} color="yellow.400" />
                      <Text color={textSecondary}>{template.rating}</Text>
                    </HStack>
                    <HStack gap={1}>
                      <Icon as={FaViews} color={textSecondary} />
                      <Text color={textSecondary}>{template.views}</Text>
                    </HStack>
                  </HStack>
                  
                  <HStack gap={2}>
                    <Button size="sm" colorScheme="blue" flex={1}>Use Template</Button>
                    <Button size="sm" variant="outline" flex={1}>Preview</Button>
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
