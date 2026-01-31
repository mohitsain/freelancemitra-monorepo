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
  Progress,
  Input,
  InputGroup,
  InputElement,
  Select,
  Textarea
} from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaRocket, 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaDownload, 
  FaShare,
  FaStar,
  FaUsers,
  FaEye as FaViews,
  FaTrash
} from 'react-icons/fa';

export default function PortfolioCreationPage() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [userPortfolios, setUserPortfolios] = useState([
    {
      id: 1,
      name: "My Developer Portfolio",
      category: "Development",
      status: "Published",
      lastUpdated: "2 days ago",
      image: "💻",
      description: "Full-stack development showcase"
    },
    {
      id: 2,
      name: "Design Portfolio Draft",
      category: "Design",
      status: "Draft",
      lastUpdated: "1 week ago",
      image: "🎨",
      description: "Creative design portfolio"
    },
    {
      id: 3,
      name: "Marketing Portfolio",
      category: "Marketing",
      status: "Published",
      lastUpdated: "3 days ago",
      image: "📈",
      description: "Digital marketing campaigns"
    },
    {
      id: 4,
      name: "Writing Portfolio",
      category: "Writing",
      status: "Draft",
      lastUpdated: "5 days ago",
      image: "✍️",
      description: "Content writing samples"
    }
  ]);
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  const handleUseTemplate = (template: any) => {
    // Create new portfolio from template
    const newPortfolio = {
      id: Date.now(), // Simple ID generation
      name: `${template.name} Portfolio`,
      category: template.category,
      status: "Draft",
      lastUpdated: "Just now",
      image: template.image,
      description: template.description,
      htmlContent: template.htmlContent
    };
    
    setUserPortfolios(prev => [newPortfolio, ...prev]);
  };

  const handlePreviewTemplate = (template: any) => {
    router.push(`/template-preview?id=${template.id}`);
  };


  const handleEditPortfolio = (portfolio: any) => {
    router.push(`/portfolio-editor?id=${portfolio.id}`);
  };

  const handleDeletePortfolio = (portfolioId: number) => {
    setUserPortfolios(prev => prev.filter(p => p.id !== portfolioId));
  };

  const portfolioTemplates = [
    {
      id: 1,
      name: "Creative Designer",
      category: "Design",
      rating: 4.8,
      views: 1240,
      downloads: 89,
      image: "🎨",
      description: "Perfect for graphic designers and artists",
      htmlContent: `
        <style>
          h1 { font-size: 24px; font-weight: bold; color: #2d3748; margin-bottom: 8px; }
          h2 { font-size: 20px; font-weight: bold; color: #2d3748; margin-top: 16px; margin-bottom: 8px; }
          h3 { font-size: 16px; font-weight: bold; color: #2d3748; margin-bottom: 4px; }
          p { color: #4a5568; line-height: 1.5; margin-bottom: 8px; }
          ul { margin-left: 20px; margin-bottom: 8px; }
          li { color: #4a5568; margin-bottom: 4px; }
          .tagline { font-size: 18px; color: #4299e1; font-weight: 500; }
          .intro { font-size: 16px; font-style: italic; color: #718096; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Sarah Johnson</h1>
            <p class="tagline">Creative Designer & Brand Strategist</p>
            <p class="intro">Passionate about creating beautiful, functional designs that tell compelling stories and drive business results.</p>
          </header>
          
          <section class="about-section">
            <h2>About Me</h2>
            <p>With over 5 years of experience in graphic design and brand development, I specialize in creating visual identities that resonate with target audiences. My work spans across digital and print media, helping businesses establish strong brand presence.</p>
          </section>
          
          <section class="skills-section">
            <h2>Skills & Expertise</h2>
            <ul>
              <li>Brand Identity Design</li>
              <li>UI/UX Design</li>
              <li>Print Design</li>
              <li>Adobe Creative Suite</li>
              <li>Figma & Sketch</li>
            </ul>
          </section>
          
          <section class="portfolio-section">
            <h2>Featured Work</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>Brand Identity for TechStart</h3>
                <p>Complete brand identity design including logo, color palette, and brand guidelines.</p>
              </div>
              <div class="project-item">
                <h3>E-commerce Website Design</h3>
                <p>Modern, responsive design for online fashion retailer with focus on user experience.</p>
              </div>
            </div>
          </section>
          
          <section class="contact-section">
            <h2>Let's Work Together</h2>
            <p>Ready to bring your vision to life? Let's discuss your project.</p>
            <p>Email: sarah@designstudio.com</p>
            <p>Phone: (555) 123-4567</p>
          </section>
        </div>
      `
    },
    {
      id: 2,
      name: "Tech Developer",
      category: "Development",
      rating: 4.9,
      views: 2156,
      downloads: 156,
      image: "💻",
      description: "Ideal for software developers and engineers",
      htmlContent: `
        <style>
          h1 { font-size: 24px; font-weight: bold; color: #2d3748; margin-bottom: 8px; }
          h2 { font-size: 20px; font-weight: bold; color: #2d3748; margin-top: 16px; margin-bottom: 8px; }
          h3 { font-size: 16px; font-weight: bold; color: #2d3748; margin-bottom: 4px; }
          p { color: #4a5568; line-height: 1.5; margin-bottom: 8px; }
          ul { margin-left: 20px; margin-bottom: 8px; }
          li { color: #4a5568; margin-bottom: 4px; }
          .tagline { font-size: 18px; color: #4299e1; font-weight: 500; }
          .intro { font-size: 16px; font-style: italic; color: #718096; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Alex Chen</h1>
            <p class="tagline">Full-Stack Developer & Tech Innovator</p>
            <p class="intro">Building scalable web applications and mobile solutions with modern technologies. Passionate about clean code and user-centered design.</p>
          </header>
          
          <section class="about-section">
            <h2>About Me</h2>
            <p>Experienced full-stack developer with 6+ years building web and mobile applications. I specialize in React, Node.js, and cloud technologies, delivering robust solutions that scale with business growth.</p>
          </section>
          
          <section class="skills-section">
            <h2>Technical Skills</h2>
            <ul>
              <li>Frontend: React, Vue.js, TypeScript</li>
              <li>Backend: Node.js, Python, PHP</li>
              <li>Database: PostgreSQL, MongoDB</li>
              <li>Cloud: AWS, Docker, Kubernetes</li>
              <li>Mobile: React Native, Flutter</li>
            </ul>
          </section>
          
          <section class="portfolio-section">
            <h2>Recent Projects</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>E-commerce Platform</h3>
                <p>Built scalable e-commerce solution serving 10,000+ users with React frontend and Node.js backend.</p>
              </div>
              <div class="project-item">
                <h3>Mobile Banking App</h3>
                <p>Developed secure mobile banking application with React Native and integrated payment processing.</p>
              </div>
            </div>
          </section>
          
          <section class="contact-section">
            <h2>Get In Touch</h2>
            <p>Interested in working together? Let's discuss your next project.</p>
            <p>Email: alex@devstudio.com</p>
            <p>GitHub: github.com/alexchen</p>
          </section>
        </div>
      `
    },
    {
      id: 3,
      name: "Marketing Expert",
      category: "Marketing",
      rating: 4.7,
      views: 987,
      downloads: 67,
      image: "📈",
      description: "Great for marketers and consultants",
      htmlContent: `
        <style>
          h1 { font-size: 24px; font-weight: bold; color: #2d3748; margin-bottom: 8px; }
          h2 { font-size: 20px; font-weight: bold; color: #2d3748; margin-top: 16px; margin-bottom: 8px; }
          h3 { font-size: 16px; font-weight: bold; color: #2d3748; margin-bottom: 4px; }
          p { color: #4a5568; line-height: 1.5; margin-bottom: 8px; }
          ul { margin-left: 20px; margin-bottom: 8px; }
          li { color: #4a5568; margin-bottom: 4px; }
          .tagline { font-size: 18px; color: #4299e1; font-weight: 500; }
          .intro { font-size: 16px; font-style: italic; color: #718096; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Michael Rodriguez</h1>
            <p class="tagline">Digital Marketing Strategist & Growth Expert</p>
            <p class="intro">Driving business growth through data-driven marketing strategies and innovative campaigns that deliver measurable results.</p>
          </header>
          
          <section class="about-section">
            <h2>About Me</h2>
            <p>Marketing professional with 7+ years of experience in digital marketing, brand strategy, and business development. I help companies increase their online presence and drive sustainable growth.</p>
          </section>
          
          <section class="skills-section">
            <h2>Marketing Expertise</h2>
            <ul>
              <li>Digital Marketing Strategy</li>
              <li>Social Media Management</li>
              <li>SEO & Content Marketing</li>
              <li>Email Marketing Campaigns</li>
              <li>Analytics & Performance Tracking</li>
            </ul>
          </section>
          
          <section class="portfolio-section">
            <h2>Success Stories</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>SaaS Company Growth</h3>
                <p>Increased monthly recurring revenue by 300% through targeted digital marketing campaigns and conversion optimization.</p>
              </div>
              <div class="project-item">
                <h3>E-commerce Brand Launch</h3>
                <p>Successfully launched new e-commerce brand, achieving 50,000+ followers across social platforms in 6 months.</p>
              </div>
            </div>
          </section>
          
          <section class="contact-section">
            <h2>Ready to Grow?</h2>
            <p>Let's discuss how I can help accelerate your business growth.</p>
            <p>Email: michael@marketingpro.com</p>
            <p>LinkedIn: linkedin.com/in/michaelrodriguez</p>
          </section>
        </div>
      `
    },
    {
      id: 4,
      name: "Writer Portfolio",
      category: "Writing",
      rating: 4.6,
      views: 756,
      downloads: 43,
      image: "✍️",
      description: "Perfect for content writers and authors",
      htmlContent: `
        <style>
          h1 { font-size: 24px; font-weight: bold; color: #2d3748; margin-bottom: 8px; }
          h2 { font-size: 20px; font-weight: bold; color: #2d3748; margin-top: 16px; margin-bottom: 8px; }
          h3 { font-size: 16px; font-weight: bold; color: #2d3748; margin-bottom: 4px; }
          p { color: #4a5568; line-height: 1.5; margin-bottom: 8px; }
          ul { margin-left: 20px; margin-bottom: 8px; }
          li { color: #4a5568; margin-bottom: 4px; }
          .tagline { font-size: 18px; color: #4299e1; font-weight: 500; }
          .intro { font-size: 16px; font-style: italic; color: #718096; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Emma Thompson</h1>
            <p class="tagline">Content Writer & Storyteller</p>
            <p class="intro">Crafting compelling content that engages audiences and drives action. Specializing in blog posts, web copy, and marketing content.</p>
          </header>
          
          <section class="about-section">
            <h2>About Me</h2>
            <p>Professional content writer with 4+ years of experience creating engaging copy for businesses across various industries. I help brands connect with their audience through powerful storytelling.</p>
          </section>
          
          <section class="skills-section">
            <h2>Writing Services</h2>
            <ul>
              <li>Blog Posts & Articles</li>
              <li>Website Copy</li>
              <li>Marketing Materials</li>
              <li>Social Media Content</li>
              <li>Email Campaigns</li>
            </ul>
          </section>
          
          <section class="portfolio-section">
            <h2>Writing Samples</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>Tech Blog Series</h3>
                <p>Created 20+ blog posts for SaaS company, increasing organic traffic by 150% and improving user engagement.</p>
              </div>
              <div class="project-item">
                <h3>Brand Voice Development</h3>
                <p>Developed comprehensive brand voice guidelines and content strategy for startup, establishing consistent messaging across all channels.</p>
              </div>
            </div>
          </section>
          
          <section class="contact-section">
            <h2>Let's Create Together</h2>
            <p>Ready to elevate your content? Let's discuss your writing needs.</p>
            <p>Email: emma@contentwriter.com</p>
            <p>Portfolio: emmathompsonwriter.com</p>
          </section>
        </div>
      `
    }
  ];

  return (
    <DashboardLayout>
      <Box px={6}>
        <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={4}>
            <Icon as={FaRocket} color={accentBlue} fontSize="2xl" />
            <Heading size="lg" color={textPrimary}>Portfolio Creation</Heading>
          </HStack>
          <Text color={textSecondary} fontSize="lg">
            Create stunning portfolios to showcase your work and attract clients
          </Text>
        </Box>

        {/* Templates Section */}
        <Box>
          <HStack justify="space-between" mb={6}>
            <Heading size="md" color={textPrimary}>Popular Templates</Heading>
            <Button variant="outline" size="sm">View All</Button>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {portfolioTemplates.map((template) => (
              <Box key={template.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6} _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }} transition="all 0.2s">
                <VStack gap={3} align="stretch">
                  <VStack gap={2}>
                    <Text fontSize="4xl">{template.image}</Text>
                    <Badge colorScheme="blue" variant="subtle">{template.category}</Badge>
                  </VStack>
                  
                  <Text fontWeight="bold" color={textPrimary} fontSize="lg">{template.name}</Text>
                  <Text fontSize="sm" color={textSecondary} textAlign="center">{template.description}</Text>
                  
                  <HStack justify="space-between" fontSize="sm">
                    <HStack gap={1}>
                      <Icon as={FaStar} color="yellow.400" />
                      <Text color={textSecondary}>{template.rating}</Text>
                    </HStack>
                    <HStack gap={1}>
                      <Icon as={FaViews} color={textSecondary} />
                      <Text color={textSecondary}>{template.views}</Text>
                    </HStack>
                  </HStack>
                  
                  <HStack gap={2}>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      flex={1}
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      flex={1}
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      Preview
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* User Portfolios Section */}
        <Box>
          <HStack justify="space-between" mb={6}>
            <Heading size="md" color={textPrimary}>Your Portfolios</Heading>
            <Button 
              colorScheme="blue" 
              size="sm" 
              onClick={() => router.push('/ai-proposal-builder')}
            >
              <Icon as={FaPlus} mr={2} />
              Add New Portfolio
            </Button>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {userPortfolios.map((portfolio) => (
              <Box key={portfolio.id} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={6} _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }} transition="all 0.2s">
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between">
                    <VStack gap={2} align="start">
                      <Text fontSize="3xl">{portfolio.image}</Text>
                      <Badge 
                        colorScheme={portfolio.status === "Published" ? "green" : "yellow"} 
                        variant="subtle"
                      >
                        {portfolio.status}
                      </Badge>
                    </VStack>
                    <HStack gap={2}>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        colorScheme="blue"
                        onClick={() => handleEditPortfolio(portfolio)}
                      >
                        <Icon as={FaEdit} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        colorScheme="red"
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                      >
                        <Icon as={FaTrash} />
                      </Button>
                    </HStack>
                  </HStack>
                  
                  <VStack gap={2} align="stretch">
                    <Text fontWeight="bold" color={textPrimary} fontSize="lg">{portfolio.name}</Text>
                    <Text fontSize="sm" color={textSecondary}>{portfolio.description}</Text>
                    <Text fontSize="xs" color={textSecondary}>
                      Last updated: {portfolio.lastUpdated}
                    </Text>
                  </VStack>
                  
                  <HStack gap={2}>
                    <Button size="sm" colorScheme="blue" flex={1}>
                      <Icon as={FaEye} mr={2} />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      flex={1}
                      onClick={() => handleEditPortfolio(portfolio)}
                    >
                      <Icon as={FaEdit} mr={2} />
                      Edit
                    </Button>
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
