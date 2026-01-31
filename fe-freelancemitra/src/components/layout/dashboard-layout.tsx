'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, 
  HStack, 
  VStack, 
  Text, 
  Icon, 
  IconButton, 
  useDisclosure,
  useBreakpointValue,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody
} from '@chakra-ui/react';
import { 
  FaRocket, 
  FaUserTie, 
  FaFileInvoiceDollar, 
  FaBriefcase, 
  FaChartLine,
  FaTools,
  FaFileAlt,
  FaPlug,
  FaBars,
  FaChevronDown,
  FaChevronRight,
  FaBell,
  FaCalendarAlt,
  FaDollarSign,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaCrown,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import ThemeToggle from '@/components/common/theme-toggle';
import { useColorMode } from '@/components/ui/color-mode';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open, onOpen, onClose } = useDisclosure();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Theme-aware colors
  const bgColor = colorMode === 'dark' ? 'gray.900' : 'gray.50';
  const cardBg = colorMode === 'dark' ? 'gray.800' : 'white';
  const borderColor = colorMode === 'dark' ? 'gray.700' : 'gray.200';
  const textPrimary = colorMode === 'dark' ? 'white' : 'gray.800';
  const textSecondary = colorMode === 'dark' ? 'gray.300' : 'gray.600';
  const textTertiary = colorMode === 'dark' ? 'gray.400' : 'gray.500';
  const accentBlue = 'blue.500';

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const navigationItems = [
    {
      section: "General",
      items: [
        { name: "Dashboard", icon: FaChartLine, active: pathname === "/", subItems: undefined, route: "/" },
        { name: "Portfolio Creation", icon: FaRocket, active: pathname === "/portfolio-creation", subItems: ["Templates", "AI Builder", "Customization"], route: "/portfolio-creation" },
        { name: "Proposal Building", icon: FaFileAlt, active: pathname === "/proposal-building", subItems: ["AI Generator", "Templates", "Analytics"], route: "/proposal-building" },
        { name: "Project Creation", icon: FaBriefcase, active: pathname === "/project-creation", subItems: ["Project Setup", "Timeline", "Milestones"], route: "/project-creation" },
        { name: "Lead Management", icon: FaUserTie, active: pathname === "/lead-management", subItems: ["Lead Scoring", "CRM", "Follow-ups"], route: "/lead-management" },
        { name: "Invoice Generation", icon: FaFileInvoiceDollar, active: pathname === "/invoice-generation", subItems: ["Create Invoice", "Payment Tracking", "Reports"], route: "/invoice-generation" },
        { name: "Extensions", icon: FaTools, active: pathname === "/extensions", subItems: ["LinkedIn", "Upwork", "Behance"], route: "/extensions" },
        { name: "Integrations", icon: FaPlug, active: pathname === "/integrations", subItems: ["API Keys", "Webhooks", "Third-party Apps"], route: "/integrations" }
      ]
    }
  ];

  const toggleItem = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Top Bar */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={cardBg}
        borderBottom="1px"
        borderColor={borderColor}
        px={6}
        py={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left side - Hamburger and Workspace */}
        <HStack gap={4}>
          <IconButton
            variant="ghost"
            onClick={onOpen}
            aria-label="Open menu"
            display={{ base: "flex", lg: "none" }}
            _hover={{ bg: "gray.100" }}
            transition="all 0.2s"
          >
            <Icon as={FaBars} />
          </IconButton>
          
          <HStack gap={3}>
            <Icon as={FaBriefcase} color={accentBlue} />
            <Text fontWeight="semibold" color={textPrimary}>FreelanceMitra</Text>
          </HStack>
        </HStack>

        {/* Right side - Date, Currency, User */}
        <HStack gap={4}>
          <HStack gap={2} display={{ base: "none", md: "flex" }}>
            <Icon as={FaCalendarAlt} color={textSecondary} />
            <Text fontSize="sm" color={textSecondary}>{currentDate}</Text>
          </HStack>
          
          <HStack gap={2} display={{ base: "none", md: "flex" }}>
            <Icon as={FaDollarSign} color={textSecondary} />
            <Text fontSize="sm" color={textSecondary}>USD</Text>
          </HStack>
          
          <HStack gap={3}>
            <IconButton
              variant="ghost"
              aria-label="Notifications"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
            >
              <Icon as={FaBell} color={textSecondary} />
            </IconButton>
            
            <ThemeToggle />
            
            <IconButton
              variant="ghost"
              aria-label="Sign Out"
              onClick={() => signOut({ callbackUrl: '/signin' })}
              _hover={{ bg: "red.50", color: "red.600" }}
              transition="all 0.2s"
            >
              <Icon as={FaSignOutAlt} color={textSecondary} />
            </IconButton>
          </HStack>
        </HStack>
      </Box>

      {/* Sidebar */}
      <Box
        position="fixed"
        top="80px"
        left={0}
        bottom={0}
        w={sidebarCollapsed ? "80px" : "280px"}
        bg={cardBg}
        borderRight="1px"
        borderColor={borderColor}
        transition="width 0.3s ease"
        zIndex={999}
        display={{ base: "none", lg: "block" }}
      >
        {/* Sidebar Header */}
        <Box p={4} borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between" align="center">
            {!sidebarCollapsed && (
              <HStack gap={2} align="center">
                <Icon as={FaChevronLeft} color={textSecondary} fontSize="12px" />
                <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                  GENERAL
                </Text>
              </HStack>
            )}
            <IconButton
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              _hover={{ bg: "gray.100" }}
            >
              <Icon as={sidebarCollapsed ? FaChevronRight : FaChevronLeft} />
            </IconButton>
          </HStack>
        </Box>

        {/* Search and Filter Section */}
        {!sidebarCollapsed && (
          <Box p={4} borderBottom="1px" borderColor={borderColor}>
            <VStack gap={3} align="stretch">
              {/* Search Input */}
              <Box position="relative">
                <input
                  type="text"
                  placeholder="Search features..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingLeft: '40px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#1a202c'
                  }}
                />
                <Icon
                  as={FaSearch}
                  position="absolute"
                  left="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  fontSize="14px"
                />
              </Box>
              
              {/* Filter Input */}
              <Box position="relative">
                <input
                  type="text"
                  placeholder="Filter by category"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingLeft: '40px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#1a202c'
                  }}
                />
                <Icon
                  as={FaFilter}
                  position="absolute"
                  left="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  fontSize="14px"
                />
              </Box>
            </VStack>
          </Box>
        )}

        {/* Navigation Items */}
        <Box flex={1} overflowY="auto" px={2}>
          {navigationItems.map((section, sectionIndex) => (
            <Box key={sectionIndex}>
              {!sidebarCollapsed && (
                <Box px={4} py={2}>
                  <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                    {section.section}
                  </Text>
                </Box>
              )}
              {section.items.map((item, itemIndex) => (
                <Box key={itemIndex}>
                  {item.route ? (
                    <Link href={item.route} style={{ textDecoration: 'none' }}>
                      <HStack
                        px={4}
                        py={3}
                        gap={3}
                        cursor="pointer"
                        _hover={{ bg: "blue.50" }}
                        bg={item.active ? "blue.50" : "transparent"}
                        color={item.active ? accentBlue : textPrimary}
                        borderRight={item.active ? "3px solid" : "none"}
                        borderRightColor={item.active ? accentBlue : "transparent"}
                        transition="all 0.2s"
                      >
                        <Icon as={item.icon} />
                        {!sidebarCollapsed && (
                          <>
                            <Text fontSize="sm" fontWeight={item.active ? "semibold" : "normal"}>
                              {item.name}
                            </Text>
                            {item.subItems && (
                              <Icon 
                                as={expandedItems.has(item.name) ? FaChevronDown : FaChevronRight} 
                                ml="auto" 
                                color={textSecondary}
                                transition="transform 0.2s"
                                transform={expandedItems.has(item.name) ? "rotate(0deg)" : "rotate(0deg)"}
                              />
                            )}
                          </>
                        )}
                      </HStack>
                    </Link>
                  ) : (
                    <HStack
                      px={4}
                      py={3}
                      gap={3}
                      cursor="pointer"
                      _hover={{ bg: "blue.50" }}
                      bg={item.active ? "blue.50" : "transparent"}
                      color={item.active ? accentBlue : textPrimary}
                      borderRight={item.active ? "3px solid" : "none"}
                      borderRightColor={item.active ? accentBlue : "transparent"}
                      transition="all 0.2s"
                      onClick={() => item.subItems ? toggleItem(item.name) : null}
                    >
                      <Icon as={item.icon} />
                      {!sidebarCollapsed && (
                        <>
                          <Text fontSize="sm" fontWeight={item.active ? "semibold" : "normal"}>
                            {item.name}
                          </Text>
                          {item.subItems && (
                            <Icon 
                              as={expandedItems.has(item.name) ? FaChevronDown : FaChevronRight} 
                              ml="auto" 
                              color={textSecondary}
                              transition="transform 0.2s"
                              transform={expandedItems.has(item.name) ? "rotate(0deg)" : "rotate(0deg)"}
                            />
                          )}
                        </>
                      )}
                    </HStack>
                  )}
                  {item.subItems && expandedItems.has(item.name) && !sidebarCollapsed && (
                    <VStack gap={0} align="stretch" pl={8}>
                      {item.subItems.map((subItem, subIndex) => (
                        <Box
                          key={subIndex}
                          px={4}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: "gray.100" }}
                          transition="all 0.2s"
                        >
                          <Text fontSize="xs" color={textSecondary}>
                            {subItem}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        {/* Account Section */}
        <Box mt="auto" borderTop="1px" borderColor={borderColor}>
          {/* ACCOUNT Header */}
          {!sidebarCollapsed && (
            <Box px={4} py={2}>
              <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                ACCOUNT
              </Text>
            </Box>
          )}
          
          {/* Help, Plans, Settings */}
          <VStack gap={0} align="stretch">
            <HStack
              px={4}
              py={3}
              gap={3}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
            >
              <Icon as={FaQuestionCircle} color={textSecondary} />
              {!sidebarCollapsed && <Text fontSize="sm" color={textPrimary}>Help</Text>}
            </HStack>
            <HStack
              px={4}
              py={3}
              gap={3}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
            >
              <Icon as={FaCrown} color={textSecondary} />
              {!sidebarCollapsed && <Text fontSize="sm" color={textPrimary}>Plans</Text>}
            </HStack>
            <HStack
              px={4}
              py={3}
              gap={3}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
            >
              <Icon as={FaCog} color={textSecondary} />
              {!sidebarCollapsed && <Text fontSize="sm" color={textPrimary}>Settings</Text>}
            </HStack>
          </VStack>

          {/* User Profile */}
          <Box px={4} py={3} borderTop="1px" borderColor={borderColor}>
            <HStack gap={3} align="center">
              <Box
                w="32px"
                h="32px"
                borderRadius="full"
                bg="blue.500"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="sm"
                fontWeight="semibold"
              >
                RH
              </Box>
              {!sidebarCollapsed && (
                <VStack gap={0} align="start" flex={1}>
                  <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                    Ramil Hardy
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    ramilhardy@gmail.com
                  </Text>
                </VStack>
              )}
              {!sidebarCollapsed && (
                <Icon as={FaChevronDown} color={textSecondary} />
              )}
            </HStack>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        ml={{ base: 0, lg: sidebarCollapsed ? "80px" : "280px" }}
        mt="80px"
        p={6}
        transition="margin-left 0.3s ease"
      >
        {children}
      </Box>

      {/* Mobile Drawer */}
      <Drawer.Root open={open} onOpenChange={({ open }) => !open && onClose()} placement="start">
        <DrawerContent>
          <DrawerHeader borderBottom="1px" borderColor={borderColor}>
            <HStack justify="space-between" align="center">
              <HStack gap={3}>
                <Icon as={FaBriefcase} color={accentBlue} />
                <Text fontWeight="semibold" color={textPrimary}>FreelanceMitra</Text>
              </HStack>
              <IconButton
                variant="ghost"
                aria-label="Sign Out"
                onClick={() => signOut({ callbackUrl: '/signin' })}
                _hover={{ bg: "red.50", color: "red.600" }}
                transition="all 0.2s"
                size="sm"
              >
                <Icon as={FaSignOutAlt} color={textSecondary} />
              </IconButton>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            {/* Mobile Search and Filter Section */}
            <Box p={4} borderBottom="1px" borderColor={borderColor}>
              <VStack gap={3} align="stretch">
                {/* Search Input */}
                <Box position="relative">
                  <input
                    type="text"
                    placeholder="Search features..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingLeft: '40px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      color: '#1a202c'
                    }}
                  />
                  <Icon
                    as={FaSearch}
                    position="absolute"
                    left="12px"
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    fontSize="14px"
                  />
                </Box>
                
                {/* Filter Input */}
                <Box position="relative">
                  <input
                    type="text"
                    placeholder="Filter by category"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingLeft: '40px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      color: '#1a202c'
                    }}
                  />
                  <Icon
                    as={FaFilter}
                    position="absolute"
                    left="12px"
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    fontSize="14px"
                  />
                </Box>
              </VStack>
            </Box>

            {/* Mobile navigation content */}
            <VStack gap={0} align="stretch">
              {navigationItems.map((section, sectionIndex) => (
                <Box key={sectionIndex}>
                  <Box px={4} py={2}>
                    <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                      {section.section}
                    </Text>
                  </Box>
                  {section.items.map((item, itemIndex) => (
                    <Box key={itemIndex}>
                      {item.route ? (
                        <Link href={item.route} style={{ textDecoration: 'none' }}>
                          <HStack
                            px={4}
                            py={3}
                            gap={3}
                            cursor="pointer"
                            _hover={{ bg: "blue.50" }}
                            onClick={() => onClose()}
                            color={item.active ? accentBlue : textPrimary}
                            transition="all 0.2s"
                          >
                            <Icon as={item.icon} />
                            <Text fontSize="sm">{item.name}</Text>
                            {item.subItems && (
                              <Icon 
                                as={expandedItems.has(item.name) ? FaChevronDown : FaChevronRight} 
                                ml="auto" 
                                color={textSecondary}
                                transition="transform 0.2s"
                              />
                            )}
                          </HStack>
                        </Link>
                      ) : (
                        <HStack
                          px={4}
                          py={3}
                          gap={3}
                          cursor="pointer"
                          _hover={{ bg: "blue.50" }}
                          onClick={() => {
                            if (item.subItems) {
                              toggleItem(item.name);
                            } else {
                              onClose();
                            }
                          }}
                          color={item.active ? accentBlue : textPrimary}
                          transition="all 0.2s"
                        >
                          <Icon as={item.icon} />
                          <Text fontSize="sm">{item.name}</Text>
                          {item.subItems && (
                            <Icon 
                              as={expandedItems.has(item.name) ? FaChevronDown : FaChevronRight} 
                              ml="auto" 
                              color={textSecondary}
                              transition="transform 0.2s"
                            />
                          )}
                        </HStack>
                      )}
                      {item.subItems && expandedItems.has(item.name) && (
                        <VStack gap={0} align="stretch" pl={8}>
                          {item.subItems.map((subItem, subIndex) => (
                            <Box
                              key={subIndex}
                              px={4}
                              py={2}
                              cursor="pointer"
                              _hover={{ bg: "gray.100" }}
                              onClick={onClose}
                              transition="all 0.2s"
                            >
                              <Text fontSize="xs" color={textSecondary}>
                                {subItem}
                              </Text>
                            </Box>
                          ))}
                        </VStack>
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
            </VStack>

            {/* Mobile Account Section */}
            <Box mt="auto" borderTop="1px" borderColor={borderColor}>
              {/* ACCOUNT Header */}
              <Box px={4} py={2}>
                <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                  ACCOUNT
                </Text>
              </Box>
              
              {/* Help, Plans, Settings */}
              <VStack gap={0} align="stretch">
                <HStack
                  px={4}
                  py={3}
                  gap={3}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  transition="all 0.2s"
                  onClick={onClose}
                >
                  <Icon as={FaQuestionCircle} color={textSecondary} />
                  <Text fontSize="sm" color={textPrimary}>Help</Text>
                </HStack>
                <HStack
                  px={4}
                  py={3}
                  gap={3}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  transition="all 0.2s"
                  onClick={onClose}
                >
                  <Icon as={FaCrown} color={textSecondary} />
                  <Text fontSize="sm" color={textPrimary}>Plans</Text>
                </HStack>
                <HStack
                  px={4}
                  py={3}
                  gap={3}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  transition="all 0.2s"
                  onClick={onClose}
                >
                  <Icon as={FaCog} color={textSecondary} />
                  <Text fontSize="sm" color={textPrimary}>Settings</Text>
                </HStack>
              </VStack>

              {/* User Profile */}
              <Box px={4} py={3} borderTop="1px" borderColor={borderColor}>
                <HStack gap={3} align="center">
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg="blue.500"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    RH
                  </Box>
                  <VStack gap={0} align="start" flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Ramil Hardy
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      ramilhardy@gmail.com
                    </Text>
                  </VStack>
                  <Icon as={FaChevronDown} color={textSecondary} />
                </HStack>
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer.Root>
    </Box>
  );
}
