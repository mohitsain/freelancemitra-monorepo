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
  FaArrowLeft,
  FaSave,
  FaEye,
  FaDownload,
  FaEdit,
  FaPalette,
  FaFont,
  FaImage,
  FaCode
} from 'react-icons/fa';

export default function PortfolioEditorPage() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('content');
  const [editedContent, setEditedContent] = useState('');

  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  // Sample portfolio data (in real app, this would come from API)
  const samplePortfolios = {
    1: {
      id: 1,
      name: "My Developer Portfolio",
      category: "Development",
      status: "Published",
      lastUpdated: "2 days ago",
      image: "💻",
      description: "Full-stack development showcase",
      htmlContent: `
        <style>
          .portfolio-container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .hero-section { text-align: center; margin-bottom: 40px; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
          .hero-section h1 { font-size: 3rem; margin-bottom: 10px; font-weight: 700; }
          .hero-section .tagline { font-size: 1.5rem; margin-bottom: 20px; opacity: 0.9; }
          .hero-section .intro { font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
          .section { margin-bottom: 40px; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .section h2 { color: #2d3748; font-size: 2rem; margin-bottom: 20px; border-bottom: 3px solid #4299e1; padding-bottom: 10px; }
          .section h3 { color: #2d3748; font-size: 1.3rem; margin-bottom: 10px; }
          .section p { color: #4a5568; line-height: 1.7; margin-bottom: 15px; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
          .skill-item { background: #f7fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #4299e1; }
          .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
          .project-item { background: #f7fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
          .contact-section { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; text-align: center; }
          .contact-section h2 { color: white; border-bottom: 3px solid white; }
          .contact-section p { color: rgba(255,255,255,0.9); }
          [contenteditable="true"] { outline: none; border: 2px dashed transparent; border-radius: 4px; padding: 4px; transition: all 0.2s; }
          [contenteditable="true"]:hover { border-color: #4299e1; background: rgba(66, 153, 225, 0.05); }
          [contenteditable="true"]:focus { border-color: #3182ce; background: rgba(49, 130, 206, 0.1); border-style: solid; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1 contenteditable="true">Alex Chen</h1>
            <p contenteditable="true" class="tagline">Full-Stack Developer & Tech Innovator</p>
            <p contenteditable="true" class="intro">Building scalable web applications and mobile solutions with modern technologies. Passionate about clean code and user-centered design.</p>
          </header>
          
          <section class="section about-section">
            <h2 contenteditable="true">About Me</h2>
            <p contenteditable="true">Experienced full-stack developer with 6+ years building web and mobile applications. I specialize in React, Node.js, and cloud technologies, delivering robust solutions that scale with business growth.</p>
          </section>
          
          <section class="section skills-section">
            <h2 contenteditable="true">Technical Skills</h2>
            <div class="skills-grid">
              <div class="skill-item">
                <h3 contenteditable="true">Frontend Development</h3>
                <p contenteditable="true">React, Vue.js, TypeScript, HTML5, CSS3</p>
              </div>
              <div class="skill-item">
                <h3 contenteditable="true">Backend Development</h3>
                <p contenteditable="true">Node.js, Python, PHP, REST APIs, GraphQL</p>
              </div>
              <div class="skill-item">
                <h3 contenteditable="true">Database & Cloud</h3>
                <p contenteditable="true">PostgreSQL, MongoDB, AWS, Docker, Kubernetes</p>
              </div>
              <div class="skill-item">
                <h3 contenteditable="true">Mobile Development</h3>
                <p contenteditable="true">React Native, Flutter, iOS, Android</p>
              </div>
            </div>
          </section>
          
          <section class="section portfolio-section">
            <h2 contenteditable="true">Recent Projects</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3 contenteditable="true">E-commerce Platform</h3>
                <p contenteditable="true">Built scalable e-commerce solution serving 10,000+ users with React frontend and Node.js backend. Features include real-time inventory management, payment processing, and analytics dashboard.</p>
              </div>
              <div class="project-item">
                <h3 contenteditable="true">Mobile Banking App</h3>
                <p contenteditable="true">Developed secure mobile banking application with React Native and integrated payment processing. Implemented biometric authentication and real-time transaction monitoring.</p>
              </div>
            </div>
          </section>
          
          <section class="section contact-section">
            <h2 contenteditable="true">Get In Touch</h2>
            <p contenteditable="true">Interested in working together? Let's discuss your next project.</p>
            <p contenteditable="true">Email: alex@devstudio.com</p>
            <p contenteditable="true">GitHub: github.com/alexchen</p>
            <p contenteditable="true">LinkedIn: linkedin.com/in/alexchen</p>
          </section>
        </div>
      `
    }
  };

  useEffect(() => {
    const portfolioId = searchParams.get('id');
    if (portfolioId && samplePortfolios[portfolioId]) {
      setPortfolio(samplePortfolios[portfolioId]);
      setEditedContent(samplePortfolios[portfolioId].htmlContent);
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push('/portfolio-creation');
  };

  const handleSave = () => {
    // In real app, this would save to backend
    alert("Portfolio saved successfully!");
    setIsEditing(false);
  };

  const handleExportPDF = () => {
    // In real app, this would generate and download PDF
    alert("PDF export started! Your portfolio PDF will be ready shortly.");
  };

  const handlePreview = () => {
    // In real app, this would open preview in new tab
    alert("Opening preview...");
  };

  if (!portfolio) {
    return (
      <DashboardLayout>
        <Box px={6} py={8}>
          <Text>Portfolio not found</Text>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <Box>
            <HStack gap={4} mb={4}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
              >
                <Icon as={FaArrowLeft} mr={2} />
                Back to Portfolios
              </Button>
              <Icon as={FaEdit} color={accentBlue} fontSize="2xl" />
              <Heading size="lg" color={textPrimary}>Portfolio Editor</Heading>
              <Badge colorScheme="blue" variant="subtle">{portfolio.name}</Badge>
            </HStack>
            <Text color={textSecondary} fontSize="lg">
              Edit your portfolio content and customize the design
            </Text>
          </Box>

          {/* Toolbar */}
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <HStack justify="space-between">
              <HStack gap={2}>
                <Button 
                  size="sm" 
                  colorScheme={activeSection === 'content' ? 'blue' : 'gray'}
                  onClick={() => setActiveSection('content')}
                >
                  <Icon as={FaEdit} mr={2} />
                  Content
                </Button>
                <Button 
                  size="sm" 
                  colorScheme={activeSection === 'design' ? 'blue' : 'gray'}
                  onClick={() => setActiveSection('design')}
                >
                  <Icon as={FaPalette} mr={2} />
                  Design
                </Button>
                <Button 
                  size="sm" 
                  colorScheme={activeSection === 'preview' ? 'blue' : 'gray'}
                  onClick={() => setActiveSection('preview')}
                >
                  <Icon as={FaEye} mr={2} />
                  Preview
                </Button>
              </HStack>
              
              <HStack gap={2}>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handlePreview}
                >
                  <Icon as={FaEye} mr={2} />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleExportPDF}
                >
                  <Icon as={FaDownload} mr={2} />
                  Export PDF
                </Button>
                <Button 
                  size="sm" 
                  colorScheme="blue"
                  onClick={handleSave}
                >
                  <Icon as={FaSave} mr={2} />
                  Save Changes
                </Button>
              </HStack>
            </HStack>
          </Box>

          {/* Content Area */}
          <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6} minH="600px">
            {activeSection === 'content' && (
              <VStack gap={4} align="stretch">
                <Heading size="md" color={textPrimary}>Edit Portfolio Content</Heading>
                <Text color={textSecondary}>
                  Click on any text in the preview below to edit it directly. Changes are saved automatically.
                </Text>
                <Box 
                  maxH="500px" 
                  overflowY="auto" 
                  bg="white" 
                  borderRadius="md" 
                  p={4}
                  border="1px solid #e2e8f0"
                  dangerouslySetInnerHTML={{ __html: editedContent }}
                />
              </VStack>
            )}

            {activeSection === 'design' && (
              <VStack gap={4} align="stretch">
                <Heading size="md" color={textPrimary}>Customize Design</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Box>
                    <Text fontWeight="semibold" color={textPrimary} mb={2}>Color Theme</Text>
                    <HStack gap={2}>
                      <Button size="sm" colorScheme="blue">Blue</Button>
                      <Button size="sm" colorScheme="green">Green</Button>
                      <Button size="sm" colorScheme="purple">Purple</Button>
                      <Button size="sm" colorScheme="orange">Orange</Button>
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color={textPrimary} mb={2}>Layout Style</Text>
                    <HStack gap={2}>
                      <Button size="sm" variant="outline">Modern</Button>
                      <Button size="sm" variant="outline">Classic</Button>
                      <Button size="sm" variant="outline">Minimal</Button>
                    </HStack>
                  </Box>
                </SimpleGrid>
                <Text color={textSecondary} fontSize="sm">
                  Design customization features coming soon! For now, you can edit the content directly.
                </Text>
              </VStack>
            )}

            {activeSection === 'preview' && (
              <VStack gap={4} align="stretch">
                <Heading size="md" color={textPrimary}>Live Preview</Heading>
                <Text color={textSecondary}>
                  This is how your portfolio will look to visitors.
                </Text>
                <Box 
                  maxH="500px" 
                  overflowY="auto" 
                  bg="white" 
                  borderRadius="md" 
                  p={4}
                  border="1px solid #e2e8f0"
                  dangerouslySetInnerHTML={{ __html: editedContent }}
                />
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </DashboardLayout>
  );
}
