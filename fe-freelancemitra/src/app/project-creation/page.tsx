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
  FaBriefcase, 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaShare,
  FaCalendar,
  FaUsers,
  FaCheckCircle
} from 'react-icons/fa';

export default function ProjectCreationPage() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const activeProjects = [
    {
      id: 1,
      title: "E-commerce Website",
      client: "TechCorp Inc.",
      status: "In Progress",
      statusColor: "blue",
      progress: 65,
      deadline: "2024-02-15"
    },
    {
      id: 2,
      title: "Mobile App Redesign",
      client: "StartupXYZ",
      status: "Planning",
      statusColor: "yellow",
      progress: 25,
      deadline: "2024-03-01"
    }
  ];

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={4}>
            <Icon as={FaBriefcase} color={accentBlue} fontSize="2xl" />
            <Heading size="lg" color={textPrimary}>Project Creation</Heading>
          </HStack>
          <Text color={textSecondary} fontSize="lg">
            Manage and create projects with professional templates and tools
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaPlus} color={accentBlue} fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>New Project</Text>
              <Button colorScheme="blue" size="sm" w="full">Create</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaEdit} color="green.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Edit Project</Text>
              <Button colorScheme="green" size="sm" w="full">Edit</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaEye} color="purple.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>View Projects</Text>
              <Button colorScheme="purple" size="sm" w="full">View</Button>
            </VStack>
          </Box>

          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={4} textAlign="center">
              <Icon as={FaCalendar} color="orange.500" fontSize="3xl" />
              <Text fontWeight="bold" color={textPrimary}>Timeline</Text>
              <Button colorScheme="orange" size="sm" w="full">View</Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Active Projects */}
        <Box>
          <Heading size="md" color={textPrimary} mb={6}>Active Projects</Heading>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap={6}>
            {activeProjects.map((project) => (
              <Box key={project.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between" align="start">
                    <VStack gap={2} align="start" flex={1}>
                      <Text fontWeight="bold" color={textPrimary} fontSize="lg">{project.title}</Text>
                      <Text color={textSecondary} fontSize="sm">Client: {project.client}</Text>
                      <HStack gap={4}>
                        <HStack gap={1}>
                          <Icon as={FaCalendar} color={textSecondary} />
                          <Text color={textSecondary} fontSize="sm">Due: {project.deadline}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                    
                    <VStack gap={2} align="end">
                      <Badge colorScheme={project.statusColor} variant="subtle">
                        {project.status}
                      </Badge>
                      <Text color={textSecondary} fontSize="sm">{project.progress}%</Text>
                    </VStack>
                  </HStack>
                  
                  <Box w="100%" bg="gray.200" borderRadius="full" h="8px">
                    <Box 
                      w={`${project.progress}%`} 
                      bg="blue.500" 
                      borderRadius="full" 
                      h="100%"
                      transition="width 0.3s ease"
                    />
                  </Box>
                  
                  <HStack gap={2}>
                    <Button size="sm" variant="outline"><Icon as={FaEdit} mr={2} />Edit</Button>
                    <Button size="sm" variant="outline"><Icon as={FaEye} mr={2} />View</Button>
                    <Button size="sm" variant="outline"><Icon as={FaShare} mr={2} />Share</Button>
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
