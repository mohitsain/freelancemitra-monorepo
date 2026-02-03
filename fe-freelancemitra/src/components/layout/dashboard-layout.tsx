'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, 
  HStack, 
  VStack, 
  Text, 
  Icon, 
  IconButton, 
  Image,
  Spinner,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Menu,
  Portal,
  Separator
} from '@chakra-ui/react';
import { 
  FaRocket, 
  FaUserTie, 
  FaFileInvoiceDollar, 
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
  FaUser
} from 'react-icons/fa';
import ThemeToggle from '@/components/common/theme-toggle';
import { useColorMode } from '@/components/ui/color-mode';
import { useBasicUserInfo } from '@/hooks/use-user-queries';
import { useOnboardingStatus } from '@/hooks/use-onboarding-queries';

/** Abbreviation from first letter of first name + first letter of last name. */
function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
  if (!lastName) return firstName.slice(0, 2).toUpperCase();
  return (firstName[0] + lastName[0]).toUpperCase();
}

/** Profile picture from S3 or initials circle - reduced display size for avatars. */
function UserAvatar(props: {
  profilePictureUrl: string | null;
  initials: string;
  size: string | number;
  accentBlue: string;
}) {
  const { profilePictureUrl, initials, size, accentBlue } = props;
  const common = {
    w: size,
    h: size,
    minW: size,
    minH: size,
    borderRadius: 'full',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  };
  if (profilePictureUrl) {
    return (
      <Image src={profilePictureUrl} alt="" {...common} fit="cover" loading="lazy" />
    );
  }
  return (
    <Box {...common} bg={accentBlue} color="white" fontSize="sm" fontWeight="semibold">
      {initials}
    </Box>
  );
}

/** Shared account menu content: Profile, Plan, Account settings, Sign Out (same Sign Out icon as onboarding). */
function AccountMenuContent(props: {
  profilePictureUrl: string | null;
  userInitials: string;
  userName: string;
  userRole: string;
  textPrimary: string;
  textSecondary: string;
  accentBlue: string;
}) {
  const { profilePictureUrl, userInitials, userName, userRole, textPrimary, textSecondary, accentBlue } = props;
  return (
    <>
      <VStack gap={0} align="stretch" py={4} px={4}>
        <HStack gap={3} align="center">
          <UserAvatar profilePictureUrl={profilePictureUrl} initials={userInitials} size="40px" accentBlue={accentBlue} />
          <VStack gap={0} align="start" flex={1} minW={0}>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} lineClamp={1}>
              {userName}
            </Text>
            <Text fontSize="xs" color={textSecondary}>{userRole}</Text>
          </VStack>
        </HStack>
      </VStack>
      <Separator />
      <Box py={1}>
        <Menu.Item value="profile" asChild>
          <Link href="/profile">
            <HStack gap={3} px={3} py={2}>
              <Icon as={FaUser} color={textSecondary} fontSize="sm" />
              <Text fontSize="sm" color={textPrimary}>Profile</Text>
            </HStack>
          </Link>
        </Menu.Item>
        <Menu.Item value="plan" asChild>
          <Link href="/plan">
            <HStack gap={3} px={3} py={2}>
              <Icon as={FaCrown} color={textSecondary} fontSize="sm" />
              <Text fontSize="sm" color={textPrimary}>Plan</Text>
            </HStack>
          </Link>
        </Menu.Item>
        <Menu.Item value="settings" asChild>
          <Link href="/">
            <HStack gap={3} px={3} py={2}>
              <Icon as={FaCog} color={textSecondary} fontSize="sm" />
              <Text fontSize="sm" color={textPrimary}>Account settings</Text>
            </HStack>
          </Link>
        </Menu.Item>
        <Menu.Item value="help" asChild>
          <Link href="/help">
            <HStack gap={3} px={3} py={2}>
              <Icon as={FaQuestionCircle} color={textSecondary} fontSize="sm" />
              <Text fontSize="sm" color={textPrimary}>Help</Text>
            </HStack>
          </Link>
        </Menu.Item>
      </Box>
      <Separator />
      <Box py={1}>
        <Menu.Item
          value="logout"
          onClick={() => signOut({ callbackUrl: '/signin' })}
          _highlighted={{ bg: 'red.50', color: 'red.600' }}
        >
          <HStack gap={3} px={3} py={2}>
            <Icon as={FaSignOutAlt} color="inherit" fontSize="sm" />
            <Text fontSize="sm">Sign Out</Text>
          </HStack>
        </Menu.Item>
      </Box>
    </>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type GeneralItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  subItems: readonly string[] | undefined;
};
const GENERAL_ITEMS: GeneralItem[] = [
  { name: 'Dashboard', icon: FaChartLine, route: '/', subItems: undefined },
  { name: 'Portfolio', icon: FaRocket, route: '/portfolio-creation', subItems: ['Templates', 'AI Builder', 'Customization'] },
  { name: 'Proposal Building', icon: FaFileAlt, route: '/proposal-building', subItems: ['AI Generator', 'Templates', 'Analytics'] },
  { name: 'Lead Management', icon: FaUserTie, route: '/lead-management', subItems: ['Lead Scoring', 'CRM', 'Follow-ups'] },
  { name: 'Invoice Generation', icon: FaFileInvoiceDollar, route: '/invoice-generation', subItems: ['Create Invoice', 'Payment Tracking', 'Reports'] },
  { name: 'Extensions', icon: FaTools, route: '/extensions', subItems: ['LinkedIn', 'Upwork', 'Behance'] },
  { name: 'Integrations', icon: FaPlug, route: '/integrations', subItems: ['API Keys', 'Webhooks', 'Third-party Apps'] },
];

const PREFETCH_ROUTES = [
  '/',
  '/profile',
  '/portfolio-creation',
  '/proposal-building',
  '/lead-management',
  '/invoice-generation',
  '/extensions',
  '/integrations',
  '/help',
  '/plan',
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { colorMode } = useColorMode();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { data: onboardingStatus, isLoading: onboardingLoading, isError: onboardingError } = useOnboardingStatus({
    enabled: sessionStatus === 'authenticated',
    staleTime: 0,
  });

  // Treat "no status yet" or "not completed" as must redirect to onboarding (undefined = not completed)
  const onboardingNotCompleted =
    onboardingError || onboardingStatus === undefined || !onboardingStatus.completed;

  // Unauthorized or onboarding not completed: do not show any left-menu pages
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      const callbackUrl = pathname && pathname !== '/' ? encodeURIComponent(pathname) : undefined;
      router.replace(callbackUrl ? `/signin?callbackUrl=${callbackUrl}` : '/signin');
      return;
    }
    if (sessionStatus !== 'authenticated') return;
    if (onboardingLoading) return;
    if (onboardingNotCompleted) {
      router.replace('/onboarding');
    }
  }, [sessionStatus, onboardingLoading, onboardingNotCompleted, pathname, router]);

  // All hooks must run unconditionally (before any early return) to satisfy Rules of Hooks
  // Prefetch all sidebar routes on mount so first click is fast
  useEffect(() => {
    PREFETCH_ROUTES.forEach((href) => router.prefetch(href));
  }, [router]);
  const { open, onOpen, onClose } = useDisclosure();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const accountRoutes = ['/profile', '/plan', '/help'];
  useEffect(() => {
    if (accountRoutes.includes(pathname)) {
      setSidebarCollapsed(true);
    }
  }, [pathname]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const { data: basicUserInfo } = useBasicUserInfo();
  const displayName = basicUserInfo?.name ?? session?.user?.name ?? 'User';
  const displayEmail = basicUserInfo?.email ?? session?.user?.email ?? '';
  const profilePictureUrl = basicUserInfo?.profilePictureUrl ?? null;
  const userRole = basicUserInfo?.role ?? 'Freelancer';
  const userInitials = useMemo(() => getInitials(displayName), [displayName]);
  const userName = displayName;
  const userEmail = displayEmail;

  const theme = useMemo(() => ({
    bgColor: colorMode === 'dark' ? 'gray.900' : 'gray.50',
    cardBg: colorMode === 'dark' ? 'gray.800' : 'white',
    borderColor: colorMode === 'dark' ? 'gray.700' : 'gray.200',
    textPrimary: colorMode === 'dark' ? 'white' : 'gray.800',
    textSecondary: colorMode === 'dark' ? 'gray.300' : 'gray.600',
    textTertiary: colorMode === 'dark' ? 'gray.400' : 'gray.500',
    accentBlue: 'blue.500' as const,
  }), [colorMode]);

  const { bgColor, cardBg, borderColor, textPrimary, textSecondary, textTertiary, accentBlue } = theme;

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    []
  );

  type NavItemWithActive = GeneralItem & { active: boolean };
  const navigationItems = useMemo(
    (): { section: string; items: NavItemWithActive[] }[] => [
      {
        section: 'General',
        items: GENERAL_ITEMS.map((item) => ({
          ...item,
          active: pathname === item.route,
        })),
      },
    ],
    [pathname]
  );

  const toggleItem = useCallback((itemName: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemName)) next.delete(itemName);
      else next.add(itemName);
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Early returns for loading/redirect UI only after all hooks have run
  if (sessionStatus === 'unauthenticated') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} />
          <Text color="gray.500" fontSize="sm">Redirecting to sign in…</Text>
        </Box>
      </Box>
    );
  }
  if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && onboardingLoading)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} />
          <Text color="gray.500" fontSize="sm">Loading…</Text>
        </Box>
      </Box>
    );
  }
  if (sessionStatus === 'authenticated' && onboardingNotCompleted) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} />
          <Text color="gray.500" fontSize="sm">Redirecting to onboarding…</Text>
        </Box>
      </Box>
    );
  }

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
            <Image src="/FreelanceMitraIcon.png" alt="FreelanceMitra" w="48px" h="48px" fit="contain" flexShrink={0} />
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
            
            <Menu.Root positioning={{ placement: 'bottom-end' }} closeOnSelect={false}>
              <Menu.Trigger asChild>
                <Box
                  as="button"
                  w="36px"
                  h="36px"
                  flexShrink={0}
                  cursor="pointer"
                  _hover={{ opacity: 0.9 }}
                  _active={{ opacity: 0.85 }}
                  transition="all 0.2s"
                  aria-label="Open account menu"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <UserAvatar profilePictureUrl={profilePictureUrl} initials={userInitials} size="36px" accentBlue={accentBlue} />
                </Box>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    minW="280px"
                    maxW="320px"
                    py={0}
                    borderRadius="lg"
                    boxShadow="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    bg={cardBg}
                  >
                    <AccountMenuContent
                      profilePictureUrl={profilePictureUrl}
                      userInitials={userInitials}
                      userName={userName}
                      userRole={userRole}
                      textPrimary={textPrimary}
                      textSecondary={textSecondary}
                      accentBlue={accentBlue}
                    />
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        </HStack>
      </Box>

      {/* Sidebar - flex column so account section sticks to bottom */}
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
        display={{ base: "none", lg: "flex" }}
        flexDirection="column"
      >
        {/* Sidebar Header - General label and collapse arrow aligned */}
        <Box px={4} py={3} borderBottom="1px" borderColor={borderColor}>
          <HStack justify={sidebarCollapsed ? "center" : "space-between"} align="center" gap={2}>
            {!sidebarCollapsed && (
              <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                GENERAL
              </Text>
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

        {/* Navigation Items */}
        <Box as="nav" flex={1} overflowY="auto" px={2} aria-label="Main">
          {navigationItems.map((section) => (
            <Box key={section.section}>
              {!sidebarCollapsed && section.section !== 'General' && (
                <Box px={4} py={2}>
                  <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                    {section.section}
                  </Text>
                </Box>
              )}
              {section.items.map((item) => (
                <Box key={item.route}>
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
                        <Box w="32px" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                          <Icon as={item.icon} />
                        </Box>
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
                      <Box w="32px" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                        <Icon as={item.icon} />
                      </Box>
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
                      {item.subItems.map((subItem) => (
                        <Box
                          key={`${item.route}-${subItem}`}
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

        {/* Account Section - same horizontal inset as nav (px={2}) so GENERAL and ACCOUNT align */}
        <Box mt="auto" borderTop="1px" borderColor={borderColor} px={2}>
          {/* ACCOUNT Header */}
          {!sidebarCollapsed && (
            <Box px={4} py={2}>
              <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                ACCOUNT
              </Text>
            </Box>
          )}
          
          {/* Plans, Settings, Help - same icon column width (32px) and padding as General items */}
          <VStack gap={0} align="stretch">
            <Link href="/plan" style={{ textDecoration: 'none' }}>
              <HStack
                px={4}
                py={3}
                gap={3}
                _hover={{ bg: "gray.100" }}
                transition="all 0.2s"
              >
                <Box w="32px" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                  <Icon as={FaCrown} color={textSecondary} />
                </Box>
                {!sidebarCollapsed && <Text fontSize="sm" color={textPrimary}>Plans</Text>}
              </HStack>
            </Link>
            <HStack
              px={4}
              py={3}
              gap={3}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              transition="all 0.2s"
            >
              <Box w="32px" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                <Icon as={FaCog} color={textSecondary} />
              </Box>
              {!sidebarCollapsed && <Text fontSize="sm" color={textPrimary}>Settings</Text>}
            </HStack>
            <Link href="/help" style={{ textDecoration: 'none' }}>
              <HStack
                px={4}
                py={3}
                gap={3}
                _hover={{ bg: "gray.100" }}
                transition="all 0.2s"
              >
                <Box w="32px" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                  <Icon as={FaQuestionCircle} color={textSecondary} />
                </Box>
                {!sidebarCollapsed && <Text fontSize="sm" color={textPrimary}>Help</Text>}
              </HStack>
            </Link>
          </VStack>

          {/* User Profile - clickable, opens account menu (same as top bar) */}
          <Menu.Root positioning={{ placement: 'right-start' }} closeOnSelect={false}>
            <Menu.Trigger asChild>
              <Box
                as="button"
                w="full"
                px={4}
                py={3}
                borderTop="1px"
                borderColor={borderColor}
                textAlign="left"
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
                transition="all 0.2s"
                aria-label="Open account menu"
              >
                <HStack gap={3} align="center">
                  <UserAvatar profilePictureUrl={profilePictureUrl} initials={userInitials} size="28px" accentBlue={accentBlue} />
                  {!sidebarCollapsed && (
                    <VStack gap={0} align="start" flex={1} minW={0}>
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary} lineClamp={1}>
                        {userName}
                      </Text>
                      <Text fontSize="xs" color={textSecondary} lineClamp={1}>
                        {userEmail || userRole}
                      </Text>
                    </VStack>
                  )}
                </HStack>
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content
                  minW="280px"
                  maxW="320px"
                  py={0}
                  borderRadius="lg"
                  boxShadow="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  bg={cardBg}
                >
                  <AccountMenuContent
                    profilePictureUrl={profilePictureUrl}
                    userInitials={userInitials}
                    userName={userName}
                    userRole={userRole}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                    accentBlue={accentBlue}
                  />
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        ml={{ base: 0, lg: sidebarCollapsed ? "80px" : "280px" }}
        mt="80px"
        px={{ base: 3, md: 4 }}
        py={2}
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
                <Image src="/FreelanceMitraIcon.png" alt="FreelanceMitra" w="48px" h="48px" fit="contain" flexShrink={0} />
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
          <DrawerBody display="flex" flexDirection="column" minH={0}>
            {/* Mobile navigation content */}
            <VStack as="nav" gap={0} align="stretch" aria-label="Main" flex={1}>
              {navigationItems.map((section) => (
                <Box key={section.section}>
                  <Box px={4} py={2}>
                    <Text fontSize="xs" fontWeight="semibold" color={textTertiary} textTransform="uppercase">
                      {section.section}
                    </Text>
                  </Box>
                  {section.items.map((item) => (
                    <Box key={item.route}>
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
                          {item.subItems.map((subItem) => (
                            <Box
                              key={`${item.route}-${subItem}`}
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
              
              {/* Plans, Settings, Help */}
              <VStack gap={0} align="stretch">
                <Link href="/plan" style={{ textDecoration: 'none' }} onClick={onClose}>
                  <HStack
                    px={4}
                    py={3}
                    gap={3}
                    _hover={{ bg: "gray.100" }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaCrown} color={textSecondary} />
                    <Text fontSize="sm" color={textPrimary}>Plans</Text>
                  </HStack>
                </Link>
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
                <Link href="/help" style={{ textDecoration: 'none' }} onClick={onClose}>
                  <HStack
                    px={4}
                    py={3}
                    gap={3}
                    _hover={{ bg: "gray.100" }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaQuestionCircle} color={textSecondary} />
                    <Text fontSize="sm" color={textPrimary}>Help</Text>
                  </HStack>
                </Link>
              </VStack>

              {/* User Profile - stuck to bottom, no down arrow */}
              <Box px={4} py={3} borderTop="1px" borderColor={borderColor}>
                <HStack gap={3} align="center">
                  <UserAvatar profilePictureUrl={profilePictureUrl} initials={userInitials} size="28px" accentBlue={accentBlue} />
                  <VStack gap={0} align="start" flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      {userName}
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      {userEmail || userRole}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer.Root>
    </Box>
  );
}
