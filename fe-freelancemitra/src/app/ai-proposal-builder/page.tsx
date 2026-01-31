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
  Input,
  Textarea
} from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FaRocket, 
  FaArrowLeft,
  FaMagic,
  FaDownload,
  FaEdit,
  FaSave
} from 'react-icons/fa';

export default function AIProposalBuilderPage() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposalGenerated, setProposalGenerated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    skills: '',
    projectType: '',
    budget: '',
    timeline: ''
  });

  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const templateData: { [key: string]: any } = {
    1: { name: "Creative Designer", category: "Design", role: "designer", projectType: "branding" },
    2: { name: "Tech Developer", category: "Development", role: "developer", projectType: "web-design" },
    3: { name: "Marketing Expert", category: "Marketing", role: "marketer", projectType: "marketing-campaign" },
    4: { name: "Writer Portfolio", category: "Writing", role: "writer", projectType: "content-writing" }
  };

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && templateData[templateId]) {
      const template = templateData[templateId];
      setSelectedTemplate(template);
      setFormData(prev => ({
        ...prev,
        role: template.role,
        projectType: template.projectType
      }));
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setProposalGenerated(true);
    }, 3000);
  };

  const handleBack = () => {
    router.push('/portfolio-creation');
  };

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack gap={4} mb={4}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
              >
                <Icon as={FaArrowLeft} mr={2} />
                Back
              </Button>
              <Icon as={FaRocket} color={accentBlue} fontSize="2xl" />
              <Heading size="lg" color={textPrimary}>AI Proposal Builder</Heading>
              {selectedTemplate && (
                <Badge colorScheme="blue" variant="subtle">
                  Using: {selectedTemplate.name}
                </Badge>
              )}
            </HStack>
            <Text color={textSecondary} fontSize="lg">
              Let AI help you create a professional proposal in minutes. Just describe your skills and project requirements.
            </Text>
          </Box>

          {/* Form Section */}
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
            <VStack gap={6} align="stretch">
              <HStack gap={3}>
                <Icon as={FaMagic} color={accentBlue} />
                <Heading size="md" color={textPrimary}>Project Information</Heading>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <VStack gap={3} align="stretch">
                  <Text fontWeight="semibold" color={textPrimary}>Your Role</Text>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      border: `1px solid ${borderColor}`, 
                      backgroundColor: cardBg,
                      color: textPrimary
                    }}
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  >
                    <option value="">Select your profession</option>
                    <option value="designer">Designer</option>
                    <option value="developer">Developer</option>
                    <option value="writer">Writer</option>
                    <option value="marketer">Marketer</option>
                    <option value="consultant">Consultant</option>
                    <option value="photographer">Photographer</option>
                    <option value="videographer">Videographer</option>
                  </select>
                </VStack>
                
                <VStack gap={3} align="stretch">
                  <Text fontWeight="semibold" color={textPrimary}>Experience Level</Text>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      border: `1px solid ${borderColor}`, 
                      backgroundColor: cardBg,
                      color: textPrimary
                    }}
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  >
                    <option value="">Select experience</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (3-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                    <option value="expert">Expert (10+ years)</option>
                  </select>
                </VStack>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <VStack gap={3} align="stretch">
                  <Text fontWeight="semibold" color={textPrimary}>Project Type</Text>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      border: `1px solid ${borderColor}`, 
                      backgroundColor: cardBg,
                      color: textPrimary
                    }}
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                  >
                    <option value="">Select project type</option>
                    <option value="web-design">Web Design</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="branding">Branding</option>
                    <option value="content-writing">Content Writing</option>
                    <option value="marketing-campaign">Marketing Campaign</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </VStack>
                
                <VStack gap={3} align="stretch">
                  <Text fontWeight="semibold" color={textPrimary}>Budget Range</Text>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      border: `1px solid ${borderColor}`, 
                      backgroundColor: cardBg,
                      color: textPrimary
                    }}
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-plus">$25,000+</option>
                  </select>
                </VStack>
              </SimpleGrid>

              <VStack gap={3} align="stretch">
                <Text fontWeight="semibold" color={textPrimary}>Timeline</Text>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    border: `1px solid ${borderColor}`, 
                    backgroundColor: cardBg,
                    color: textPrimary
                  }}
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                >
                  <option value="">Select timeline</option>
                  <option value="1-week">1 week</option>
                  <option value="2-weeks">2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="2-months">2 months</option>
                  <option value="3-months">3 months</option>
                  <option value="6-months">6 months</option>
                </select>
              </VStack>
              
              <VStack gap={3} align="stretch">
                <Text fontWeight="semibold" color={textPrimary}>Describe Your Skills & Project Requirements</Text>
                <Textarea 
                  placeholder="Tell us about your skills, experience, and what makes you unique. Also describe the specific project requirements..."
                  rows={4}
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  bg={cardBg}
                  borderColor={borderColor}
                  resize="vertical"
                />
              </VStack>
              
              <Button 
                colorScheme="blue" 
                size="lg" 
                onClick={handleGenerateProposal}
                loading={isGenerating}
                loadingText="Generating Proposal..."
              >
                <Icon as={FaRocket} mr={2} />
                Generate Proposal with AI
              </Button>
            </VStack>
          </Box>

          {/* Generated Proposal Section */}
          {proposalGenerated && (
            <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6}>
              <VStack gap={6} align="stretch">
                <HStack justify="space-between">
                  <HStack gap={3}>
                    <Icon as={FaMagic} color="green.500" />
                    <Heading size="md" color={textPrimary}>Generated Proposal</Heading>
                    <Badge colorScheme="green">Ready</Badge>
                  </HStack>
                  <HStack gap={2}>
                    <Button size="sm" variant="outline">
                      <Icon as={FaEdit} mr={2} />
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="blue">
                      <Icon as={FaDownload} mr={2} />
                      Download
                    </Button>
                    <Button size="sm" colorScheme="green">
                      <Icon as={FaSave} mr={2} />
                      Save
                    </Button>
                  </HStack>
                </HStack>
                
                <Box bg={bgColor} borderRadius="md" p={4}>
                  <Text color={textPrimary} fontSize="sm" lineHeight="1.6">
                    <strong>Project Proposal</strong><br/><br/>
                    
                    <strong>Professional Overview:</strong><br/>
                    As a {formData.experience} {formData.role} with extensive experience in the field, I am excited to present this proposal for your {formData.projectType} project. My expertise in {formData.skills} makes me uniquely qualified to deliver exceptional results within your specified timeline and budget.<br/><br/>
                    
                    <strong>Project Scope:</strong><br/>
                    Based on your requirements, I will deliver a comprehensive {formData.projectType} solution that meets your business objectives. The project will be completed within {formData.timeline} and will include all necessary deliverables as discussed.<br/><br/>
                    
                    <strong>Investment:</strong><br/>
                    The total investment for this project is within your {formData.budget} budget range. This includes all project phases, revisions, and final deliverables.<br/><br/>
                    
                    <strong>Next Steps:</strong><br/>
                    I'm ready to begin immediately upon project approval. Let's schedule a call to discuss the details and get started on creating something amazing together.
                  </Text>
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </DashboardLayout>
  );
}
