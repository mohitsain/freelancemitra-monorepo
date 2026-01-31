"use client"
import { Box, Container, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'
import OnboardingFlow from '@/components/onboarding/onboarding-flow';

const OnboardingPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    
    return (
        <Container maxW="container.xl" py={8}>
            <Box style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
                gap: "2rem"
            }}>
                <OnboardingFlow />
            </Box>
        </Container>
    )
}

export default OnboardingPage
