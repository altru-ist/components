<template>
  <CuiInputWrapper
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
    <template
      #default="{
        id: wrapperId,
        ariaDescribedBy,
        ariaInvalid,
        invalid,
        class: wrapperClasses,
      }"
    >
      <VoltSelectButton
        :id="wrapperId"
        v-model="localModel"
        :disabled="disabled"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        :invalid="invalid"
        :class="[selectButtonClasses, wrapperClasses]"
        v-bind="dynamicProps"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps ?? {}" />
        </template>
      </VoltSelectButton>
    </template>
  </CuiInputWrapper>
</template>

<script setup lang="ts">
/**
 * SelectButton
 *
 * Button group for single or multiple selection with toggle functionality.
 * Supports various option types and keyboard navigation.
 *
 * @emits update:modelValue - Emitted when the selected value changes (for v-model support)
 * @emits change - Emitted when selection changes, providing { value, originalEvent } payload
 * @emits focus - Emitted when any button receives focus (passes FocusEvent)
 * @emits blur - Emitted when any button loses focus (passes FocusEvent)
 */

import { computed, watch } from "vue";
import VoltSelectButton from "../volt/VoltSelectButton.vue";
import CuiInputWrapper from "./CuiInputWrapper.vue";

// Component API
interface Props {
  /** The select button value (for v-model) */
  modelValue?: any;
  /** Array of options to select from */
  options?: any[];
  /** Property name to use as the label of an option */
  optionLabel?: string;
  /** Property name to use as the value of an option */
  optionValue?: string;
  /** Label text for the select button group */
  label?: string;
  /** Select button size */
  size?: "medium" | "large";
  /** Whether the select button is disabled */
  disabled?: boolean;
  /** Whether the select button has an error state */
  invalid?: boolean;
  /** Error message for validation feedback */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Help text displayed below the select button */
  helpText?: string;
  /** Custom instructions for screen readers */
  instructions?: string;
  /** Whether to show default instructions for screen readers */
  showInstructions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  disabled: false,
  invalid: false,
  options: () => [],
  optionLabel: "label",
  optionValue: "value",
  required: false,
  showInstructions: true,
  instructions:
    "Use arrow keys to navigate between options. Press Space or Enter to select. Use Tab to move to next element.",
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Custom option slot for rendering individual option buttons
   * @arg {object} slotProps - The option slot properties
   * @arg {any} slotProps.option - The option object being rendered
   * @arg {number} slotProps.index - The index of the option in the list
   * @arg {boolean} slotProps.selected - Whether this option is currently selected
   */
  option?: (props: { option: any; index: number; selected: boolean }) => any;
}>();

// Events
const emit = defineEmits<{
  /**
   * Emitted when the selected value changes (for v-model support)
   * @arg {any} value - The selected option value
   */
  "update:modelValue": [value: any];

  /**
   * Emitted when selection changes, providing both value and original event
   * @arg {object} payload - The change event payload
   * @arg {any} payload.value - The selected option value
   * @arg {Event} payload.originalEvent - The original DOM event that triggered the change
   */
  change: [payload: { value: any; originalEvent: Event }];

  /**
   * Emitted when any option button receives focus
   * @arg {FocusEvent} event - The native focus event
   */
  focus: [event: FocusEvent];

  /**
   * Emitted when any option button loses focus
   * @arg {FocusEvent} event - The native blur event
   */
  blur: [event: FocusEvent];
}>();

// Local model for v-model
const localModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit("update:modelValue", value);
  },
});

// Track previous value to restore it when deselection is attempted
let previousValue: any = props.modelValue;

// Simple watcher: always ensure we have a selection
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== null && newValue !== undefined) {
      // Store the current valid value
      previousValue = newValue;
    } else if (
      (newValue === null || newValue === undefined) &&
      props.options &&
      props.options.length > 0
    ) {
      // If trying to deselect, restore the previous value or default to first option
      let valueToRestore;
      if (previousValue !== null) {
        valueToRestore = previousValue;
      } else {
        // Default to first option's value
        const firstOption = props.options[0];
        valueToRestore = props.optionValue
          ? firstOption[props.optionValue]
          : firstOption;
      }
      emit("update:modelValue", valueToRestore);
    }
  },
  { immediate: true },
);

// Dynamic props for VoltSelectButton
const dynamicProps = computed(() => {
  const dynamicProps: any = {};

  return dynamicProps;
});

// Event handlers
const onChange = (event: any) => {
  emit("change", { value: event.value, originalEvent: event.originalEvent });
};

const onFocus = (event: any) => {
  emit("focus", event);
};

const onBlur = (event: any) => {
  emit("blur", event);
};

/**
 * Select button classes for styling
 */
const selectButtonClasses = computed(() => {
  const classes = ["cui-select-button", "w-full"];

  // Size-specific classes
  if (props.size === "medium") {
    classes.push("text-sm");
  } else if (props.size === "large") {
    classes.push("text-base");
  }

  return classes;
});
</script>

<style scoped>
:deep(.cui-select-button) {
  /* Ensure the select button takes full width */
  width: 100% !important;
}

/* Size-specific styling */
:deep(.cui-select-button.text-sm) {
  /* Medium size specific styles */
  font-size: 0.875rem; /* 14px */
}

:deep(.cui-select-button.text-base) {
  /* Large size specific styles */
  font-size: 1rem; /* 16px */
}
</style>
