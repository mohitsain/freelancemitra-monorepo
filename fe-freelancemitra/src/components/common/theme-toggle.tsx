"use client";
import React from "react";
import { useColorMode } from "../ui/color-mode";
import { IconButton, ClientOnly, Skeleton } from "@chakra-ui/react";
import { ColorModeIcon } from "../ui/color-mode";

const ThemeToggle = () => {
    const { toggleColorMode } = useColorMode();
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" borderRadius="md" />}>
            <IconButton
                variant="ghost"
                onClick={toggleColorMode}
                aria-label="Toggle color mode"
                size="sm"
                _hover={{ bg: "gray.100" }}
                transition="all 0.2s"
            >
                <ColorModeIcon />
            </IconButton>
        </ClientOnly>
    );
};

export default ThemeToggle;
