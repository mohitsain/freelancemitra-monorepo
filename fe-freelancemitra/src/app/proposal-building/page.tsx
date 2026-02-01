"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  Textarea,
  Input,
  Grid,
  Spinner,
  Center,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
} from "@chakra-ui/react";
import { toastSuccess, toastError } from "@/components/ui/toaster";
import { useColorMode } from "@/components/ui/color-mode";
import { useState, useEffect, useCallback } from "react";
import { FaFileAlt, FaRocket, FaHistory, FaEdit, FaSave, FaInfoCircle, FaEraser, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  generateProposal,
  listProposalsPaginated,
  getProposal,
  updateProposal,
  type ProposalItem,
} from "@/lib/proposals-api";
import {
  inputBorderStylesWithDarkBg,
  inputBorderStylesWithDarkBgAndWhiteText,
  textareaBorderStylesWithDarkBg,
  labelStyles,
  requiredAsteriskStyles,
  cardStyles,
  inputSizes,
  secondaryButtonStyles,
  primaryButtonStyles,
} from "@/lib/onboarding-form-styles";

const PLATFORMS = [
  { value: "", label: "Select platform (optional)" },
  { value: "Upwork", label: "Upwork" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "PeoplePerHour", label: "PeoplePerHour" },
  { value: "Fiverr", label: "Fiverr" },
  { value: "Toptal", label: "Toptal" },
  { value: "Other", label: "Other" },
];

/** Secondary large (Clear) - same as onboarding outline but size lg and wider */
const secondaryLargeButtonProps = {
  ...secondaryButtonStyles,
  size: "lg" as const,
  px: 6,
  py: 3,
  minW: "120px",
};

const HISTORY_PAGE_SIZE = 5;

export default function ProposalBuildingPage() {
  const { colorMode } = useColorMode();
  const textPrimary = colorMode === "dark" ? "white" : "gray.800";
  const textSecondary = colorMode === "dark" ? "gray.300" : "gray.600";
  const accentBlue = colorMode === "dark" ? "blue.400" : "blue.500";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const modalBg = colorMode === "dark" ? "gray.800" : "white";
  const contentBlockBg = colorMode === "dark" ? "gray.700" : "gray.50";
  const emptyValueColor = colorMode === "dark" ? "gray.500" : "gray.400";

  const [jobDescription, setJobDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [platform, setPlatform] = useState("");
  const [jobBudget, setJobBudget] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProposal, setCurrentProposal] = useState("");
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [isEditingMain, setIsEditingMain] = useState(false);
  const [history, setHistory] = useState<ProposalItem[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingProposalId, setLoadingProposalId] = useState<string | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<ProposalItem | null>(null);
  const [detailModalLoading, setDetailModalLoading] = useState(false);
  const [savingMain, setSavingMain] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);
  const [proposalBeforeEdit, setProposalBeforeEdit] = useState("");

  /** Fixed height for main proposal content (view and edit) so layout doesn't jump */
  const proposalContentMinHeight = "320px";

  const fetchHistory = useCallback(async (page: number = 1) => {
    setLoadingHistory(true);
    try {
      const { items, total } = await listProposalsPaginated(page, HISTORY_PAGE_SIZE);
      setHistory(items);
      setHistoryTotal(total);
    } catch {
      setHistory([]);
      setHistoryTotal(0);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(historyPage);
  }, [fetchHistory, historyPage]);

  const historyTotalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PAGE_SIZE));
  const historyPageClamped = Math.min(historyPage, historyTotalPages);
  useEffect(() => {
    if (historyPage > historyTotalPages) setHistoryPage(historyTotalPages);
  }, [historyTotalPages, historyPage]);

  const selectedItem = selectedProposal ?? history.find((h) => h.id === selectedProposalId);
  // Main area shows only currentProposal (from Generate or explicit load), not when just clicking history
  const displayProposal = currentProposal;

  const handleClear = useCallback(() => {
    setJobDescription("");
    setClientName("");
    setPlatform("");
    setJobBudget("");
    setHourlyRate("");
    setCurrentProposal("");
    setSelectedProposalId(null);
    setSelectedProposal(null);
    setIsEditingMain(false);
    toastSuccess("Inputs and proposal cleared");
  }, []);

  const handleGenerate = async () => {
    const trimmed = jobDescription.trim();
    if (!trimmed) {
      toastError("Enter a job description");
      return;
    }
    setIsGenerating(true);
    setCurrentProposal("");
    setSelectedProposalId(null);
    try {
      const { proposal, id } = await generateProposal({
        job_description: trimmed,
        client_name: clientName.trim() || undefined,
        platform: platform || undefined,
        job_budget: jobBudget.trim() || undefined,
        hourly_rate: hourlyRate.trim() || undefined,
      });
      setCurrentProposal(proposal);
      setSelectedProposalId(id);
      setIsEditingMain(false);
      setHistoryPage(1);
      const { items, total } = await listProposalsPaginated(1, HISTORY_PAGE_SIZE);
      setHistory(items);
      setHistoryTotal(total);
      const newItem = items.find((i) => i.id === id) ?? items[0];
      setSelectedProposal(newItem ?? null);
      toastSuccess("Proposal generated and saved");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to generate proposal";
      toastError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateHistoryItem = useCallback(
    async (id: string, updates: Partial<ProposalItem>) => {
      try {
        const updated = await updateProposal(id, {
          proposal: updates.proposal ?? undefined,
          job_description: updates.jobDescription ?? undefined,
          client_name: updates.clientName ?? undefined,
          platform: updates.platform ?? undefined,
          job_budget: updates.jobBudget ?? undefined,
          hourly_rate: updates.hourlyRate ?? undefined,
        });
        setHistory((prev) => prev.map((h) => (h.id === id ? updated : h)));
        if (id === selectedProposalId) {
          setCurrentProposal(updated.proposal);
          setSelectedProposal(updated);
        }
        return updated;
      } catch (e) {
        toastError(e instanceof Error ? e.message : "Failed to save changes");
      }
    },
    [selectedProposalId]
  );

  const handleSaveMainProposal = useCallback(async () => {
    if (!selectedProposalId) return;
    setSavingMain(true);
    try {
      await updateHistoryItem(selectedProposalId, { proposal: currentProposal });
      setIsEditingMain(false);
      toastSuccess("Changes saved");
    } finally {
      setSavingMain(false);
    }
  }, [selectedProposalId, currentProposal, updateHistoryItem]);

  const handleSelectFromHistory = useCallback(async (item: ProposalItem) => {
    setSelectedProposalId(item.id);
    setIsEditingMain(false);
    setSelectedProposal(item);
    // Do not populate the main proposal area when clicking history — only highlight the item
  }, []);

  const openDetailModal = useCallback(async (item: ProposalItem) => {
    setDetailModalItem(item);
    setDetailModalLoading(true);
    try {
      const full = await getProposal(item.id);
      setDetailModalItem(full);
    } catch {
      // keep showing item from list
    } finally {
      setDetailModalLoading(false);
    }
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <Box px={6}>
        <Grid
          templateColumns={{
            base: "1fr",
            lg: historyExpanded ? "65% 35%" : "1fr 56px",
          }}
          gap={0}
          columnGap={{ base: 0, lg: 6 }}
          alignItems="stretch"
          maxW="100%"
        >
          {/* Left 65%: Header, form, main proposal */}
          <VStack gap={6} align="stretch" minW={0}>
            <Box>
              <HStack gap={4} mb={2}>
                <Icon as={FaFileAlt} color={accentBlue} fontSize="2xl" />
                <Heading size="lg" color={textPrimary}>
                  Proposal Generator
                </Heading>
              </HStack>
              <Text color={textSecondary} fontSize="lg">
                Enter the job description and optional details. AI will generate a personalized proposal from your profile.
              </Text>
            </Box>

            <Box {...cardStyles} p={{ base: 5, md: 6 }}>
              <VStack gap={5} align="stretch">
                <Box>
                  <Text {...labelStyles}>
                    Job description <Text {...requiredAsteriskStyles}>*</Text>
                  </Text>
                  <Textarea
                    placeholder="Paste or type the client's job description..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={5}
                    resize="vertical"
                    {...textareaBorderStylesWithDarkBg}
                    px={inputSizes.px}
                    py={inputSizes.py}
                  />
                </Box>

                <Box>
                  <Text {...labelStyles}>Client name (optional)</Text>
                  <Input
                    placeholder="e.g. Acme Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    {...inputBorderStylesWithDarkBg}
                    px={inputSizes.px}
                    py={inputSizes.py}
                  />
                </Box>

                <HStack gap={4} wrap="wrap" align="flex-end">
                  <Box flex={1} minW="140px">
                    <Text {...labelStyles}>Platform (optional)</Text>
                    <Box
                      w="100%"
                      px={inputSizes.px}
                      py={inputSizes.py}
                      fontSize="md"
                      bg="white"
                      color="gray.800"
                      {...inputBorderStylesWithDarkBgAndWhiteText}
                    >
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        style={{
                          width: "100%",
                          fontSize: "inherit",
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p.value || "none"} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </Box>
                  </Box>
                  <Box flex={1} minW="120px">
                    <Text {...labelStyles}>Job budget (optional)</Text>
                    <Input
                      placeholder="e.g. $500"
                      value={jobBudget}
                      onChange={(e) => setJobBudget(e.target.value)}
                      {...inputBorderStylesWithDarkBg}
                      px={inputSizes.px}
                      py={inputSizes.py}
                    />
                  </Box>
                  <Box flex={1} minW="120px">
                    <Text {...labelStyles}>Hourly rate (optional)</Text>
                    <Input
                      placeholder="e.g. $25/hr"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      {...inputBorderStylesWithDarkBg}
                      px={inputSizes.px}
                      py={inputSizes.py}
                    />
                  </Box>
                </HStack>

                <HStack gap={3} w="full">
                  <Button
                    {...primaryButtonStyles}
                    size="lg"
                    flex={1}
                    px={6}
                    py={3}
                    minW="160px"
                    onClick={handleGenerate}
                    loading={isGenerating}
                    loadingText="Generating..."
                  >
                    <HStack gap={2} as="span">
                      <Icon as={FaRocket} />
                      Generate proposal
                    </HStack>
                  </Button>
                  <Button
                    {...secondaryLargeButtonProps}
                    onClick={handleClear}
                    disabled={isGenerating}
                  >
                    <HStack gap={2} as="span">
                      <Icon as={FaEraser} />
                      Clear
                    </HStack>
                  </Button>
                </HStack>
              </VStack>
            </Box>

            {/* Main proposal: fixed-height area, loader when generating/loading, Edit/Save */}
            {(historyTotal > 0 || history.length > 0 || isGenerating || selectedProposalId || loadingHistory) && (
              <Box {...cardStyles} p={{ base: 5, md: 6 }}>
                <HStack
                  justify="space-between"
                  align="center"
                  mb={4}
                  gap={4}
                  flexWrap="wrap"
                  rowGap={3}
                >
                  <HStack gap={2} flex={1} minW={0} flexWrap="wrap">
                    <Icon as={FaEdit} color={accentBlue} flexShrink={0} />
                    <Heading size="md" color={textPrimary} as="h2">
                      {isGenerating
                        ? "Generating proposal…"
                        : loadingProposalId
                          ? "Loading proposal…"
                          : selectedItem
                            ? isEditingMain
                              ? "Edit proposal"
                              : "Proposal"
                            : "Proposal"}
                    </Heading>
                    {selectedItem?.clientName && !isGenerating && !loadingProposalId && (
                      <Text color={textSecondary} fontSize="sm" flexShrink={0}>
                        — {selectedItem.clientName}
                      </Text>
                    )}
                  </HStack>
                  {!isGenerating && !loadingProposalId && selectedProposalId && (
                    <HStack gap={2} flexShrink={0}>
                      {!isEditingMain ? (
                        <Button
                          {...secondaryButtonStyles}
                          onClick={() => {
                            setProposalBeforeEdit(currentProposal);
                            setIsEditingMain(true);
                          }}
                        >
                          <HStack gap={2} as="span">
                            <Icon as={FaEdit} />
                            Edit
                          </HStack>
                        </Button>
                      ) : (
                        <>
                          <Button
                            {...secondaryButtonStyles}
                            onClick={() => {
                              setIsEditingMain(false);
                              setCurrentProposal(proposalBeforeEdit);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            {...primaryButtonStyles}
                            onClick={handleSaveMainProposal}
                            loading={savingMain}
                          >
                            <HStack gap={2} as="span">
                              <Icon as={FaSave} />
                              Save changes
                            </HStack>
                          </Button>
                        </>
                      )}
                    </HStack>
                  )}
                </HStack>
                <Box minHeight={proposalContentMinHeight} position="relative">
                  {isGenerating && (
                    <Center minHeight={proposalContentMinHeight} flexDirection="column" gap={3}>
                      <Spinner size="lg" color={accentBlue} />
                      <Text color={textSecondary}>Generating your proposal…</Text>
                    </Center>
                  )}
                  {!isGenerating && loadingProposalId && (
                    <Center minHeight={proposalContentMinHeight} flexDirection="column" gap={3}>
                      <Spinner size="lg" color={accentBlue} />
                      <Text color={textSecondary}>Loading proposal…</Text>
                    </Center>
                  )}
                  {!isGenerating && !loadingProposalId && isEditingMain && (
                    <Textarea
                      value={currentProposal}
                      onChange={(e) => setCurrentProposal(e.target.value)}
                      minHeight={proposalContentMinHeight}
                      resize="vertical"
                      {...textareaBorderStylesWithDarkBg}
                      px={inputSizes.px}
                      py={inputSizes.py}
                    />
                  )}
                  {!isGenerating && !loadingProposalId && !(loadingHistory && history.length === 0) && !isEditingMain && (
                    <Box
                      minHeight={proposalContentMinHeight}
                      py={4}
                      px={5}
                      borderRadius="lg"
                      bg={contentBlockBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      overflowY="auto"
                    >
                      <Text
                        color={displayProposal ? textPrimary : emptyValueColor}
                        fontSize="sm"
                        whiteSpace="pre-wrap"
                        lineHeight="tall"
                        fontStyle={displayProposal ? undefined : "italic"}
                      >
                        {displayProposal || "Select a proposal from history or generate one above."}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </VStack>

          {/* Right: History panel — collapses to narrow strip on the right (default collapsed) */}
          <Box
            minW={0}
            {...cardStyles}
            p={historyExpanded ? 4 : 2}
            alignSelf="stretch"
            display="flex"
            flexDirection="column"
            minH={{ base: "auto", lg: historyExpanded ? "400px" : "auto" }}
            w={{ base: "full", lg: historyExpanded ? undefined : "56px" }}
            overflow="hidden"
          >
            {historyExpanded ? (
              <>
                <HStack gap={2} justify="space-between" mb={4} flexShrink={0}>
                  <HStack gap={2}>
                    <Icon as={FaHistory} color={accentBlue} />
                    <Heading size="md" color={textPrimary}>
                      Proposal history
                    </Heading>
                    {!loadingHistory && historyTotal > 0 && (
                      <Text color={textSecondary} fontSize="sm" fontWeight="normal">
                        ({historyTotal})
                      </Text>
                    )}
                  </HStack>
                  <Button
                    {...secondaryButtonStyles}
                    aria-label="Collapse history"
                    onClick={() => setHistoryExpanded(false)}
                    minW="auto"
                    px={3}
                  >
                    <Icon as={FaChevronRight} />
                  </Button>
                </HStack>

                {loadingHistory && history.length === 0 && (
                  <Center py={8} flex={1}>
                    <Text color={textSecondary} fontSize="sm">
                      Loading…
                    </Text>
                  </Center>
                )}
                {!loadingHistory && historyTotal === 0 && (
                  <Center py={8} flex={1}>
                    <Text color={textSecondary} fontSize="sm" textAlign="center">
                      No proposals yet. Generate one above.
                    </Text>
                  </Center>
                )}
                {!loadingHistory && historyTotal > 0 && (
                  <>
                    <VStack gap={3} align="stretch" flex={1} minH={0} overflowY="auto">
                      {history.map((item) => (
                    <Box
                      key={item.id}
                      p={3}
                      borderRadius="lg"
                      bg={contentBlockBg}
                      borderWidth="2px"
                      borderColor={selectedProposalId === item.id ? "blue.500" : "transparent"}
                      cursor="pointer"
                      _hover={{
                        borderColor: selectedProposalId === item.id ? "blue.500" : colorMode === "dark" ? "gray.600" : "gray.300",
                        bg: colorMode === "dark" ? "gray.700" : "gray.50",
                      }}
                      onClick={() => handleSelectFromHistory(item)}
                    >
                      <VStack align="stretch" gap={2}>
                        <Text color={textPrimary} fontWeight="medium" lineClamp={2} fontSize="sm" lineHeight="short">
                          {item.jobDescription.slice(0, 80)}
                          {item.jobDescription.length > 80 ? "…" : ""}
                        </Text>
                        {item.clientName && (
                          <Text color={textSecondary} fontSize="xs">
                            {item.clientName}
                          </Text>
                        )}
                        <Text color={textSecondary} fontSize="xs">
                          {formatDate(item.createdAt)}
                        </Text>
                        <Button
                          {...secondaryButtonStyles}
                          size="sm"
                          minW="auto"
                          px={3}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(item);
                          }}
                        >
                          <HStack gap={2} as="span">
                            <Icon as={FaInfoCircle} />
                            Complete details
                          </HStack>
                        </Button>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
                    {historyTotal > 0 && (
                      <HStack
                        gap={2}
                        mt={4}
                        pt={3}
                        borderTopWidth="1px"
                        borderColor={borderColor}
                        flexShrink={0}
                        justify="space-between"
                        wrap="wrap"
                      >
                        <Button
                          {...secondaryButtonStyles}
                          onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                          disabled={historyPageClamped <= 1}
                        >
                          <HStack gap={2} as="span">
                            <Icon as={FaChevronLeft} />
                            Prev
                          </HStack>
                        </Button>
                        <Text color={textSecondary} fontSize="sm" whiteSpace="nowrap">
                          Page {historyPageClamped} of {historyTotalPages}
                        </Text>
                        <Button
                          {...secondaryButtonStyles}
                          onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
                          disabled={historyPageClamped >= historyTotalPages}
                        >
                          <HStack gap={2} as="span">
                            Next
                            <Icon as={FaChevronRight} />
                          </HStack>
                        </Button>
                      </HStack>
                    )}
                  </>
                )}
              </>
            ) : (
              <Button
                variant="ghost"
                type="button"
                h="full"
                minH="120px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={2}
                onClick={() => setHistoryExpanded(true)}
                cursor="pointer"
                _hover={{ opacity: 0.9 }}
                aria-label="Expand proposal history"
              >
                <Icon as={FaHistory} color={accentBlue} fontSize="lg" />
                <Text
                  color={textPrimary}
                  fontSize="xs"
                  fontWeight="medium"
                  transform="rotate(-90deg)"
                  whiteSpace="nowrap"
                >
                  History
                </Text>
                <Icon as={FaChevronLeft} color={textSecondary} fontSize="sm" />
              </Button>
            )}
          </Box>
        </Grid>

        {/* Read-only details modal — standard layout, scrollable */}
        <DialogRoot
          open={!!detailModalItem}
          onOpenChange={({ open }) => !open && setDetailModalItem(null)}
        >
          <DialogBackdrop />
          <DialogPositioner
            display="flex"
            justifyContent="center"
            alignItems="center"
            minW="100vw"
            minH="100dvh"
          >
            <DialogContent
              maxH="90vh"
              maxW={{ base: "95vw", sm: "4xl", md: "5xl" }}
              w="full"
              mx="auto"
              display="flex"
              flexDirection="column"
              bg={modalBg}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="xl"
              overflow="hidden"
            >
              <DialogHeader
                flexShrink={0}
                borderBottomWidth="1px"
                borderColor={borderColor}
                py={4}
                px={{ base: 4, md: 6 }}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                gap={4}
                bg={modalBg}
              >
                <DialogTitle fontSize="lg" fontWeight="bold" color={textPrimary} flex={1} minW={0}>
                  Proposal details
                </DialogTitle>
                <DialogCloseTrigger
                  flexShrink={0}
                  aria-label="Close"
                />
              </DialogHeader>
              <DialogBody
                flex={1}
                minH={0}
                overflowY="auto"
                px={{ base: 4, md: 6 }}
                pt={5}
                pb={6}
              >
                {detailModalLoading && (
                  <Center py={10}>
                    <VStack gap={3}>
                      <Spinner size="lg" color={accentBlue} />
                      <Text color={textSecondary}>Loading details…</Text>
                    </VStack>
                  </Center>
                )}
                {detailModalItem && !detailModalLoading && (
                  <VStack align="stretch" gap={6} textAlign="left">
                    {/* Short fields in 2-column grid (1 col on small screens) */}
                    <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={5} w="full">
                      <Box>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color={textSecondary}
                          mb={2}
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          Client name
                        </Text>
                        <Text
                          color={detailModalItem.clientName ? textPrimary : emptyValueColor}
                          fontSize="sm"
                          fontStyle={detailModalItem.clientName ? undefined : "italic"}
                        >
                          {detailModalItem.clientName || "—"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color={textSecondary}
                          mb={2}
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          Platform
                        </Text>
                        <Text
                          color={detailModalItem.platform ? textPrimary : emptyValueColor}
                          fontSize="sm"
                          fontStyle={detailModalItem.platform ? undefined : "italic"}
                        >
                          {detailModalItem.platform || "—"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color={textSecondary}
                          mb={2}
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          Job budget
                        </Text>
                        <Text
                          color={detailModalItem.jobBudget ? textPrimary : emptyValueColor}
                          fontSize="sm"
                          fontStyle={detailModalItem.jobBudget ? undefined : "italic"}
                        >
                          {detailModalItem.jobBudget || "—"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color={textSecondary}
                          mb={2}
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          Hourly rate
                        </Text>
                        <Text
                          color={detailModalItem.hourlyRate ? textPrimary : emptyValueColor}
                          fontSize="sm"
                          fontStyle={detailModalItem.hourlyRate ? undefined : "italic"}
                        >
                          {detailModalItem.hourlyRate || "—"}
                        </Text>
                      </Box>
                    </Grid>

                    <Box w="full">
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={textSecondary}
                        mb={2}
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Job description
                      </Text>
                      <Box
                        py={4}
                        px={5}
                        borderRadius="lg"
                        bg={contentBlockBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Text
                          color={textPrimary}
                          whiteSpace="pre-wrap"
                          fontSize="sm"
                          lineHeight="tall"
                        >
                          {detailModalItem.jobDescription}
                        </Text>
                      </Box>
                    </Box>

                    <Box w="full">
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={textSecondary}
                        mb={2}
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Proposal
                      </Text>
                      <Box
                        py={4}
                        px={5}
                        borderRadius="lg"
                        bg={contentBlockBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Text
                          color={textPrimary}
                          whiteSpace="pre-wrap"
                          fontSize="sm"
                          lineHeight="tall"
                        >
                          {detailModalItem.proposal}
                        </Text>
                      </Box>
                    </Box>

                    <Box w="full" pt={4} borderTopWidth="1px" borderColor={borderColor}>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={textSecondary}
                        mb={2}
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Created / Updated
                      </Text>
                      <Text color={textPrimary} fontSize="sm">
                        {formatDate(detailModalItem.createdAt)} / {formatDate(detailModalItem.updatedAt)}
                      </Text>
                    </Box>
                  </VStack>
                )}
              </DialogBody>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </Box>
    </DashboardLayout>
  );
}
