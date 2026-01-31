"use client";
import { 
  Box, 
  Container, 
  Text, 
  VStack, 
  HStack, 
  Heading, 
  Button, 
  SimpleGrid, 
  Icon, 
  Badge,
  useBreakpointValue
} from '@chakra-ui/react';
import React from 'react';
import { 
  FaRocket, 
  FaUserTie, 
  FaFileInvoiceDollar, 
  FaLinkedin, 
  FaBriefcase, 
  FaGraduationCap,
  FaCreditCard,
  FaChartLine,
  FaLightbulb,
  FaTools,
  FaHandshake,
  FaFileAlt,
  FaGlobe,
  FaBrain,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaUsers
} from 'react-icons/fa';

export default function HomeContent() {
  const cardBg = 'white';
  const borderColor = 'gray.200';
  const isMobile = useBreakpointValue({ base: true, md: false });

  const features = [
    {
      icon: FaRocket,
      title: "Portfolio Creation",
      description: "AI-powered portfolio builder with professional templates and optimization",
      color: "blue"
    },
    {
      icon: FaUserTie,
      title: "Lead Generation",
      description: "Smart lead finding and client matching algorithms",
      color: "green"
    },
    {
      icon: FaFileAlt,
      title: "Proposal Building",
      description: "AI proposal generator for winning client projects",
      color: "purple"
    },
    {
      icon: FaHandshake,
      title: "Client Acquisition",
      description: "End-to-end client onboarding and relationship management",
      color: "orange"
    },
    {
      icon: FaFileInvoiceDollar,
      title: "Invoice Generation",
      description: "Automated invoicing and payment tracking system",
      color: "teal"
    },
    {
      icon: FaLinkedin,
      title: "LinkedIn Optimizer",
      description: "AI-powered LinkedIn profile builder and optimizer",
      color: "blue"
    },
    {
      icon: FaBriefcase,
      title: "Upwork Integration",
      description: "Profile creation and proposal generator for Upwork",
      color: "green"
    },
    {
      icon: FaGraduationCap,
      title: "Skill Development",
      description: "Guided learning paths for new freelancers",
      color: "purple"
    }
  ];

  const aiFeatures = [
    {
      title: "Smart Portfolio Builder",
      description: "AI analyzes your skills and creates compelling portfolio content",
      icon: FaBrain
    },
    {
      title: "Intelligent Lead Scoring",
      description: "AI ranks potential clients based on your expertise and preferences",
      icon: FaChartLine
    },
    {
      title: "Proposal Optimization",
      description: "AI suggests improvements to increase your proposal success rate",
      icon: FaLightbulb
    },
    {
      title: "Market Analysis",
      description: "AI provides insights on trending skills and market demands",
      icon: FaGlobe
    }
  ];

  const subscriptionPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      features: ["Basic portfolio builder", "5 proposals/month", "LinkedIn optimizer", "Basic analytics"],
      color: "blue",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      features: ["Advanced portfolio tools", "Unlimited proposals", "AI proposal generator", "Lead generation", "Invoice system"],
      color: "green",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      features: ["Everything in Professional", "Custom integrations", "Priority support", "Advanced analytics", "Team collaboration"],
      color: "purple",
      popular: false
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bg="gradient-to-r from-blue.600 via-purple.600 to-blue.800"
        color="white"
        py={20}
        borderRadius="xl"
        mb={16}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.1)"
          zIndex={1}
        />
        <Container maxW="container.xl" position="relative" zIndex={2}>
          <VStack gap={8} textAlign="center">
            <Heading size="2xl" fontWeight="bold">
              Your AI-Powered Freelancing Journey Starts Here
            </Heading>
            <Text fontSize="xl" maxW="3xl">
              From portfolio creation to client acquisition, our AI tools guide you through every step 
              of your freelancing success. Built for beginners and professionals alike.
            </Text>
            <HStack gap={6} wrap="wrap" justify="center">
              <Button size="lg" colorScheme="white" variant="solid" bg="white" color="blue.600">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" borderColor="white" color="white" _hover={{ bg: "white", color: "blue.600" }}>
                Watch Demo
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Core Features Grid */}
      <Box mb={16}>
        <VStack gap={12}>
          <VStack gap={4} textAlign="center">
            <Heading size="xl">Complete Freelancing Toolkit</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Everything you need to succeed as a freelancer, powered by artificial intelligence
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} w="full">
            {features.map((feature, index) => (
              <Box key={index} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6} _hover={{ transform: "translateY(-4px)", shadow: "xl" }} transition="all 0.3s">
                <VStack gap={4} textAlign="center">
                  <Box
                    p={4}
                    bg={`${feature.color}.100`}
                    borderRadius="full"
                    color={`${feature.color}.600`}
                  >
                    <Icon as={feature.icon} boxSize={8} />
                  </Box>
                  <VStack gap={2}>
                    <Heading size="md">{feature.title}</Heading>
                    <Text fontSize="sm" color="gray.600">{feature.description}</Text>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>

      {/* AI Features Section */}
      <Box mb={16}>
        <VStack gap={12}>
          <VStack gap={4} textAlign="center">
            <Heading size="xl">Powered by Advanced AI</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Our AI technology learns from your preferences and market trends to give you the competitive edge
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} w="full">
            {aiFeatures.map((feature, index) => (
              <Box key={index} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
                <HStack gap={4} align="start">
                  <Box
                    p={3}
                    bg="blue.100"
                    borderRadius="full"
                    color="blue.600"
                  >
                    <Icon as={feature.icon} boxSize={6} />
                  </Box>
                  <VStack gap={2} align="start">
                    <Heading size="md">{feature.title}</Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Subscription Plans */}
      <Box mb={16}>
        <VStack gap={12}>
          <VStack gap={4} textAlign="center">
            <Heading size="xl">Choose Your Plan</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Start with our free tier and upgrade as you grow your freelancing business
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="full">
            {subscriptionPlans.map((plan, index) => (
              <Box 
                key={index} 
                bg={cardBg} 
                border="2px" 
                borderColor={plan.popular ? `${plan.color}.500` : borderColor}
                borderRadius="lg"
                p={6}
                position="relative"
                _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                transition="all 0.3s"
              >
                {plan.popular && (
                  <Badge
                    position="absolute"
                    top={-3}
                    right={4}
                    colorScheme={plan.color}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    Most Popular
                  </Badge>
                )}
                <VStack gap={4} textAlign="center">
                  <Heading size="lg">{plan.name}</Heading>
                  <HStack gap={1}>
                    <Text fontSize="3xl" fontWeight="bold" color={`${plan.color}.500`}>
                      {plan.price}
                    </Text>
                    <Text color="gray.500">{plan.period}</Text>
                  </HStack>
                  
                  <VStack gap={4} align="stretch" w="full">
                    <VStack gap={3} align="start">
                      {plan.features.map((feature, featureIndex) => (
                        <HStack key={featureIndex} gap={3}>
                          <Icon as={FaStar} color={`${plan.color}.500`} />
                          <Text fontSize="sm">{feature}</Text>
                        </HStack>
                      ))}
                    </VStack>
                    <Button
                      colorScheme={plan.color}
                      variant={plan.popular ? "solid" : "outline"}
                      size="lg"
                      w="full"
                    >
                      {plan.popular ? "Get Started" : "Choose Plan"}
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Additional Features */}
      <Box mb={16}>
        <VStack gap={12}>
          <VStack gap={4} textAlign="center">
            <Heading size="xl">More Tools for Success</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Comprehensive resources to help you grow and succeed in your freelancing career
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} w="full">
            <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
              <VStack gap={4} align="start">
                <HStack gap={3}>
                  <Box p={3} bg="green.100" borderRadius="full" color="green.600">
                    <Icon as={FaCreditCard} boxSize={6} />
                  </Box>
                  <Heading size="md">Billing & Payment Guides</Heading>
                </HStack>
                <Text color="gray.600">
                  Learn best practices for invoicing, payment terms, and financial management. 
                  Get guidance on tax considerations and business setup.
                </Text>
                <VStack gap={2} align="start" w="full">
                  <HStack gap={3}>
                    <Icon as={FaShieldAlt} color="green.500" />
                    <Text fontSize="sm">Secure payment processing</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={FaClock} color="green.500" />
                    <Text fontSize="sm">Automated payment reminders</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={FaFileInvoiceDollar} color="green.500" />
                    <Text fontSize="sm">Professional invoice templates</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>

            <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
              <VStack gap={4} align="start">
                <HStack gap={3}>
                  <Box p={3} bg="purple.100" borderRadius="full" color="purple.600">
                    <Icon as={FaGraduationCap} boxSize={6} />
                  </Box>
                  <Heading size="md">Skill Development Hub</Heading>
                </HStack>
                <Text color="gray.600">
                  Access curated learning paths, industry insights, and skill development resources. 
                  Stay ahead with trending technologies and market demands.
                </Text>
                <VStack gap={2} align="start" w="full">
                  <HStack gap={3}>
                    <Icon as={FaUsers} color="purple.500" />
                    <Text fontSize="sm">Community learning groups</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={FaChartLine} color="purple.500" />
                    <Text fontSize="sm">Market trend analysis</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={FaTools} color="purple.500" />
                    <Text fontSize="sm">Practical project tutorials</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* CTA Section */}
      <Box 
        bg="gradient-to-r from-green.500 to-blue.600"
        color="white"
        py={16}
        borderRadius="xl"
        textAlign="center"
      >
        <VStack gap={8}>
          <Heading size="xl">Ready to Transform Your Freelancing Career?</Heading>
          <Text fontSize="lg" maxW="2xl">
            Join thousands of successful freelancers who've used our AI-powered platform 
            to build thriving businesses and achieve financial freedom.
          </Text>
          <HStack gap={6} wrap="wrap" justify="center">
            <Button size="lg" colorScheme="white" variant="solid" bg="white" color="green.600">
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" borderColor="white" color="white" _hover={{ bg: "white", color: "green.600" }}>
              Schedule Demo
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
