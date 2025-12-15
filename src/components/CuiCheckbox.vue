<!--
  Checkbox.vue - Design System Checkbox Component
  
  This component wraps Volt's Checkbox to provide:
  1. Our design system API (semantic variants, consistent props)
  2. Brand styling using our design tokens
  3. Protection from Volt internal changes
  4. Proper form integration and validation support
  
  WRAPPER PATTERN BENEFITS:
  - API Stability: Changes in Volt don't affect our public API
  - Brand Consistency: All styling comes from our design tokens
  - Form Integration: Seamless v-model support and validation
  - Accessibility Preservation: Volt's accessibility features pass through
-->

<template>
  <div
    class="checkbox-wrapper"
    :class="{ 'checkbox-disabled': props.disabled }"
  >
    <label v-if="label" class="checkbox-label">
      {{ label }}
    </label>
    <div class="checkbox-container" :class="checkboxContainerClasses">
      <Checkbox
        unstyled
        :pt="checkboxTheme"
        :ptOptions="{ mergeProps: ptViewMerge }"
        :binary="value === undefined"
        :modelValue="modelValue"
        :aria-disabled="props.disabled ? 'true' : undefined"
        :aria-describedby="
          props.disabled && props.disabledReason ? disabledReasonId : undefined
        "
        :invalid="invalid || !!error"
        :inputId="uniqueId"
        :value="value"
        :name="name"
        :required="required"
        :tabindex="tabindex"
        :indeterminate="indeterminate"
        v-bind="$attrs"
        @update:modelValue="$emit('update:modelValue', $event)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @change="$emit('change', $event)"
        @click="handleClick"
        @keydown="handleKeydown"
      >
        <template #icon v-if="modelValue || indeterminate">
          <span class="checkmark" v-if="modelValue && !indeterminate">✓</span>
          <span class="indeterminate-mark" v-if="indeterminate">−</span>
        </template>
      </Checkbox>
      <label
        v-if="checkboxLabel"
        :for="uniqueId"
        class="checkbox-text-label"
        :class="{
          'cursor-not-allowed': props.disabled,
          'cursor-pointer': !props.disabled,
        }"
      >
        {{ checkboxLabel }}
      </label>
    </div>
    <div v-if="error" class="checkbox-error-message">
      {{ error }}
    </div>
    <div
      v-if="props.disabled && props.disabledReason"
      :id="disabledReasonId"
      class="sr-only"
    >
      {{ props.disabledReason }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Checkbox
 *
 * Binary checkbox with support for checked, unchecked, and indeterminate states.
 * Includes label positioning, error states, and full keyboard accessibility.
 */

import Checkbox, { type CheckboxPassThroughOptions } from "primevue/checkbox";
import { computed, ref } from "vue";
import { ptViewMerge } from "../volt/utils";

// Component API
export interface CuiCheckboxProps {
  /** The checkbox value (for v-model) */
  modelValue?: any;
  /** Group label text (appears above the checkbox) */
  label?: string;
  /** Checkbox label text (appears next to the checkbox) */
  checkboxLabel?: string;
  /** Checkbox size */
  size?: "medium" | "large";
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Explanation for why the checkbox is disabled (for accessibility) */
  disabledReason?: string;
  /** Whether the checkbox has an error state */
  invalid?: boolean;
  /** Error message for validation feedback */
  error?: string;
  /** Value to be used when the checkbox is checked (for array v-model) */
  value?: any;
  /** Input ID for label association */
  inputId?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Tab index for keyboard navigation */
  tabindex?: number;
  /** Whether the checkbox is in indeterminate state (for array/group selections) */
  indeterminate?: boolean;
}

const props = withDefaults(defineProps<CuiCheckboxProps>(), {
  size: "medium",
  disabled: false,
  disabledReason: undefined,
  invalid: false,
  required: false,
  tabindex: 0,
  indeterminate: false,
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Default slot for custom checkbox label content
   * Overrides the checkboxLabel prop when provided
   */
  default?: () => any;
}>();

// Events emitted by Checkbox component
defineEmits<{
  /**
   * Emitted when the checkbox value changes (for v-model support)
   * @arg {boolean} value - The new checkbox state
   */
  "update:modelValue": [value: boolean];

  /**
   * Emitted when the checkbox receives focus
   * @arg {Event} event - The native focus event
   */
  focus: [event: Event];

  /**
   * Emitted when the checkbox loses focus
   * @arg {Event} event - The native blur event
   */
  blur: [event: Event];

  /**
   * Emitted when the checkbox state changes
   * @arg {Event} event - The native change event
   */
  change: [event: Event];
}>();

// Generate stable ID for this component instance
const uniqueId = ref(
  props.inputId || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
);

// Generate disabled reason ID for accessibility
const disabledReasonId = computed(() => `${uniqueId.value}-disabled-reason`);

// Handle click prevention for disabled state
const handleClick = (event: Event) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
  }
};

// Handle keydown prevention for disabled state
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled && (event.key === " " || event.key === "Enter")) {
    event.preventDefault();
    event.stopPropagation();
  }
};

/**
 * Checkbox container classes for styling
 */
const checkboxContainerClasses = computed(() => {
  const classes = ["checkbox-field"];

  if (props.checkboxLabel) classes.push("has-label");
  if (props.disabled) classes.push("is-disabled");
  if (props.invalid || props.error) classes.push("is-invalid");

  return classes;
});

/**
 * Checkbox theme configuration using our design tokens
 * Following the same pattern as other components (Button, TextInput, etc.)
 */
const checkboxTheme = computed<CheckboxPassThroughOptions>(() => {
  // Base styles for the checkbox container
  const baseStyles = [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "cursor-pointer",
    "transition-all duration-[var(--ds-transition-normal)]",
    "flex-shrink-0", // Prevent distortion when space is limited
    "select-none", // Prevent text selection on click
  ];

  // Size-specific styles using design tokens
  const sizeStyles = {
    medium: [
      "w-4",
      "h-4", // 16px
    ],
    large: [
      "w-5",
      "h-5", // 20px
    ],
  };

  // Default styles using semantic color tokens
  const defaultStyles = [
    "bg-[var(--cui-surface-default-white)]",
    "border border-solid border-[var(--cui-border-neutral)]",
    "rounded-[var(--ds-radius-sm)]",

    // Hover state - but not when disabled
    "hover:border-[var(--cui-border-focus)]",
    "aria-disabled:hover:!border-[var(--cui-border-neutral)]",

    // Focus state
    "focus-within:outline-none",
    "focus-within:ring-2",
    "focus-within:ring-[var(--cui-border-focus)]",
    "focus-within:ring-offset-2",
  ];

  // State-specific styles
  const stateStyles = [];
  if (props.invalid || props.error) {
    stateStyles.push(
      "!border-[var(--cui-border-danger)]",
      "focus-within:ring-[var(--cui-border-danger)]",
    );
  }

  // Build different styles for checked and unchecked states
  const rootStyles = [
    ...baseStyles,
    ...sizeStyles[props.size || "medium"],
    ...defaultStyles,
    ...stateStyles,
  ];

  // Add checked or indeterminate state styling conditionally
  if (props.modelValue || props.indeterminate) {
    rootStyles.push(
      "bg-[var(--cui-button-primary-rest)]",
      "border-[var(--cui-button-primary-rest)]",
      "hover:bg-[var(--cui-button-primary-hover)]",
      "hover:border-[var(--cui-button-primary-hover)]",
      // Prevent hover effects when disabled
      "aria-disabled:hover:!bg-[var(--cui-button-primary-rest)]",
      "aria-disabled:hover:!border-[var(--cui-button-primary-rest)]",
    );
  }

  return {
    root: rootStyles.join(" "),
    input: [
      "absolute",
      "inset-0",
      "w-full",
      "h-full",
      "opacity-0",
      "cursor-pointer",
      "z-10",
    ].join(" "),
    icon: [
      "absolute",
      "inset-0",
      "flex",
      "items-center",
      "justify-center",
      "text-white",
      "font-bold",
      "pointer-events-none",
      "z-0",
      props.size === "large" ? "text-sm" : "text-xs",
    ].join(" "),
  };
});
</script>

<style scoped>
.checkbox-wrapper {
  display: block;
}

/* Apply 40% opacity to the entire component when disabled */
.checkbox-wrapper.checkbox-disabled {
  opacity: 0.4;
}

/* Ensure not-allowed cursor on the entire disabled component */
.checkbox-wrapper.checkbox-disabled {
  cursor: not-allowed;
}

.checkbox-wrapper.checkbox-disabled * {
  cursor: not-allowed !important;
}

.checkbox-label {
  display: block;
  font-size: 0.875rem; /* 14px for medium, will be overridden for large */
  font-weight: 400;
  color: var(--cui-text-header-body);
  margin-bottom: 0.5rem;
}

/* Large size label */
.checkbox-wrapper:has(.w-5) .checkbox-label {
  font-size: 1rem; /* 16px for large */
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

/* Ensure checkbox doesn't shrink and aligns with first line of text */
.checkbox-container :deep(.p-checkbox) {
  flex-shrink: 0;
  /* Adjust alignment to match first line of text baseline */
  margin-top: -0.125rem; /* -2px */
}

/* Large size alignment adjustment */
.checkbox-wrapper:has(.w-5) .checkbox-container :deep(.p-checkbox) {
  margin-top: -0.125rem; /* -2px */
}

.checkbox-container.is-invalid {
  color: var(--cui-text-danger-small);
}

.checkbox-error-message {
  color: var(--cui-text-danger-small);
  font-size: 0.875rem; /* 14px for medium, will be overridden for large */
  font-weight: 400;
  margin-top: 0.25rem;
}

/* Large size error message */
.checkbox-wrapper:has(.w-5) .checkbox-error-message {
  font-size: 1rem; /* 16px for large */
}

.checkbox-text-label {
  cursor: pointer;
  font-size: 0.875rem; /* 14px for medium, will be overridden for large */
  font-weight: 400;
  color: var(--cui-text-header-body);
  line-height: 1.5;
  user-select: none;
  margin-top: -0.125rem; /* -2px to align with checkbox */
}

/* Large size checkbox label */
.checkbox-wrapper:has(.w-5) .checkbox-text-label {
  font-size: 1rem; /* 16px for large */
}

/* Checkmark styling */
.checkmark {
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Large size checkmark */
.checkbox-wrapper:has(.w-5) .checkmark {
  font-size: 0.875rem;
}

/* Indeterminate mark styling */
.indeterminate-mark {
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Large size indeterminate mark */
.checkbox-wrapper:has(.w-5) .indeterminate-mark {
  font-size: 1rem;
}
</style>
