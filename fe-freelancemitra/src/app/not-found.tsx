"use client"
import { Box, Container, Heading, Text, Button, Stack } from '@chakra-ui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxW="container.md" py={20}>
      <Stack direction="column" gap={8} textAlign="center">
        <Heading size="2xl" color="gray.800">
          404 - Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.600">
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/">
          <Button colorScheme="blue" size="lg">
            Go Home
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
