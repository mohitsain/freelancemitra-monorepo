"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  Stack,
  Spinner,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { uploadButtonStyles } from "@/lib/onboarding-form-styles";
import { uploadOnboardingFile, getDisplayUrl } from "@/lib/upload-api";
import { toastError, toastSuccess } from "@/components/ui/toaster";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number): string {
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

export interface SingleFileUploadProps {
  file: UploadedFileEntry | null;
  onFileChange: (file: UploadedFileEntry | null) => void;
  accept?: string;
  category?: "profile" | "projects";
}

export default function SingleFileUpload({
  file,
  onFileChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  category = "projects",
}: SingleFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file?.key || (!file.key.startsWith("users/") && !file.key.startsWith("onboarding/"))) return;
    getDisplayUrl(file.key)
      .then((url) => setDisplayUrl(url))
      .catch(() => {});
  }, [file?.key]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? e.target.files[0] : null;
    e.target.value = "";
    if (!selected) return;
    if (selected.size > MAX_BYTES) {
      toastError(`"${selected.name}" is too large. Max size is ${formatBytes(MAX_BYTES)}.`);
      return;
    }
    setUploading(true);
    try {
      const key = await uploadOnboardingFile(selected, category);
      onFileChange({ key, size: selected.size });
      toastSuccess("File uploaded.");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    setDisplayUrl(null);
  };

  return (
    <Box>
      <Stack gap={2}>
        {file && (
          <HStack
            py={2}
            px={3}
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            bg="gray.50"
            _dark={{ borderColor: "gray.600", bg: "gray.700" }}
            maxW="100%"
            flexWrap="wrap"
            gap={2}
          >
            <Box
              border="1px"
              borderColor="gray.300"
              _dark={{ borderColor: "gray.500" }}
              borderRadius="md"
              px={2}
              py={1}
              minW={0}
              flex={1}
            >
              <Text fontSize="sm" fontWeight="medium" noOfLines={1} title={getFileNameFromKey(file.key)}>
                {getFileNameFromKey(file.key) || "File"}
              </Text>
            </Box>
            <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
              {formatBytes(file.size)}
            </Text>
            {displayUrl && (
              <Link
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="sm"
                color="blue.600"
                _dark={{ color: "blue.300" }}
              >
                View
              </Link>
            )}
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Remove file"
              onClick={handleRemove}
              minW={6}
              h={6}
              color="gray.500"
              _hover={{ color: "red.500", bg: "red.50" }}
              _dark={{ _hover: { color: "red.300", bg: "red.900" } }}
            >
              ×
            </IconButton>
          </HStack>
        )}
        <HStack gap={2} align="center" flexWrap="wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={uploading || !!file}
            onClick={() => document.getElementById("single-file-upload-input")?.click()}
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
            ) : file ? (
              <Text fontSize="sm">Replace file</Text>
            ) : (
              <Text fontSize="sm">Choose file (max {formatBytes(MAX_BYTES)})</Text>
            )}
          </Button>
          <input
            id="single-file-upload-input"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
            Max 10 MB
          </Text>
        </HStack>
      </Stack>
    </Box>
  );
}
