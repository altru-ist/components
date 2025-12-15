import type { ButtonPassThroughOptions } from "primevue/button";
import { computed, unref, type ComputedRef, type MaybeRefOrGetter } from "vue";

/**
 * Button theme configuration interface
 */
export interface ButtonThemeProps {
  /** Visual variant of the button */
  variant?: MaybeRefOrGetter<
    "hero" | "primary" | "secondary-outline" | "secondary-text"
  >;
  /** Size of the button */
  size?: MaybeRefOrGetter<"small" | "medium" | "large">;
  /** Whether the button should have a floating shadow */
  floating?: MaybeRefOrGetter<boolean>;
  /** Whether this is an icon-only button */
  isIconOnly?: MaybeRefOrGetter<boolean>;
}

/**
 * Composable for generating button theme styles
 *
 * This composable encapsulates the button styling logic, making it reusable
 * across different button-related components (CuiButton, CuiButtonDropdown, etc.)
 *
 * @param props - Button theme configuration properties (supports refs and computed values)
 * @returns Computed ButtonPassThroughOptions for PrimeVue button styling
 *
 * @example
 * ```ts
 * const buttonTheme = useButtonTheme({
 *   variant: computed(() => 'primary'),
 *   size: computed(() => 'medium'),
 *   floating: computed(() => false),
 *   isIconOnly: computed(() => false)
 * });
 * ```
 */
export function useButtonTheme(
  props: ButtonThemeProps,
): ComputedRef<ButtonPassThroughOptions> {
  return computed<ButtonPassThroughOptions>(() => {
    // Helper to unwrap MaybeRefOrGetter - handles refs, getters, and plain values
    const unwrap = <T>(
      value: MaybeRefOrGetter<T> | undefined,
    ): T | undefined => {
      if (value === undefined) return undefined;
      // Check if it's a function (getter) first, before calling unref
      if (typeof value === "function") {
        return (value as () => T)();
      }
      // Otherwise use unref for refs and computed refs
      return unref(value);
    };

    // Unwrap refs/computed/getter values with explicit types and defaults
    const variant: "hero" | "primary" | "secondary-outline" | "secondary-text" =
      unwrap(props.variant) ?? "primary";
    const size: "small" | "medium" | "large" = unwrap(props.size) ?? "medium";
    const floating: boolean = unwrap(props.floating) ?? false;
    const isIconOnly: boolean = unwrap(props.isIconOnly) ?? false;

    // Base styles that apply to all buttons
    const baseStyles = [
      // Layout & Interaction
      "w-full relative inline-flex items-center justify-center",
      "font-medium font-[var(--font-primary)]",
      "border border-solid",
      "cursor-pointer select-none",
      "transition-all duration-[var(--ds-transition-normal)]",
      "enabled:focus:ring-[var(--ds-focus-ring)] enabled:focus:ring-offset-[var(--ds-focus-ring-offset)]",

      // Disabled state
      "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",

      // Loading state
      "data-[loading=true]:cursor-wait",
    ];

    // Size-specific styles using our design tokens
    const sizeStyles: Record<string, string[]> = {
      small: [
        "h-[var(--ds-button-height-sm)]",
        ...(isIconOnly
          ? ["w-[var(--ds-button-height-sm)]", "p-0"]
          : ["px-3", "py-0"]),
        "text-[var(--ds-button-font-size-sm)]",
        "rounded-[var(--ds-radius-md)]",
        ...(isIconOnly ? [] : ["gap-2"]),
      ],
      medium: [
        "h-[var(--ds-button-height-md)]",
        ...(isIconOnly
          ? ["w-[var(--ds-button-height-md)]", "p-0"]
          : ["px-4", "py-0"]),
        "text-[var(--ds-button-font-size-md)]",
        "rounded-[var(--ds-radius-lg)]",
        ...(isIconOnly ? [] : ["gap-2"]),
      ],
      large: [
        "h-[var(--ds-button-height-lg)]",
        ...(isIconOnly
          ? ["w-[var(--ds-button-height-lg)]", "p-0"]
          : ["px-6", "py-0"]),
        "text-[var(--ds-button-font-size-lg)]",
        "rounded-[var(--ds-radius-xl)]",
        ...(isIconOnly ? [] : ["gap-3"]),
      ],
    };

    // Variant-specific styles using semantic color tokens
    const variantStyles: Record<string, string[]> = {
      hero: [
        // Hero button - most prominent CTA (max 1 per page)
        "bg-[var(--cui-button-hero-rest)]",
        "border-[var(--cui-button-hero-rest)]",
        "text-[var(--cui-text-on-dark-default)]",

        // Hover state
        "hover:bg-[var(--cui-button-hero-hover)]",
        "hover:border-[var(--cui-button-hero-hover)]",

        // Active state
        "active:bg-[var(--cui-button-hero-active)]",
        "active:border-[var(--cui-button-hero-active)]",

        // Enhanced shadow for hero prominence
        "shadow-[var(--ds-shadow-md)]",
        "hover:shadow-[var(--ds-shadow-lg)]",
      ],
      primary: [
        // Primary button - main call-to-action
        "bg-[var(--cui-button-primary-rest)]",
        "border-[var(--cui-button-primary-rest)]",
        "text-[var(--cui-text-on-dark-default)]",
        // Dark mode: button background becomes light, so use dark text
        "dark:text-[rgb(17_24_39)]", // gray-900 for contrast on light button

        // Hover state
        "hover:bg-[var(--cui-button-primary-hover)]",
        "hover:border-[var(--cui-button-primary-hover)]",

        // Active state
        "active:bg-[var(--cui-button-primary-active)]",
        "active:border-[var(--cui-button-primary-active)]",
      ],
      "secondary-outline": [
        // Secondary outline button - secondary action with border
        "bg-transparent",
        "border-[var(--cui-button-outline-border)]",
        "text-[var(--cui-button-outline-border)]",

        // Hover state
        "hover:bg-[var(--cui-button-outline-hover-bg)]",

        // Active state
        "active:bg-[var(--cui-button-outline-active-bg)]",
      ],
      "secondary-text": [
        // Secondary text button - secondary action with minimal styling
        "bg-transparent",
        "border-transparent",
        "text-[var(--cui-text-header-body)]",

        // Hover state
        "hover:bg-[var(--cui-surface-default-hover)]",

        // Active state
        "active:bg-[var(--cui-surface-default-hover)]",
      ],
    };

    // Shadow styles (for floating buttons)
    const shadowStyles = floating
      ? [
          "shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.2),_0_8px_10px_-6px_rgb(0_0_0_/_0.2)]",
        ]
      : [];

    // Combine all styles - ensure we have valid keys
    const selectedSizeStyles = sizeStyles[size] ?? sizeStyles.medium ?? [];
    const selectedVariantStyles =
      variantStyles[variant] ?? variantStyles.primary ?? [];

    const allStyles = [
      ...baseStyles,
      ...selectedSizeStyles,
      ...selectedVariantStyles,
      ...shadowStyles,
    ].join(" ");

    return {
      root: allStyles,
      // Loading icon styling
      loadingIcon: "animate-spin mr-2",
    };
  });
}
