<template>
  <CuiInputWrapper
    :id="id"
    :label="label"
    :required="required"
    :readonly="readonly"
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

import Textarea from "primevue/textarea";
import { computed } from "vue";
import { useInputTheme } from "../composables/useInputTheme";
import { ptViewMerge } from "../volt/utils";
import CuiInputWrapper from "./CuiInputWrapper.vue";

// Component API
export interface CuiTextAreaProps {
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

const props = withDefaults(defineProps<CuiTextAreaProps>(), {
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
 * TextArea theme configuration using shared input theme composable
 */
const textAreaTheme = useInputTheme({
  size: () => props.size,
  readonly: () => props.readonly,
  isTextarea: true,
  autoResize: () => props.autoResize,
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
