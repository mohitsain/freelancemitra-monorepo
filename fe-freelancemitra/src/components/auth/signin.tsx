import React, { useState } from 'react';
import {
  Box,
  VStack,
  Button,
  Text,
  Heading,
  Container,
  Flex,
  Spinner
} from '@chakra-ui/react';

import { FaGoogle } from "react-icons/fa";
import { signIn } from 'next-auth/react';
import { toastError } from '../ui/toaster';
import { useColorModeValue } from '../ui/color-mode';

export default function SignInCard() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/onboarding' });
    } catch (error) {
      console.error('Google sign in error:', error);
      toastError('Sign in failed', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Flex justify="center" align="center" minH="60vh">
        <Box
          bg={cardBg}
          p={8}
          rounded="xl"
          shadow="2xl"
        //   border="1px"
        //   borderColor={borderColor}
          backgroundColor={"transparent"}
          boxShadow={"none"}
          w="full"
          maxW="400px"
        >
          <VStack gap={6}>
            {/* Header */}
            <VStack gap={2}>
              <Heading size="lg" textAlign="center">
                Welcome back
              </Heading>
              <Text color="gray.500" textAlign="center">
                Sign in to your account
              </Text>
            </VStack>

            {/* Sign-in buttons */}
            <VStack gap={4} w="full">
              <Button
                w="full"
                size="lg"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                _hover={{
                  bg: 'red.50',
                  borderColor: 'red.300',
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                  color:"gray.950"
                }}
                transition="all 0.2s"
                borderColor="gray.300"
              >
                {isLoading ? (
                  <Spinner size="sm" mr={2} />
                ) : (
                  <FaGoogle />
                )}
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>
            </VStack>

            {/* Footer text */}
            <Text fontSize="sm" color="gray.500" textAlign="center" pt={4}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}