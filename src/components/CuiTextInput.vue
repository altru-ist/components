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
      <div class="text-input-container" :class="inputContainerClasses">
        <span
          v-if="leftIcon"
          class="text-input-icon text-input-icon-left material-symbols-rounded"
        >
          {{ leftIcon }}
        </span>
        <InputText
          unstyled
          :pt="textInputTheme"
          :ptOptions="{ mergeProps: ptViewMerge }"
          :id="slotProps.id"
          :aria-describedby="slotProps.ariaDescribedBy"
          :aria-invalid="slotProps.ariaInvalid"
          :modelValue="modelValue"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          :invalid="slotProps.invalid"
          v-bind="$attrs"
          @update:modelValue="handleModelValueUpdate"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @change="handleChange"
        />
        <span
          v-if="rightIcon"
          class="text-input-icon text-input-icon-right material-symbols-rounded"
        >
          {{ rightIcon }}
        </span>
      </div>
    </template>
  </CuiInputWrapper>
</template>

<script setup lang="ts">
/**
 * TextInput
 *
 * Single-line text input component wrapped with InputWrapper for consistent styling
 * and accessibility. Supports validation, error states, and helper text.
 */

import InputText, {
  type InputTextPassThroughOptions,
} from "primevue/inputtext";
import { computed } from "vue";
import { ptViewMerge } from "../volt/utils";
import CuiInputWrapper from "./CuiInputWrapper.vue";

// Component API
interface Props {
  /** The input value (for v-model) */
  modelValue?: string;
  /** Unique identifier for the input */
  id?: string;
  /** Label text for the input */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Input size */
  size?: "medium" | "large";
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is readonly */
  readonly?: boolean;
  /** Whether the input has an error state */
  invalid?: boolean;
  /** Error message for validation feedback */
  error?: string;
  /** Help text displayed below the input */
  helpText?: string;
  /** Custom instructions for screen readers */
  instructions?: string;
  /** Whether to show default instructions for screen readers */
  showInstructions?: boolean;
  /** Left icon (Material Symbols Rounded) */
  leftIcon?: string;
  /** Right icon (Material Symbols Rounded) */
  rightIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  disabled: false,
  readonly: false,
  invalid: false,
  showInstructions: false,
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Left icon slot for custom icon content
   * Overrides the leftIcon prop when provided
   */
  "left-icon"?: () => any;

  /**
   * Right icon slot for custom icon content
   * Overrides the rightIcon prop when provided
   */
  "right-icon"?: () => any;
}>();

// Events emitted by TextInput component
const emit = defineEmits<{
  /**
   * Emitted when the input value changes (for v-model support)
   * @arg {string | undefined} value - The new input value
   */
  "update:modelValue": [value: string | undefined];

  /**
   * Emitted when the input receives focus
   * @arg {FocusEvent} event - The native focus event
   */
  focus: [event: FocusEvent];

  /**
   * Emitted when the input loses focus
   * @arg {FocusEvent} event - The native blur event
   */
  blur: [event: FocusEvent];

  /**
   * Emitted when the user types in the input
   * @arg {Event} event - The native input event
   */
  input: [event: Event];

  /**
   * Emitted when the input value changes
   * @arg {Event} event - The native change event
   */
  change: [event: Event];
}>();

// Event handlers
const handleModelValueUpdate = (value: string | undefined) =>
  emit("update:modelValue", value);
const handleFocus = (event: FocusEvent) => emit("focus", event);
const handleBlur = (event: FocusEvent) => emit("blur", event);
const handleInput = (event: Event) => emit("input", event);
const handleChange = (event: Event) => emit("change", event);

/**
 * Input container classes for icon positioning
 */
const inputContainerClasses = computed(() => {
  const classes = ["text-input-field"];

  if (props.leftIcon) classes.push("has-left-icon");
  if (props.rightIcon) classes.push("has-right-icon");

  return classes;
});

/**
 * TextInput theme configuration using our design tokens
 * Following the same pattern as Button component
 */
const textInputTheme = computed<InputTextPassThroughOptions>(() => {
  // Base styles that apply to all inputs
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

    // Hover state
    "hover:border-[var(--cui-border-focus)]",

    // Disabled state
    "disabled:opacity-60 disabled:cursor-not-allowed",
    "disabled:hover:border-[var(--cui-border-neutral)]", // Prevent hover on disabled
  ];

  // Size-specific styles using design tokens
  const sizeStyles = {
    medium: [
      "h-10",
      props.leftIcon ? "pl-10" : "pl-3",
      props.rightIcon ? "pr-10" : "pr-3",
      !props.leftIcon && !props.rightIcon ? "px-3" : "",
      "text-sm", // 14px
      "rounded-[var(--ds-radius-md)]",
    ].filter(Boolean),
    large: [
      "h-12",
      props.leftIcon ? "pl-12" : "pl-4",
      props.rightIcon ? "pr-12" : "pr-4",
      !props.leftIcon && !props.rightIcon ? "px-4" : "",
      "text-base", // 16px
      "rounded-[var(--ds-radius-md)]",
    ].filter(Boolean),
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
.text-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.text-input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cui-text-subtitle-caption);
  pointer-events: none;
  z-index: 1;
  font-size: 1.25rem; /* 20px */
}

.text-input-icon-left {
  left: 0.75rem; /* 12px */
}

.text-input-icon-right {
  right: 0.75rem; /* 12px */
}

/* Large size icons - use container class detection */
.text-input-container:has(input.text-base) .text-input-icon,
.text-input-container:has(.text-base) .text-input-icon {
  font-size: 1.5rem; /* 24px for large */
}

.text-input-container:has(input.text-base) .text-input-icon-left,
.text-input-container:has(.text-base) .text-input-icon-left {
  left: 1rem; /* 16px for large */
}

.text-input-container:has(input.text-base) .text-input-icon-right,
.text-input-container:has(.text-base) .text-input-icon-right {
  right: 1rem; /* 16px for large */
}
</style>
