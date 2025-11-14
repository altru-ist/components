<template>
  <div class="button-wrapper">
    <VoltButton
      unstyled
      :pt="buttonTheme"
      :ptOptions="{ mergeProps: ptViewMerge }"
      :disabled="disabled"
      :loading="loading"
      :aria-label="ariaLabel"
      v-bind="$attrs"
      @click="emits('click', $event)"
      @focus="emits('focus', $event)"
      @blur="emits('blur', $event)"
    >
      <div class="button-content">
        <!-- Default slot for button content (text) -->
        <slot />

        <!-- Badge slot - inline for badge variant, absolute for pill variants -->
        <template v-if="hasSlotContent(slots.badge)">
          <slot name="badge" />
        </template>

        <!-- Icon slot - Custom icon template -->
        <template v-if="hasSlotContent(slots.icon)">
          <slot name="icon" />
        </template>
      </div>
    </VoltButton>
  </div>
</template>

<script setup lang="ts">
/**
 * Button
 *
 * Versatile button component with multiple variants, sizes, and states. Supports icons,
 * loading states, and badges for notification counts.
 */

import VoltButton from "primevue/button";
import { computed, provide, watchEffect } from "vue";
import { hasSlotContent } from "../utils/slotsUtils";
import { ptViewMerge } from "../volt/utils";
import { useButtonTheme } from "../composables/useButtonTheme";

// Design System API - Only expose props we want in our public API
interface Props {
  /** Visual variant of the button */
  variant?: "hero" | "primary" | "secondary-outline" | "secondary-text";
  /** Size of the button */
  size?: "small" | "medium" | "large";
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Manual override for icon-only detection (use when auto-detection fails) */
  iconOnly?: boolean;
  /** Whether the button should have a floating shadow (for floating/overlay contexts) */
  floating?: boolean;
  /** Accessible label for icon-only buttons (required when button contains only icons) */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "medium",
  disabled: false,
  loading: false,
  floating: false,
});

// Events we want to expose
const emits = defineEmits<{
  /**
   * Emitted when the button is clicked
   * @arg {Event} event - The native click event
   */
  click: [event: Event];

  /**
   * Emitted when the button receives focus
   * @arg {FocusEvent} event - The native focus event
   */
  focus: [event: FocusEvent];

  /**
   * Emitted when the button loses focus
   * @arg {FocusEvent} event - The native blur event
   */
  blur: [event: FocusEvent];
}>();

const slots = defineSlots<{
  /**
   * Default slot for button text content
   * Use this slot to provide the button label and any right-side icons
   * For icon-only buttons, provide only icon elements with material-symbols-rounded class
   */
  default: () => any;

  /**
   * Badge slot for additional content positioned on the right side
   * Typically used for notification counts or status indicators
   * Badge positioning is automatically handled based on button variant
   */
  badge: () => any;

  /**
   * Icon slot for left-side icon content
   * Use this slot for icons that should appear before the button text
   * Icons should use material-symbols-rounded class for consistency
   */
  icon: () => any;
}>();

// Detect if this is an icon-only button (manual prop OR auto-detection)
const isIconOnly = computed(() => {
  // If manually specified, use that
  if (props.iconOnly !== undefined) {
    return props.iconOnly;
  }

  // Otherwise, try auto-detection
  const defaultSlot = slots.default?.();
  if (!defaultSlot || defaultSlot.length === 0) return false;

  // Check if the default slot only contains icons (spans with material-symbols-rounded class)
  return defaultSlot.every((vnode: any) => {
    // Skip whitespace-only text nodes
    if (vnode.type === Symbol.for("v-txt")) {
      return (
        typeof vnode.children === "string" && vnode.children.trim().length === 0
      );
    }

    // Check if it's a span with material-symbols-rounded class
    if (vnode.type === "span") {
      const className = vnode.props?.class || vnode.props?.className || "";
      return (
        typeof className === "string" &&
        className.includes("material-symbols-rounded")
      );
    }

    return false;
  });
});

// Accessibility validation for icon-only buttons
const validateIconOnlyAccessibility = computed(() => {
  if (isIconOnly.value && !props.ariaLabel) {
    console.warn(
      "Button: Icon-only buttons require an aria-label for accessibility. Please provide the ariaLabel prop.",
    );
    return false;
  }
  return true;
});

// Trigger accessibility validation
watchEffect(() => {
  // This ensures the validation runs when dependencies change
  const isValid = validateIconOnlyAccessibility.value;
  // The validation happens inside the computed, no additional action needed here
  return isValid;
});

// Provide context for child components (like Badge)
provide("isInsideButton", true);
provide("isIconOnlyButton", isIconOnly);

// Use button theme composable
const buttonTheme = useButtonTheme({
  variant: () => props.variant,
  size: () => props.size,
  floating: () => props.floating,
  isIconOnly,
});

/**
 * EXTENDING THIS PATTERN:
 *
 * 1. For new Volt components, follow this structure:
 *    - Import the unstyled Volt component
 *    - Define your DS API interface (Props)
 *    - Create computed theme using design tokens
 *    - Pass through slots and essential events
 *
 * 2. Always use semantic variants (primary/secondary) not visual (blue/red)
 *
 * 3. Map ALL styling to design tokens - never hardcode values
 *
 * 4. Preserve Volt's accessibility by passing through ARIA attributes
 *
 * 5. Use ptViewMerge for safe pass-through option merging
 *
 * 6. Implement accessibility validation where needed (e.g., icon-only buttons)
 *
 * ACCESSIBILITY FEATURES:
 * - Icon-only buttons automatically validate for aria-label requirement
 * - Console warnings guide developers to fix accessibility issues
 * - All ARIA attributes pass through to underlying components
 *
 * FUTURE-PROOFING:
 * - Volt API changes don't affect our public Props interface
 * - Design token updates automatically flow to all components
 * - Volt accessibility improvements are inherited automatically
 * - Component composition (badges, icons) works out of the box
 */
</script>

<style scoped>
.button-wrapper {
  position: relative;
  display: inline-block;
}

.button-content {
  display: flex;
  align-items: center;
  gap: var(--ds-badge-gap-from-text, 0.5rem);
}
</style>
