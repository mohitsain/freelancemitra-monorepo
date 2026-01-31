"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  Stack,
  Spinner,
  Link,
  IconButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { uploadButtonStyles } from "@/lib/onboarding-form-styles";
import { uploadOnboardingFile, getDisplayUrl } from "@/lib/upload-api";
import { toastError, toastSuccess } from "@/components/ui/toaster";

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024; // 25 MB

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileNameFromKey(key: string): string {
  const parts = key.split("/");
  return parts[parts.length - 1] || key;
}

export interface UploadedFileEntry {
  key: string;
  size: number;
}

export interface MultiFileUploadProps {
  files: UploadedFileEntry[];
  onFilesChange: (files: UploadedFileEntry[]) => void;
  accept?: string;
  category?: "profile" | "projects";
}

export default function MultiFileUpload({
  files,
  onFilesChange,
  accept = ".pdf,.jpg,.jpeg,.png,.mp4,.mov",
  category = "projects",
}: MultiFileUploadProps) {
  const inputId = `multi-file-${useId().replace(/:/g, "-")}`;
  const [uploading, setUploading] = useState(false);
  const [displayUrls, setDisplayUrls] = useState<Record<number, string>>({});

  const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);

  useEffect(() => {
    files.forEach((f, i) => {
      const key = f.key;
      if (!key || (!key.startsWith("users/") && !key.startsWith("onboarding/"))) return;
      getDisplayUrl(key)
        .then((url) => setDisplayUrls((prev) => ({ ...prev, [i]: url })))
        .catch(() => {});
    });
  }, [files]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (selected.length === 0) return;
    const slotsLeft = MAX_FILES - files.length;
    if (selected.length > slotsLeft) {
      toastError(`You can add at most ${slotsLeft} more file(s). Maximum ${MAX_FILES} files total.`);
      return;
    }
    const newTotalBytes = selected.reduce((sum, f) => sum + f.size, 0);
    for (const file of selected) {
      if (file.size > MAX_TOTAL_BYTES) {
        toastError(`"${file.name}" is too large. Single file must be under ${formatBytes(MAX_TOTAL_BYTES)}.`);
        return;
      }
    }
    if (totalBytes + newTotalBytes > MAX_TOTAL_BYTES) {
      toastError(`Total size must be under ${formatBytes(MAX_TOTAL_BYTES)}. Current: ${formatBytes(totalBytes)}.`);
      return;
    }
    setUploading(true);
    const added: UploadedFileEntry[] = [];
    try {
      for (const file of selected) {
        const key = await uploadOnboardingFile(file, category);
        added.push({ key, size: file.size });
      }
      onFilesChange([...files, ...added]);
      toastSuccess(added.length === 1 ? "File uploaded." : `${added.length} files uploaded.`);
    } catch (err) {
      if (added.length > 0) {
        onFilesChange([...files, ...added]);
        toastSuccess(`${added.length} file(s) uploaded; one failed.`);
      }
      toastError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
    setDisplayUrls((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const atLimit = files.length >= MAX_FILES;
  const totalAtLimit = totalBytes >= MAX_TOTAL_BYTES;

  return (
    <Box>
      <Stack gap={3}>
        {files.length > 0 && (
          <Box>
            <HStack justify="space-between" align="center" mb={1.5} flexWrap="wrap" gap={1}>
              <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                {files.length}/{MAX_FILES} files · {formatBytes(totalBytes)} / {formatBytes(MAX_TOTAL_BYTES)}
              </Text>
            </HStack>
            <Wrap spacing={2} align="center">
              {files.map((entry, index) => (
                <WrapItem key={entry.key}>
                  <HStack
                    spacing={2}
                    py={2}
                    px={3}
                    borderRadius="lg"
                    border="1px"
                    borderColor="gray.200"
                    bg="gray.50"
                    _dark={{ borderColor: "gray.600", bg: "gray.700" }}
                    maxW="100%"
                    flexShrink={0}
                    gap={2}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      noOfLines={1}
                      maxW={{ base: "140px", sm: "180px" }}
                      title={getFileNameFromKey(entry.key)}
                      flexShrink={1}
                      minW={0}
                    >
                      {getFileNameFromKey(entry.key) || `File ${index + 1}`}
                    </Text>
                    <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} flexShrink={0}>
                      {formatBytes(entry.size)}
                    </Text>
                    <HStack spacing={1} flexShrink={0}>
                      {displayUrls[index] && (
                        <Link
                          href={displayUrls[index]}
                          target="_blank"
                          rel="noopener noreferrer"
                          fontSize="sm"
                          color="blue.600"
                          _dark={{ color: "blue.300" }}
                          fontWeight="medium"
                        >
                          View
                        </Link>
                      )}
                      <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label="Remove file"
                        onClick={() => handleRemove(index)}
                        minW={7}
                        h={7}
                        color="gray.500"
                        _hover={{ color: "red.500", bg: "red.50" }}
                        _dark={{ _hover: { color: "red.300", bg: "red.900" } }}
                      >
                        ×
                      </IconButton>
                    </HStack>
                  </HStack>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
        <HStack gap={2} align="center" flexWrap="wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={uploading || atLimit || totalAtLimit}
            onClick={() => document.getElementById(inputId)?.click()}
            {...uploadButtonStyles}
            _dark={{ ...uploadButtonStyles._dark, bg: "gray.700" }}
            px={4}
            py={2}
          >
            {uploading ? (
              <HStack gap={2}>
                <Spinner size="sm" />
                <Text fontSize="sm">Uploading…</Text>
              </HStack>
            ) : atLimit ? (
              <Text fontSize="sm">Max {MAX_FILES} files</Text>
            ) : (
              <Text fontSize="sm">+ Add file(s)</Text>
            )}
          </Button>
          <input
            id={inputId}
            type="file"
            accept={accept}
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
            Up to {MAX_FILES} files, {formatBytes(MAX_TOTAL_BYTES)} total · multi-select OK
          </Text>
        </HStack>
      </Stack>
    </Box>
  );
}
