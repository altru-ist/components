<!--
  InputWrapper.vue - Reusable Input Wrapper Component
  
  This component provides a consistent wrapper for input components that includes:
  1. Label display with proper accessibility
  2. Hidden instructions for screen readers
  3. Error message display and validation styling
  4. Consistent form field styling and behavior
  
  WRAPPER PATTERN BENEFITS:
  - Reusability: Can wrap any input component (Select, TextInput, DatePicker, etc.)
  - Consistency: Unified label, instruction, and error styling across all inputs
  - Accessibility: Proper ARIA relationships and screen reader support
  - Maintainability: Single source of truth for input wrapper behavior
-->

<template>
  <div class="block w-full" :class="wrapperClasses">
    <!-- Label -->
    <label
      v-if="label"
      :for="computedId"
      class="block font-normal mb-2 leading-tight"
      :class="labelClasses"
    >
      {{ label }}
      <span
        v-if="required"
        class="ml-1 font-medium [color:var(--cui-text-danger-small)]"
        aria-label="required"
        >*</span
      >
    </label>

    <!-- Input Container -->
    <div class="relative w-full" :class="containerClasses">
      <slot
        :id="computedId"
        :ariaDescribedBy="ariaDescribedBy"
        :ariaInvalid="hasError"
        :invalid="hasError"
        :class="inputClasses"
      />
    </div>

    <!-- Hidden instructions for screen readers -->
    <span
      v-if="showInstructions"
      :id="`${computedId}-instructions`"
      class="sr-only"
    >
      {{ instructions }}
    </span>

    <!-- Error message -->
    <div v-if="error" :id="`${computedId}-error`" :class="errorMessageClasses">
      {{ error }}
    </div>

    <!-- Help text -->
    <div
      v-if="helpText && !error"
      :id="`${computedId}-help`"
      :class="helpTextClasses"
    >
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * InputWrapper
 *
 * Reusable wrapper providing consistent labels, error messages, and help text
 * for input components. Handles accessibility attributes automatically.
 */

import { computed, getCurrentInstance } from "vue";

// Component API
interface Props {
  /** Unique identifier for the input */
  id?: string;
  /** Label text for the input */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message for validation feedback */
  error?: string;
  /** Whether the input has an invalid state */
  invalid?: boolean;
  /** Help text displayed below the input */
  helpText?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: "medium" | "large";
  /** Custom instructions for screen readers */
  instructions?: string;
  /** Whether to show default instructions for screen readers */
  showInstructions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  disabled: false,
  showInstructions: true,
  instructions:
    "Use arrow keys to navigate the dropdown list. Press Enter to select or Escape to close.",
});

/**
 * Computed ID for the input element
 */
const computedId = computed(() => {
  return (
    props.id ||
    `input-${getCurrentInstance()?.uid || Math.random().toString(36).substring(2)}`
  );
});

/**
 * Check if there's an error state
 */
const hasError = computed(() => {
  return !!props.error || !!props.invalid;
});

/**
 * Compute aria-describedby attribute
 */
const ariaDescribedBy = computed(() => {
  const descriptors = [];

  if (props.showInstructions) {
    descriptors.push(`${computedId.value}-instructions`);
  }

  if (props.error) {
    descriptors.push(`${computedId.value}-error`);
  } else if (props.helpText) {
    descriptors.push(`${computedId.value}-help`);
  }

  return descriptors.length > 0 ? descriptors.join(" ") : undefined;
});

/**
 * Wrapper classes for styling
 */
const wrapperClasses = computed(() => {
  const classes: string[] = [];

  if (props.disabled) classes.push("opacity-60 pointer-events-none");

  return classes;
});

/**
 * Label classes for styling
 */
const labelClasses = computed(() => {
  const classes: string[] = [];

  // Use CSS variables for colors
  if (props.disabled) {
    classes.push("cursor-not-allowed");
    classes.push("[color:var(--cui-text-subtitle-caption)]");
  } else {
    classes.push("[color:var(--cui-text-header-body)]");
  }

  if (props.size === "large") {
    classes.push("text-base"); // 16px for large
  } else {
    classes.push("text-sm"); // 14px for medium
  }

  return classes.join(" ");
});

/**
 * Container classes for the input container
 */
const containerClasses = computed(() => {
  const classes: string[] = [];

  // Container doesn't need additional classes with Tailwind approach

  return classes;
});

/**
 * Classes to apply to the input element (passed via slot)
 */
const inputClasses = computed(() => {
  const classes = ["w-full transition-all duration-200 ease-in-out"];

  if (hasError.value) {
    classes.push(
      "[border-color:var(--cui-border-danger)] focus:[border-color:var(--cui-border-danger)] focus:[outline-color:var(--cui-border-danger)] focus:outline-2 focus:outline-offset-2",
    );
  }
  if (props.size === "large") {
    classes.push("h-12 text-base"); // 48px height, 16px text
  }

  return classes;
});

/**
 * Error message classes
 */
const errorMessageClasses = computed(() => {
  const classes = [
    "font-normal mt-1 leading-tight [color:var(--cui-text-danger-small)]",
  ];

  if (props.size === "large") {
    classes.push("text-base"); // 16px for large
  } else {
    classes.push("text-sm"); // 14px for medium
  }

  return classes;
});

/**
 * Help text classes
 */
const helpTextClasses = computed(() => {
  const classes = [
    "font-normal mt-1 leading-tight [color:var(--cui-text-subtitle-caption)]",
  ];

  if (props.size === "large") {
    classes.push("text-base"); // 16px for large
  } else {
    classes.push("text-sm"); // 14px for medium
  }

  return classes;
});

// Expose computed values for parent components if needed
defineExpose({
  computedId,
  hasError,
  ariaDescribedBy,
});
</script>
