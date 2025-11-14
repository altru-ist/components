<template>
  <CuiInputWrapper
    :id="id"
    :label="label"
    :required="required"
    :error="error"
    :invalid="invalid"
    :help-text="helpText"
    :disabled="disabled"
    :size="size"
    :instructions="instructions"
    :show-instructions="showInstructions"
  >
    <template #default="slotProps">
      <div class="text-area-container" :class="inputContainerClasses">
        <Textarea
          unstyled
          :pt="textAreaTheme"
          :ptOptions="{ mergeProps: ptViewMerge }"
          :id="slotProps.id"
          :aria-describedby="slotProps.ariaDescribedBy"
          :aria-invalid="slotProps.ariaInvalid"
          :modelValue="modelValue"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          :invalid="slotProps.invalid"
          :rows="rows"
          :cols="cols"
          :autoResize="autoResize"
          v-bind="$attrs"
          @update:modelValue="$emit('update:modelValue', $event)"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
        />
      </div>
    </template>
  </CuiInputWrapper>
</template>

<script setup lang="ts">
/**
 * TextArea
 *
 * Multi-line text input component with auto-resize support, wrapped with InputWrapper
 * for consistent styling and accessibility features.
 */

import Textarea, { type TextareaPassThroughOptions } from "primevue/textarea";
import { computed } from "vue";
import { ptViewMerge } from "../volt/utils";
import CuiInputWrapper from "./CuiInputWrapper.vue";

// Component API
interface Props {
  /** The textarea value (for v-model) */
  modelValue?: string;
  /** Unique identifier for the textarea */
  id?: string;
  /** Label text for the textarea */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Textarea size */
  size?: "medium" | "large";
  /** Placeholder text */
  placeholder?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether the textarea is readonly */
  readonly?: boolean;
  /** Whether the textarea has an error state */
  invalid?: boolean;
  /** Error message for validation feedback */
  error?: string;
  /** Help text displayed below the textarea */
  helpText?: string;
  /** Custom instructions for screen readers */
  instructions?: string;
  /** Whether to show default instructions for screen readers */
  showInstructions?: boolean;
  /** Number of visible text lines */
  rows?: number;
  /** Number of visible text columns */
  cols?: number;
  /** Whether to auto-resize the textarea height */
  autoResize?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  disabled: false,
  readonly: false,
  invalid: false,
  showInstructions: false,
  rows: 4,
  autoResize: false,
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Default slot for additional content (not currently used)
   * Reserved for future extensibility
   */
  default?: () => any;
}>();

// Events emitted by TextArea component
defineEmits<{
  /**
   * Emitted when the textarea value changes (for v-model support)
   * @arg {string} value - The new textarea value
   */
  "update:modelValue": [value: string];

  /**
   * Emitted when the textarea receives focus
   * @arg {FocusEvent} event - The native focus event
   */
  focus: [event: FocusEvent];

  /**
   * Emitted when the textarea loses focus
   * @arg {FocusEvent} event - The native blur event
   */
  blur: [event: FocusEvent];

  /**
   * Emitted when the user types in the textarea
   * @arg {Event} event - The native input event
   */
  input: [event: Event];

  /**
   * Emitted when the textarea value changes
   * @arg {Event} event - The native change event
   */
  change: [event: Event];
}>();

/**
 * Input container classes for styling
 */
const inputContainerClasses = computed(() => {
  const classes = ["text-area-field"];
  return classes;
});

/**
 * TextArea theme configuration using our design tokens
 * Following the same pattern as TextInput component
 */
const textAreaTheme = computed<TextareaPassThroughOptions>(() => {
  // Base styles that apply to all textareas
  const baseStyles = [
    // Layout
    "w-full",
    "font-[var(--font-primary)]",
    "border border-solid",
    "transition-all duration-[var(--ds-transition-normal)]",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-[var(--cui-border-focus)]",
    "focus:ring-offset-2",
    "resize-y", // Allow vertical resizing unless autoResize is enabled

    // Hover state
    "hover:border-[var(--cui-border-focus)]",

    // Disabled state
    "disabled:opacity-60 disabled:cursor-not-allowed",
    "disabled:hover:border-[var(--cui-border-neutral)]", // Prevent hover on disabled
    "disabled:resize-none", // Prevent resizing when disabled
  ];

  // Auto-resize specific styles
  if (props.autoResize) {
    baseStyles.push("resize-none"); // Disable manual resize when auto-resize is on
  }

  // Size-specific styles using design tokens
  const sizeStyles = {
    medium: [
      "min-h-[5rem]", // Minimum height for 4 rows at medium size
      "px-3",
      "py-2",
      "text-sm", // 14px
      "rounded-[var(--ds-radius-md)]",
      "leading-5", // 20px line height
    ],
    large: [
      "min-h-[6rem]", // Minimum height for 4 rows at large size
      "px-4",
      "py-3",
      "text-base", // 16px
      "rounded-[var(--ds-radius-md)]",
      "leading-6", // 24px line height
    ],
  };

  // Default styles using semantic color tokens
  const defaultStyles = [
    "bg-[var(--cui-surface-default-white)]",
    "border-[var(--cui-border-neutral)]",
    "text-[var(--cui-text-header-body)]",
    "placeholder:text-[var(--cui-text-subtitle-caption)]",
  ];

  // State-specific styles
  // Note: Error state styling is handled by InputWrapper via slot props
  const stateStyles: string[] = [];

  return {
    root: [
      ...baseStyles,
      ...sizeStyles[props.size],
      ...defaultStyles,
      ...stateStyles,
    ].join(" "),
  };
});
</script>

<style scoped>
.text-area-container {
  position: relative;
  width: 100%;
}

/* Custom scrollbar styling for consistency */
.text-area-container textarea::-webkit-scrollbar {
  width: 8px;
}

.text-area-container textarea::-webkit-scrollbar-track {
  background: var(--cui-surface-subtle);
  border-radius: 4px;
}

.text-area-container textarea::-webkit-scrollbar-thumb {
  background: var(--cui-border-neutral);
  border-radius: 4px;
}

.text-area-container textarea::-webkit-scrollbar-thumb:hover {
  background: var(--cui-border-focus);
}
</style>
