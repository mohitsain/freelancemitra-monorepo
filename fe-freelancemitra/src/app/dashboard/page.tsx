"use client"
import { Box, Container, Heading, Text, Button, HStack, Badge, Stack } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link';
import { useColorModeValue } from '@/components/ui/color-mode';
import { signOut, useSession } from 'next-auth/react';

const DashboardPage = () => {
    const { data: session } = useSession();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };
    
    return (
        <Container maxW="container.xl" py={8}>
            <Stack direction="column" gap={8} align="stretch">
                {/* Welcome Header */}
                <Box textAlign="center">
                    <HStack justify="space-between" mb={4}>
                        <Box flex={1} />
                        <Heading size="lg">Welcome to Your Dashboard!</Heading>
                        <Button
                            variant="outline"
                            colorScheme="red"
                            size="sm"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>
                    </HStack>
                    <Text color="gray.600" fontSize="lg">
                        Your profile has been successfully created and is now visible to potential clients.
                    </Text>
                </Box>

                {/* Profile Status */}
                <Box
                    bg={cardBg}
                    p={6}
                    rounded="xl"
                    shadow="lg"
                    border="1px"
                    borderColor={borderColor}
                >
                    <Stack direction="column" gap={4} align="stretch">
                        <HStack justify="space-between">
                            <Heading size="md">Profile Status</Heading>
                            <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                                Active
                            </Badge>
                        </HStack>
                        
                        <HStack gap={8}>
                            <Stack direction="column" align="start" gap={2}>
                                <Text fontWeight="medium">Profile Completion</Text>
                                <Text color="green.500" fontSize="2xl" fontWeight="bold">100%</Text>
                            </Stack>
                            
                            <Stack direction="column" align="start" gap={2}>
                                <Text fontWeight="medium">Profile Views</Text>
                                <Text color="blue.500" fontSize="2xl" fontWeight="bold">0</Text>
                            </Stack>
                            
                            <Stack direction="column" align="start" gap={2}>
                                <Text fontWeight="medium">Client Inquiries</Text>
                                <Text color="purple.500" fontSize="2xl" fontWeight="bold">0</Text>
                            </Stack>
                        </HStack>
                    </Stack>
                </Box>

                {/* Quick Actions */}
                <Box
                    bg={cardBg}
                    p={6}
                    rounded="xl"
                    shadow="lg"
                    border="1px"
                    borderColor={borderColor}
                >
                    <Stack direction="column" gap={4} align="stretch">
                        <Heading size="md">Quick Actions</Heading>
                        
                        <HStack gap={4} wrap="wrap">
                            <Button
                                colorScheme="blue"
                                variant="outline"
                                size="lg"
                            >
                                Edit Profile
                            </Button>
                            
                            <Button
                                colorScheme="green"
                                variant="outline"
                                size="lg"
                            >
                                View Public Profile
                            </Button>
                            
                            <Button
                                colorScheme="purple"
                                variant="outline"
                                size="lg"
                            >
                                Browse Projects
                            </Button>
                        </HStack>
                    </Stack>
                </Box>

                {/* Next Steps */}
                <Box
                    bg="blue.50"
                    p={6}
                    rounded="xl"
                    border="1px"
                    borderColor="blue.200"
                    _dark={{ bg: 'blue.900', borderColor: 'blue.700' }}
                >
                    <Stack direction="column" gap={4} align="stretch">
                        <Heading size="md" color="blue.800" _dark={{ color: 'blue.200' }}>
                            🚀 Next Steps to Get Started
                        </Heading>
                        
                        <Stack direction="column" gap={3} align="stretch" color="blue.700" _dark={{ color: 'blue.300' }}>
                            <Text>• Complete any remaining profile sections for better visibility</Text>
                            <Text>• Upload portfolio samples and case studies</Text>
                            <Text>• Set up your availability calendar</Text>
                            <Text>• Browse available projects and start bidding</Text>
                            <Text>• Connect with other freelancers in the community</Text>
                        </Stack>
                    </Stack>
                </Box>

                {/* Back to Home */}
                <Box textAlign="center">
                    <Link href="/">
                        <Button variant="ghost" colorScheme="blue">
                            ← Back to Home
                        </Button>
                    </Link>
                </Box>
            </Stack>
        </Container>
    )
}

export default DashboardPage
