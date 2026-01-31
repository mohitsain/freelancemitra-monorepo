"use client";

import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading, 
  Button, 
  Icon, 
  Badge
} from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaRocket,
  FaStar,
  FaUsers,
  FaEye as FaViews
} from 'react-icons/fa';

export default function TemplatePreviewPage() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [template, setTemplate] = useState<any>(null);
  const [showControls, setShowControls] = useState(true);

  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const cardBg = colorMode === "dark" ? "gray.800" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";

  // Template data (same as in portfolio creation page)
  const templateData = {
    1: {
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .portfolio-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
          .hero-section { text-align: center; margin-bottom: 60px; padding: 80px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; }
          .hero-section h1 { font-size: 4rem; margin-bottom: 20px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          .hero-section .tagline { font-size: 2rem; margin-bottom: 30px; opacity: 0.9; font-weight: 300; }
          .hero-section .intro { font-size: 1.3rem; max-width: 700px; margin: 0 auto; line-height: 1.8; }
          .section { margin-bottom: 60px; padding: 50px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .section h2 { color: #2d3748; font-size: 2.5rem; margin-bottom: 30px; border-bottom: 4px solid #4299e1; padding-bottom: 15px; }
          .section h3 { color: #2d3748; font-size: 1.5rem; margin-bottom: 15px; }
          .section p { color: #4a5568; line-height: 1.8; margin-bottom: 20px; font-size: 1.1rem; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-top: 30px; }
          .skill-item { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #4299e1; transition: transform 0.3s ease; }
          .skill-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 30px; }
          .project-item { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 15px; border: 1px solid #e2e8f0; transition: transform 0.3s ease; }
          .project-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .contact-section { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; text-align: center; }
          .contact-section h2 { color: white; border-bottom: 4px solid white; }
          .contact-section p { color: rgba(255,255,255,0.9); font-size: 1.2rem; }
          ul { margin-left: 30px; margin-bottom: 20px; }
          li { color: #4a5568; margin-bottom: 8px; font-size: 1.1rem; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Sarah Johnson</h1>
            <p class="tagline">Creative Designer & Brand Strategist</p>
            <p class="intro">Passionate about creating beautiful, functional designs that tell compelling stories and drive business results.</p>
          </header>
          
          <section class="section about-section">
            <h2>About Me</h2>
            <p>With over 5 years of experience in graphic design and brand development, I specialize in creating visual identities that resonate with target audiences. My work spans across digital and print media, helping businesses establish strong brand presence.</p>
            <p>I believe that great design is not just about aesthetics, but about solving problems and creating meaningful connections between brands and their audiences. Every project is an opportunity to tell a unique story through visual communication.</p>
          </section>
          
          <section class="section skills-section">
            <h2>Skills & Expertise</h2>
            <div class="skills-grid">
              <div class="skill-item">
                <h3>Brand Identity Design</h3>
                <p>Creating memorable logos, color palettes, and brand guidelines that reflect your company's values and vision.</p>
              </div>
              <div class="skill-item">
                <h3>UI/UX Design</h3>
                <p>Designing intuitive user interfaces and experiences that engage users and drive conversions.</p>
              </div>
              <div class="skill-item">
                <h3>Print Design</h3>
                <p>Expert in creating stunning print materials including brochures, business cards, and marketing collateral.</p>
              </div>
              <div class="skill-item">
                <h3>Adobe Creative Suite</h3>
                <p>Proficient in Photoshop, Illustrator, InDesign, and other industry-standard design tools.</p>
              </div>
            </div>
          </section>
          
          <section class="section portfolio-section">
            <h2>Featured Work</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>Brand Identity for TechStart</h3>
                <p>Complete brand identity design including logo, color palette, and brand guidelines. The project resulted in a 40% increase in brand recognition and helped the startup secure Series A funding.</p>
              </div>
              <div class="project-item">
                <h3>E-commerce Website Design</h3>
                <p>Modern, responsive design for online fashion retailer with focus on user experience. Improved conversion rates by 25% and reduced bounce rate by 30%.</p>
              </div>
            </div>
          </section>
          
          <section class="section contact-section">
            <h2>Let's Work Together</h2>
            <p>Ready to bring your vision to life? Let's discuss your project.</p>
            <p>Email: sarah@designstudio.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Portfolio: sarahjohnson.design</p>
          </section>
        </div>
      `
    },
    2: {
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .portfolio-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
          .hero-section { text-align: center; margin-bottom: 60px; padding: 80px 40px; background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); color: white; border-radius: 20px; }
          .hero-section h1 { font-size: 4rem; margin-bottom: 20px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          .hero-section .tagline { font-size: 2rem; margin-bottom: 30px; opacity: 0.9; font-weight: 300; }
          .hero-section .intro { font-size: 1.3rem; max-width: 700px; margin: 0 auto; line-height: 1.8; }
          .section { margin-bottom: 60px; padding: 50px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .section h2 { color: #2d3748; font-size: 2.5rem; margin-bottom: 30px; border-bottom: 4px solid #38a169; padding-bottom: 15px; }
          .section h3 { color: #2d3748; font-size: 1.5rem; margin-bottom: 15px; }
          .section p { color: #4a5568; line-height: 1.8; margin-bottom: 20px; font-size: 1.1rem; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-top: 30px; }
          .skill-item { background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #38a169; transition: transform 0.3s ease; }
          .skill-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 30px; }
          .project-item { background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); padding: 30px; border-radius: 15px; border: 1px solid #9ae6b4; transition: transform 0.3s ease; }
          .project-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .contact-section { background: linear-gradient(135deg, #38a169 0%, #2f855a 100%); color: white; text-align: center; }
          .contact-section h2 { color: white; border-bottom: 4px solid white; }
          .contact-section p { color: rgba(255,255,255,0.9); font-size: 1.2rem; }
          ul { margin-left: 30px; margin-bottom: 20px; }
          li { color: #4a5568; margin-bottom: 8px; font-size: 1.1rem; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Alex Chen</h1>
            <p class="tagline">Full-Stack Developer & Tech Innovator</p>
            <p class="intro">Building scalable web applications and mobile solutions with modern technologies. Passionate about clean code and user-centered design.</p>
          </header>
          
          <section class="section about-section">
            <h2>About Me</h2>
            <p>Experienced full-stack developer with 6+ years building web and mobile applications. I specialize in React, Node.js, and cloud technologies, delivering robust solutions that scale with business growth.</p>
            <p>I'm passionate about creating efficient, maintainable code and staying up-to-date with the latest technologies. My goal is to build applications that not only meet requirements but exceed expectations in performance and user experience.</p>
          </section>
          
          <section class="section skills-section">
            <h2>Technical Skills</h2>
            <div class="skills-grid">
              <div class="skill-item">
                <h3>Frontend Development</h3>
                <p>React, Vue.js, TypeScript, HTML5, CSS3, Next.js, and modern JavaScript frameworks.</p>
              </div>
              <div class="skill-item">
                <h3>Backend Development</h3>
                <p>Node.js, Python, PHP, REST APIs, GraphQL, Express.js, and Django.</p>
              </div>
              <div class="skill-item">
                <h3>Database & Cloud</h3>
                <p>PostgreSQL, MongoDB, AWS, Docker, Kubernetes, and Redis.</p>
              </div>
              <div class="skill-item">
                <h3>Mobile Development</h3>
                <p>React Native, Flutter, iOS, Android, and cross-platform solutions.</p>
              </div>
            </div>
          </section>
          
          <section class="section portfolio-section">
            <h2>Recent Projects</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>E-commerce Platform</h3>
                <p>Built scalable e-commerce solution serving 10,000+ users with React frontend and Node.js backend. Features include real-time inventory management, payment processing, and analytics dashboard.</p>
              </div>
              <div class="project-item">
                <h3>Mobile Banking App</h3>
                <p>Developed secure mobile banking application with React Native and integrated payment processing. Implemented biometric authentication and real-time transaction monitoring.</p>
              </div>
            </div>
          </section>
          
          <section class="section contact-section">
            <h2>Get In Touch</h2>
            <p>Interested in working together? Let's discuss your next project.</p>
            <p>Email: alex@devstudio.com</p>
            <p>GitHub: github.com/alexchen</p>
            <p>LinkedIn: linkedin.com/in/alexchen</p>
          </section>
        </div>
      `
    },
    3: {
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .portfolio-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
          .hero-section { text-align: center; margin-bottom: 60px; padding: 80px 40px; background: linear-gradient(135deg, #d53f8c 0%, #9f7aea 100%); color: white; border-radius: 20px; }
          .hero-section h1 { font-size: 4rem; margin-bottom: 20px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          .hero-section .tagline { font-size: 2rem; margin-bottom: 30px; opacity: 0.9; font-weight: 300; }
          .hero-section .intro { font-size: 1.3rem; max-width: 700px; margin: 0 auto; line-height: 1.8; }
          .section { margin-bottom: 60px; padding: 50px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .section h2 { color: #2d3748; font-size: 2.5rem; margin-bottom: 30px; border-bottom: 4px solid #d53f8c; padding-bottom: 15px; }
          .section h3 { color: #2d3748; font-size: 1.5rem; margin-bottom: 15px; }
          .section p { color: #4a5568; line-height: 1.8; margin-bottom: 20px; font-size: 1.1rem; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-top: 30px; }
          .skill-item { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #d53f8c; transition: transform 0.3s ease; }
          .skill-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 30px; }
          .project-item { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding: 30px; border-radius: 15px; border: 1px solid #f9a8d4; transition: transform 0.3s ease; }
          .project-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .contact-section { background: linear-gradient(135deg, #d53f8c 0%, #b83280 100%); color: white; text-align: center; }
          .contact-section h2 { color: white; border-bottom: 4px solid white; }
          .contact-section p { color: rgba(255,255,255,0.9); font-size: 1.2rem; }
          ul { margin-left: 30px; margin-bottom: 20px; }
          li { color: #4a5568; margin-bottom: 8px; font-size: 1.1rem; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Michael Rodriguez</h1>
            <p class="tagline">Digital Marketing Strategist & Growth Expert</p>
            <p class="intro">Driving business growth through data-driven marketing strategies and innovative campaigns that deliver measurable results.</p>
          </header>
          
          <section class="section about-section">
            <h2>About Me</h2>
            <p>Marketing professional with 7+ years of experience in digital marketing, brand strategy, and business development. I help companies increase their online presence and drive sustainable growth.</p>
            <p>I specialize in creating comprehensive marketing strategies that combine creativity with data-driven insights. My approach focuses on understanding your target audience and delivering campaigns that resonate and convert.</p>
          </section>
          
          <section class="section skills-section">
            <h2>Marketing Expertise</h2>
            <div class="skills-grid">
              <div class="skill-item">
                <h3>Digital Marketing Strategy</h3>
                <p>Comprehensive digital marketing strategies that align with business goals and drive measurable results.</p>
              </div>
              <div class="skill-item">
                <h3>Social Media Management</h3>
                <p>Strategic social media campaigns across all platforms to build brand awareness and engagement.</p>
              </div>
              <div class="skill-item">
                <h3>SEO & Content Marketing</h3>
                <p>Search engine optimization and content strategies that improve visibility and organic traffic.</p>
              </div>
              <div class="skill-item">
                <h3>Analytics & Performance</h3>
                <p>Data analysis and performance tracking to optimize campaigns and maximize ROI.</p>
              </div>
            </div>
          </section>
          
          <section class="section portfolio-section">
            <h2>Success Stories</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>SaaS Company Growth</h3>
                <p>Increased monthly recurring revenue by 300% through targeted digital marketing campaigns and conversion optimization. Implemented A/B testing and data-driven decision making.</p>
              </div>
              <div class="project-item">
                <h3>E-commerce Brand Launch</h3>
                <p>Successfully launched new e-commerce brand, achieving 50,000+ followers across social platforms in 6 months. Generated $2M in first-year revenue.</p>
              </div>
            </div>
          </section>
          
          <section class="section contact-section">
            <h2>Ready to Grow?</h2>
            <p>Let's discuss how I can help accelerate your business growth.</p>
            <p>Email: michael@marketingpro.com</p>
            <p>LinkedIn: linkedin.com/in/michaelrodriguez</p>
            <p>Website: michaelrodriguez.marketing</p>
          </section>
        </div>
      `
    },
    4: {
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .portfolio-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
          .hero-section { text-align: center; margin-bottom: 60px; padding: 80px 40px; background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); color: white; border-radius: 20px; }
          .hero-section h1 { font-size: 4rem; margin-bottom: 20px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          .hero-section .tagline { font-size: 2rem; margin-bottom: 30px; opacity: 0.9; font-weight: 300; }
          .hero-section .intro { font-size: 1.3rem; max-width: 700px; margin: 0 auto; line-height: 1.8; }
          .section { margin-bottom: 60px; padding: 50px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .section h2 { color: #2d3748; font-size: 2.5rem; margin-bottom: 30px; border-bottom: 4px solid #ed8936; padding-bottom: 15px; }
          .section h3 { color: #2d3748; font-size: 1.5rem; margin-bottom: 15px; }
          .section p { color: #4a5568; line-height: 1.8; margin-bottom: 20px; font-size: 1.1rem; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-top: 30px; }
          .skill-item { background: linear-gradient(135deg, #fffaf0 0%, #fef5e7 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #ed8936; transition: transform 0.3s ease; }
          .skill-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 30px; }
          .project-item { background: linear-gradient(135deg, #fffaf0 0%, #fef5e7 100%); padding: 30px; border-radius: 15px; border: 1px solid #f6ad55; transition: transform 0.3s ease; }
          .project-item:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .contact-section { background: linear-gradient(135deg, #ed8936 0%, #c05621 100%); color: white; text-align: center; }
          .contact-section h2 { color: white; border-bottom: 4px solid white; }
          .contact-section p { color: rgba(255,255,255,0.9); font-size: 1.2rem; }
          ul { margin-left: 30px; margin-bottom: 20px; }
          li { color: #4a5568; margin-bottom: 8px; font-size: 1.1rem; }
        </style>
        <div class="portfolio-container">
          <header class="hero-section">
            <h1>Emma Thompson</h1>
            <p class="tagline">Content Writer & Storyteller</p>
            <p class="intro">Crafting compelling content that engages audiences and drives action. Specializing in blog posts, web copy, and marketing content.</p>
          </header>
          
          <section class="section about-section">
            <h2>About Me</h2>
            <p>Professional content writer with 4+ years of experience creating engaging copy for businesses across various industries. I help brands connect with their audience through powerful storytelling.</p>
            <p>I believe that great writing is about understanding your audience and crafting messages that resonate. Every piece of content I create is designed to inform, engage, and inspire action.</p>
          </section>
          
          <section class="section skills-section">
            <h2>Writing Services</h2>
            <div class="skills-grid">
              <div class="skill-item">
                <h3>Blog Posts & Articles</h3>
                <p>Engaging blog content that drives traffic, builds authority, and converts readers into customers.</p>
              </div>
              <div class="skill-item">
                <h3>Website Copy</h3>
                <p>Compelling website copy that clearly communicates your value proposition and drives conversions.</p>
              </div>
              <div class="skill-item">
                <h3>Marketing Materials</h3>
                <p>Sales pages, email campaigns, and marketing collateral that persuade and convert.</p>
              </div>
              <div class="skill-item">
                <h3>Social Media Content</h3>
                <p>Captivating social media posts that build engagement and grow your online presence.</p>
              </div>
            </div>
          </section>
          
          <section class="section portfolio-section">
            <h2>Writing Samples</h2>
            <div class="project-grid">
              <div class="project-item">
                <h3>Tech Blog Series</h3>
                <p>Created 20+ blog posts for SaaS company, increasing organic traffic by 150% and improving user engagement. The content strategy resulted in 40% more qualified leads.</p>
              </div>
              <div class="project-item">
                <h3>Brand Voice Development</h3>
                <p>Developed comprehensive brand voice guidelines and content strategy for startup, establishing consistent messaging across all channels and improving brand recognition by 60%.</p>
              </div>
            </div>
          </section>
          
          <section class="section contact-section">
            <h2>Let's Create Together</h2>
            <p>Ready to elevate your content? Let's discuss your writing needs.</p>
            <p>Email: emma@contentwriter.com</p>
            <p>Portfolio: emmathompsonwriter.com</p>
            <p>LinkedIn: linkedin.com/in/emmathompsonwriter</p>
          </section>
        </div>
      `
    }
  };

  useEffect(() => {
    const templateId = searchParams.get('id');
    if (templateId && templateData[templateId]) {
      setTemplate(templateData[templateId]);
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push('/portfolio-creation');
  };

  const handleUseTemplate = () => {
    router.push(`/portfolio-creation?useTemplate=${template.id}`);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (!template) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Text>Template not found</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} position="relative">
      {/* Floating Controls */}
      {showControls && (
        <Box
          position="fixed"
          top={4}
          left={4}
          right={4}
          zIndex={1000}
          bg={cardBg}
          borderRadius="lg"
          p={4}
          boxShadow="lg"
          border="1px"
          borderColor={borderColor}
        >
          <HStack justify="space-between">
            <HStack gap={4}>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleBack}
              >
                <Icon as={FaArrowLeft} mr={2} />
                Back
              </Button>
              <HStack gap={2}>
                <Text fontSize="3xl">{template.image}</Text>
                <VStack align="start" gap={0}>
                  <Heading size="sm" color={textPrimary}>{template.name}</Heading>
                  <Badge colorScheme="blue" variant="subtle">{template.category}</Badge>
                </VStack>
              </HStack>
            </HStack>
            
            <HStack gap={2}>
              <HStack gap={1} fontSize="sm" color={textSecondary}>
                <Icon as={FaStar} color="yellow.400" />
                <Text>{template.rating}</Text>
                <Icon as={FaViews} />
                <Text>{template.views}</Text>
              </HStack>
              <Button 
                size="sm" 
                colorScheme="blue"
                onClick={handleUseTemplate}
              >
                <Icon as={FaRocket} mr={2} />
                Use Template
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={toggleControls}
              >
                <Icon as={FaEye} />
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <Button
          position="fixed"
          top={4}
          right={4}
          zIndex={1000}
          size="sm"
          colorScheme="blue"
          onClick={toggleControls}
        >
          <Icon as={FaEye} mr={2} />
          Show Controls
        </Button>
      )}

      {/* Template Preview */}
      <Box 
        pt={showControls ? "120px" : "20px"}
        pb="20px"
        dangerouslySetInnerHTML={{ __html: template.htmlContent }}
      />
    </Box>
  );
}
