"use client"

import {
  Box,
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

const TOAST_DURATION_MS = 5000

/** Keyframes for toast validity progress bar (100% -> 0% over duration) */
const toastProgressKeyframes = `
  @keyframes toast-progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  duration: 5000,
})

/** Show a success toast. */
export function toastSuccess(title: string, description?: string) {
  toaster.create({
    title,
    description: description ?? undefined,
    type: "success",
  })
}

/** Show an error toast. */
export function toastError(title: string, description?: string) {
  toaster.create({
    title,
    description: description ?? undefined,
    type: "error",
  })
}

/** Show a loading toast (e.g. while submitting). Returns an id to update/dismiss later. */
export function toastLoading(title: string, description?: string) {
  return toaster.create({
    title,
    description: description ?? undefined,
    type: "loading",
    duration: Infinity,
  })
}

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster
        toaster={toaster}
        position="fixed"
        insetBlockStart="4"
        insetBlockEnd="auto"
        insetInlineStart="auto"
        insetInlineEnd="4"
        width="auto"
        maxWidth={{ base: "calc(100vw - 2rem)", md: "sm" }}
        zIndex="toast"
        gap="3"
      >
        {(toast) => {
          const isTimed = toast.type === "success" || toast.type === "error"
          const durationMs = typeof (toast as { duration?: number }).duration === "number"
            ? (toast as { duration: number }).duration
            : TOAST_DURATION_MS
          const hasDuration = isTimed && durationMs !== Infinity && durationMs > 0
          const durationSec = hasDuration ? durationMs / 1000 : TOAST_DURATION_MS / 1000
          return (
            <Toast.Root
              width={{ base: "full", md: "sm" }}
              minWidth="320px"
              maxWidth={{ base: "calc(100vw - 2rem)", md: "400px" }}
              px={5}
              py={4}
              gap={4}
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="border.emphasized"
              position="relative"
              overflow="hidden"
            >
              <style>{toastProgressKeyframes}</style>
              {toast.type === "loading" ? (
                <Spinner size="sm" color="blue.solid" flexShrink={0} />
              ) : (
                <Toast.Indicator flexShrink={0} />
              )}
              <Stack gap={1.5} flex="1" maxWidth="100%" minW={0}>
                {toast.title && (
                  <Toast.Title fontSize="md" fontWeight="semibold" lineHeight="tight">
                    {toast.title}
                  </Toast.Title>
                )}
                {toast.description && (
                  <Toast.Description
                    fontSize="sm"
                    lineHeight="1.4"
                    mt={0.5}
                    color={toast.type === "success" || toast.type === "error" ? "white" : "fg.muted"}
                  >
                    {toast.description}
                  </Toast.Description>
                )}
              </Stack>
              {toast.action && (
                <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
              )}
              {toast.closable && <Toast.CloseTrigger />}
              {/* Validity progress bar: depletes over toast duration */}
              {hasDuration && (
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  height="3px"
                  bg="blackAlpha.200"
                  _dark={{ bg: "whiteAlpha.200" }}
                  overflow="hidden"
                  borderBottomRadius="xl"
                >
                  <Box
                    height="100%"
                    width="100%"
                    bg={toast.type === "success" ? "whiteAlpha.600" : toast.type === "error" ? "whiteAlpha.600" : "blue.400"}
                    animation={`toast-progress ${durationSec}s linear forwards`}
                    transformOrigin="left"
                  />
                </Box>
              )}
            </Toast.Root>
          )
        }}
      </ChakraToaster>
    </Portal>
  )
}
