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

/** Input border styles with dark mode background (for use in inputs that need bg in dark). Avoids duplicate _dark. */
export const inputBorderStylesWithDarkBg = {
  ...inputBorderStyles,
  _dark: { ...inputBorderStyles._dark, bg: "gray.700" },
};

/** Same as inputBorderStylesWithDarkBg with white text in dark (e.g. select wrapper). Avoids duplicate _dark. */
export const inputBorderStylesWithDarkBgAndWhiteText = {
  ...inputBorderStyles,
  _dark: { ...inputBorderStyles._dark, bg: "gray.700", color: "white" },
};

/** Same as inputBorderStyles; use for Textarea */
export const textareaBorderStyles = { ...inputBorderStyles };

/** Textarea border styles with dark mode background. Avoids duplicate _dark. */
export const textareaBorderStylesWithDarkBg = {
  ...textareaBorderStyles,
  _dark: { ...textareaBorderStyles._dark, bg: "gray.700" },
};

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

/** Dropdown trigger border styles with dark mode background. Avoids duplicate _dark. */
export const dropdownTriggerBorderStylesWithDarkBg = {
  ...dropdownTriggerBorderStyles,
  _dark: { ...dropdownTriggerBorderStyles._dark, bg: "gray.700" },
};

/** Invalid input border (use with inputBorderStylesWithDarkBg so _dark is not duplicated). */
export const invalidBorderForInput = {
  borderColor: "red.500",
  _dark: { borderColor: "red.400", bg: "gray.700" },
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

/** Section card wrapper - use for all onboarding step sections (step 1 style) */
export const cardStyles = {
  p: { base: 5, md: 6 },
  bg: "white",
  borderRadius: "xl",
  border: "1px",
  borderColor: "gray.100",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  _dark: {
    bg: "gray.800",
    borderColor: "gray.700",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
  },
};

/** Spacing between sections in a step (Stack gap) */
export const sectionGap = 6;

/** Spacing between fields inside a section (Stack gap) */
export const fieldGap = 5;

/** Label above input/textarea/dropdown - consistent across steps */
export const labelStyles = {
  fontWeight: "medium" as const,
  mb: 2,
  fontSize: "sm" as const,
  color: "gray.600",
  _dark: { color: "gray.400" },
};

/** Required field asterisk - use as <Text as="span" {...requiredAsteriskStyles}>*</Text> after label text */
export const requiredAsteriskStyles = {
  as: "span" as const,
  color: "red.500",
  _dark: { color: "red.400" },
  ml: 0.5,
};

/** Input/textarea size and padding - consistent with step 1 */
export const inputSizes = {
  size: "md" as const,
  px: 4,
  py: 2.5,
};

/** Secondary (outline) button - consistent with onboarding section buttons */
export const secondaryButtonStyles = {
  variant: "outline" as const,
  size: "md" as const,
  borderRadius: "lg",
  borderWidth: "2px",
  borderColor: "gray.300",
  px: 5,
  py: 2.5,
  minW: "100px",
  fontWeight: "medium" as const,
  _dark: { borderColor: "gray.500", color: "gray.200" },
  _hover: { borderColor: "gray.400", _dark: { borderColor: "gray.400" } },
  _disabled: { opacity: 0.6, cursor: "not-allowed" },
};

/** Primary (solid) button - consistent with onboarding nav buttons */
export const primaryButtonStyles = {
  variant: "solid" as const,
  colorScheme: "blue",
  size: "md" as const,
  borderRadius: "lg",
  px: 5,
  py: 2.5,
  minW: "100px",
  fontWeight: "medium" as const,
  _disabled: { opacity: 0.6, cursor: "not-allowed" },
};
