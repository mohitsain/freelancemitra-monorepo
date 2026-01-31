/**
 * Shared border styles for onboarding inputs, textareas, and dropdown triggers.
 * Use throughout onboarding so all form controls show clear, visible borders.
 */

export const inputBorderStyles = {
  border: "2px solid",
  borderColor: "gray.300",
  borderRadius: "lg",
  _dark: { borderColor: "gray.500" },
  _focus: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
    _dark: { borderColor: "blue.400" },
  },
  _hover: { borderColor: "gray.400", _dark: { borderColor: "gray.400" } },
};

/** Same as inputBorderStyles; use for Textarea */
export const textareaBorderStyles = { ...inputBorderStyles };

/** For dropdown trigger Buttons - visible border matching inputs */
export const dropdownTriggerBorderStyles = {
  border: "2px solid",
  borderColor: "gray.300",
  borderRadius: "lg",
  _dark: { borderColor: "gray.500" },
  _focus: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
    _dark: { borderColor: "blue.400" },
  },
  _hover: { borderColor: "gray.400", _dark: { borderColor: "gray.400" } },
};

/** Search input inside dropdowns - same border/size/padding as other inputs */
export const dropdownSearchInputStyles = {
  size: "md" as const,
  borderRadius: "lg",
  border: "2px solid",
  borderColor: "gray.300",
  px: 4,
  py: 3,
  _dark: { borderColor: "gray.500", bg: "gray.700" },
  _focus: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
    _dark: { borderColor: "blue.400" },
  },
  _hover: { borderColor: "gray.400", _dark: { borderColor: "gray.400" } },
};

/** Wrapper padding for dropdown search box - consistent spacing */
export const dropdownSearchWrapperStyles = { p: 3, borderBottom: "1px", borderColor: "gray.200", _dark: { borderColor: "gray.600" } };

/** Upload / file buttons that sit next to inputs - same height and border as inputs */
export const uploadButtonStyles = {
  size: "lg" as const,
  px: 6,
  py: 3,
  borderRadius: "lg",
  border: "2px solid",
  borderColor: "gray.300",
  _dark: { borderColor: "gray.500", bg: "gray.700" },
  _focus: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
    _dark: { borderColor: "blue.400" },
  },
  _hover: { borderColor: "gray.400", _dark: { borderColor: "gray.400" } },
};

/** "Add another" block buttons (e.g. Add Another Position, Add portfolio sample) */
export const addBlockButtonStyles = {
  size: "lg" as const,
  w: "full" as const,
  borderWidth: "2px",
  borderRadius: "xl",
  py: 6,
  fontSize: "lg",
  fontWeight: "semibold",
};

/** "+ Add" section header buttons (top-right of each section) - consistent across onboarding */
export const addSectionButtonStyles = {
  variant: "outline" as const,
  size: "sm" as const,
  w: "auto" as const,
  flexShrink: 0,
  borderWidth: "2px",
  borderRadius: "xl",
  px: 4,
  py: 2,
  fontWeight: "semibold",
  _hover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(66, 153, 225, 0.25)",
  },
  transition: "all 0.2s",
};
