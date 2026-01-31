"use client"
import { Box, Text, Container, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'
import Lottie from "lottie-react";
import animationData from "../../../public/animation/signin.json";
import SignInCard from '@/components/auth/signin';

const SignInPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    
  return (
    <Container maxW="container.xl" py={8}>
        <Box style={{
            display:"flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent:"space-between",
            alignItems:"center",
            minHeight:"80vh",
            gap:"2rem"
        }}>
            {/* Animation Section */}
            <Box style={{
                display:"flex",
                flex: isMobile ? "none" : 1,
                justifyContent:"center",
                alignItems:"center",
                order: isMobile ? 2 : 1,
            }}>
                {!isMobile && (
                    <Box maxW="500px" w="full">
                        <Lottie 
                            animationData={animationData} 
                            loop={true} 
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Box>
                )}
            </Box>
            
            {/* Sign In Form Section */}
            <Box style={{
                display:"flex",
                flex: 1,
                justifyContent:"center",
                alignItems:"center",
                order: isMobile ? 1 : 2,
            }}>
                <SignInCard />
            </Box>
        </Box>
    </Container>
  )
}

export default SignInPage