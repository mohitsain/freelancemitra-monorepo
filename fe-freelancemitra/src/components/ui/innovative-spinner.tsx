'use client';

import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';

interface InnovativeSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  subtitle?: string;
  showProgressBar?: boolean;
}

export default function InnovativeSpinner({ 
  size = 'lg', 
  title = "Loading...", 
  subtitle = "Please wait...",
  showProgressBar = true 
}: InnovativeSpinnerProps) {
  const sizeMap = {
    sm: { container: '60px', border: '3px', dot: '8px', progress: '150px', progressHeight: '3px' },
    md: { container: '70px', border: '3px', dot: '10px', progress: '180px', progressHeight: '3px' },
    lg: { container: '80px', border: '4px', dot: '12px', progress: '200px', progressHeight: '4px' }
  };

  const { container, border, dot, progress, progressHeight } = sizeMap[size];

  return (
    <Box display="flex" alignItems="center" justifyContent="center" py={20}>
      <VStack gap={6} textAlign="center">
        {/* Animated Spinner */}
        <Box position="relative" w={container} h={container}>
          {/* Outer Ring */}
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            border={`${border} solid`}
            borderColor="blue.100"
            borderRadius="full"
            animation="pulse 2s infinite"
          />
          
          {/* Inner Spinning Ring */}
          <Box
            position="absolute"
            top={border}
            left={border}
            w={`calc(100% - ${parseInt(border) * 2}px)`}
            h={`calc(100% - ${parseInt(border) * 2}px)`}
            border={`${border} solid`}
            borderColor="blue.400"
            borderRadius="full"
            borderTopColor="transparent"
            animation="spin 1s linear infinite"
          />
          
          {/* Center Dot */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w={dot}
            h={dot}
            bg="blue.500"
            borderRadius="full"
            animation="bounce 1.5s infinite"
          />
          
          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              position="absolute"
              top="50%"
              left="50%"
              w="4px"
              h="4px"
              bg="blue.400"
              borderRadius="full"
              transform={`translate(-50%, -50%) rotate(${i * 60}deg) translateY(-40px)`}
              animation={`float 2s ease-in-out infinite ${i * 0.2}s`}
            />
          ))}
        </Box>
        
        {/* Loading Text */}
        <VStack gap={2}>
          <Text fontSize="xl" fontWeight="bold" color="blue.600">
            {title}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {subtitle}
          </Text>
        </VStack>
        
        {/* Progress Bar */}
        {showProgressBar && (
          <Box w={progress} bg="gray.100" borderRadius="full" overflow="hidden">
            <Box
              h={progressHeight}
              bg="linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)"
              borderRadius="full"
              animation="progress 3s ease-in-out infinite"
              transformOrigin="left"
            />
          </Box>
        )}
      </VStack>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
          40% { transform: translate(-50%, -50%) translateY(-10px); }
          60% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        
        @keyframes float {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-40px) scale(0.8); }
          50% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-50px) scale(1.2); }
        }
        
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </Box>
  );
}
