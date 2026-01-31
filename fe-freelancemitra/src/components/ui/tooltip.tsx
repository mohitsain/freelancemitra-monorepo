import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react"
import * as React from "react"

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  contentProps?: ChakraTooltip.ContentProps
  disabled?: boolean
}

const defaultContentProps: ChakraTooltip.ContentProps = {
  px: 3,
  py: 2,
  borderRadius: "md",
  bg: "gray.800",
  color: "white",
  fontSize: "sm",
  fontWeight: "medium",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
  border: "1px solid",
  borderColor: "gray.600",
  maxW: "xs",
  zIndex: 50,
  _dark: {
    bg: "gray.700",
    color: "white",
    borderColor: "gray.500",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  },
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow = true,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props

    if (disabled) return children

    return (
      <ChakraTooltip.Root positioning={{ placement: "top" }} openDelay={200} closeDelay={100} {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...defaultContentProps} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  },
)
