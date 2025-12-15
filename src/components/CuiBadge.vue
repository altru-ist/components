<template>
  <Badge
    unstyled
    :pt="badgeTheme"
    :ptOptions="{ mergeProps: ptViewMerge }"
    :value="showContent ? value : ''"
    :aria-hidden="isDecorative"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
/**
 * Badge
 *
 * Three variants: badge (with content),
 * pill-large, and pill-small. Automatically adjusts when inside buttons.
 */

import Badge, { type BadgePassThroughOptions } from "primevue/badge";
import { computed, inject, ref } from "vue";
import { ptViewMerge } from "../volt/utils";

// Design System API
export interface CuiBadgeProps {
  /** Badge content/value */
  value?: string | number;
  /** Visual variant of the badge */
  variant?: "badge" | "pill-large" | "pill-small";
  /** Whether to show 2px white outline */
  outlined?: boolean;
  /** Whether badge is purely decorative (auto-set when in button) */
  decorative?: boolean;
}

const props = withDefaults(defineProps<CuiBadgeProps>(), {
  variant: "badge",
  outlined: false,
  decorative: false,
});

/**
 * Smart composition detection
 * When placed inside Button, we can automatically adjust behavior
 */
const isInsideButton = inject("isInsideButton", false);
const isIconOnlyButton = inject("isIconOnlyButton", ref(false));

// Design System Constraint: Icon-only buttons must use pill variants
const effectiveVariant = computed(() => {
  if (isIconOnlyButton.value && props.variant === "badge") {
    console.warn(
      "Design System Warning: Icon-only buttons should use pill variants, not badge variant. Auto-converting to pill-large.",
    );
    return "pill-large";
  }
  return props.variant;
});

/**
 * Accessibility: Set decorative mode when inside buttons
 * Prevents screen readers from announcing badge content separately
 */
const isDecorative = computed(() => {
  return props.decorative || isInsideButton;
});

/**
 * Content display logic
 * Only 'badge' variant shows text/numbers, pills are just indicators
 */
const showContent = computed(() => {
  return effectiveVariant.value === "badge" && props.value !== undefined;
});

/**
 * Determine if this badge should be positioned absolutely
 * Pill variants should be positioned absolutely when inside buttons
 */
const shouldBeAbsolute = computed(() => {
  return (
    isInsideButton &&
    (effectiveVariant.value === "pill-large" ||
      effectiveVariant.value === "pill-small")
  );
});

/**
 * Badge theme configuration using our design tokens
 */
const badgeTheme = computed<BadgePassThroughOptions>(() => {
  // Base styles for all badges
  const baseStyles = [
    "inline-flex items-center justify-center",
    "font-[var(--font-primary)]",
    "transition-all duration-[var(--ds-transition-fast)]",
    // Force consistent text rendering across all contexts
    "text-rendering-optimizeLegibility",

    // Conditional positioning and spacing
    ...(shouldBeAbsolute.value
      ? [
          // Absolute positioning for pill variants in buttons (top-right corner, adjusted 2px left and down)
          "absolute top-0 -right-0.5 z-10",
        ]
      : [
          // Regular inline spacing for badge variant
          ...(isInsideButton ? ["ml-[var(--ds-badge-gap-from-text)]"] : []),
        ]),
  ];

  // Variant-specific styles (using effectiveVariant to enforce design system rules)
  const variantStyles = {
    badge: [
      // Badge: 18px, badge color, white text 11px, round unless lots of numbers
      `bg-[var(--cui-surface-notification-badge)]`,
      "text-white",
      "text-[11px]", // 11px font size
      "font-medium",
      "leading-[1]", // Explicit line-height: 1 for consistent text positioning
      "min-w-[18px]",
      "h-[18px]",
      // Round by default, but will adjust if content is wider
      "rounded-full",
      // Custom class for precise text centering
      "badge-text-center",
      // Padding for text content
      ...(props.value && props.value.toString().length > 1
        ? ["px-1.5"]
        : ["px-0"]),
      ...(props.outlined ? ["badge-outlined"] : []),
    ],
    "pill-large": [
      // Pill-large: 9px, pill color, no text, always round
      `bg-[var(--cui-surface-notification-pill)]`,
      "w-[9px]",
      "h-[9px]",
      "rounded-full",
      "min-w-[9px]",
      // Always outlined when inside button, otherwise respect props.outlined
      ...(isInsideButton || props.outlined ? ["badge-outlined"] : []),
    ],
    "pill-small": [
      // Pill-small: 7px, pill color, no text, always round
      `bg-[var(--cui-surface-notification-pill)]`,
      "w-[7px]",
      "h-[7px]",
      "rounded-full",
      "min-w-[7px]",
      // Always outlined when inside button, otherwise respect props.outlined
      ...(isInsideButton || props.outlined ? ["badge-outlined"] : []),
    ],
  };

  // Combine all styles
  const allStyles = [
    ...baseStyles,
    ...variantStyles[effectiveVariant.value],
  ].join(" ");

  return {
    root: allStyles,
  };
});

/**
 * COMPOSITION PATTERN EXPLANATION:
 *
 * 1. AUTO-SIZING: Badge detects parent context and adjusts size
 * 2. ACCESSIBILITY: Sets aria-hidden when decorative in buttons
 * 3. SPACING: Automatically adds proper gap from button text
 * 4. ALIGNMENT: Uses flexbox for perfect vertical centering
 *
 * EXTENDING FOR OTHER WRAPPERS:
 *
 * 1. Always check for parent context (button, card, etc.)
 * 2. Adjust styling based on composition
 * 3. Handle accessibility appropriately for context
 * 4. Use design tokens for all spacing and sizing
 *
 * FUTURE IMPROVEMENTS:
 * - Add provide/inject for better parent detection
 * - Support more composition contexts (cards, lists, etc.)
 * - Add animation variants for state changes
 */
</script>

<style>
.badge-outlined {
  outline: 2px solid white !important;
  outline-offset: 0px !important;
}

/* Fix for Inter font baseline alignment issues at small sizes */
.badge-text-center {
  /* Force pixel-perfect rendering */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  /* Ensure exact pixel positioning */
  transform: translate3d(0, 0, 0) !important; /* Force hardware acceleration */
  backface-visibility: hidden !important; /* Prevent subpixel rendering */
  /* Reset all font properties to ensure consistency */
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
  /* Force consistent text rendering */
  text-rendering: geometricPrecision !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  -moz-osx-font-smoothing: auto !important;
  /* Ensure no layout shifts */
  contain: layout style !important;
}
</style>
