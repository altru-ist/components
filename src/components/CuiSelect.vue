<template>
  <CuiInputWrapper
    :label="label"
    :required="required"
    :error="error"
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
      <VoltSelect
        :id="wrapperId"
        v-model="localModel"
        :disabled="disabled"
        :placeholder="placeholder"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :filter="filterable"
        :show-clear="clearable"
        checkmark
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        :invalid="invalid"
        :class="[selectClasses, wrapperClasses]"
        v-bind="dynamicProps"
        @before-show="onBeforeShow"
        @before-hide="onBeforeHide"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps ?? {}" />
        </template>
        <template v-if="$slots.value" #value="slotProps">
          <slot name="value" v-bind="slotProps ?? {}" />
        </template>
      </VoltSelect>
    </template>
  </CuiInputWrapper>
</template>

<script setup lang="ts">
/**
 * Select
 *
 * Single-select dropdown component with consistent styling matching TextInput/SearchBar.
 * Includes keyboard navigation, clear functionality, and accessible controls.
 *
 * @emits update:modelValue - Emitted when the selected value changes (for v-model support)
 * @emits change - Emitted when selection changes, providing { value, option } payload
 * @emits focus - Emitted when the select receives focus (passes FocusEvent)
 * @emits blur - Emitted when the select loses focus (passes FocusEvent)
 * @emits show - Emitted when the dropdown opens
 * @emits hide - Emitted when the dropdown closes
 */

import { computed, ref } from "vue";
import VoltSelect from "../volt/VoltSelect.vue";
import CuiInputWrapper from "./CuiInputWrapper.vue";

// Component API
interface Props {
  /** The select value (for v-model) */
  modelValue?: any;
  /** Array of options to select from */
  options?: any[];
  /** Property name to use as the label of an option */
  optionLabel?: string;
  /** Property name to use as the value of an option */
  optionValue?: string;
  /** Label text for the select */
  label?: string;
  /** Select size */
  size?: "medium" | "large";
  /** Placeholder text */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is readonly */
  readonly?: boolean;
  /** Whether the select has an error state */
  invalid?: boolean;
  /** Error message for validation feedback */
  error?: string;
  /** Whether to show filter/search functionality */
  filterable?: boolean;
  /** Whether to show clear button */
  clearable?: boolean;
  /** Right icon (Material Symbols Rounded) */
  rightIcon?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Help text displayed below the select */
  helpText?: string;
  /** Custom instructions for screen readers */
  instructions?: string;
  /** Whether to show default instructions for screen readers */
  showInstructions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  disabled: false,
  readonly: false,
  invalid: false,
  filterable: false,
  clearable: false,
  options: () => [],
  optionLabel: "label",
  optionValue: "value",
  required: false,
  showInstructions: true,
  instructions:
    "Use arrow keys to navigate the dropdown list. Press Enter to select or Escape to close.",
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Custom option slot for rendering individual options
   * @arg {object} slotProps - The option slot properties
   * @arg {any} slotProps.option - The option object being rendered
   * @arg {number} slotProps.index - The index of the option in the list
   */
  option?: (props: { option: any; index: number }) => any;

  /**
   * Custom value slot for rendering the selected value display
   * @arg {object} slotProps - The value slot properties
   * @arg {any} slotProps.value - The currently selected value
   * @arg {string} slotProps.placeholder - The placeholder text when no value is selected
   */
  value?: (props: { value: any; placeholder: string }) => any;
}>();

// Events
const emit = defineEmits<{
  /**
   * Emitted when the selected value changes (for v-model support)
   * @arg {any} value - The selected option value
   */
  "update:modelValue": [value: any];

  /**
   * Emitted when selection changes, providing both value and option details
   * @arg {object} payload - The change event payload
   * @arg {any} payload.value - The selected option value (null when cleared)
   * @arg {any} payload.option - The full option object (undefined when cleared)
   */
  change: [payload: { value: any; option?: any }];

  /**
   * Emitted when the select receives focus
   * @arg {FocusEvent} event - The native focus event
   */
  focus: [event: FocusEvent];

  /**
   * Emitted when the select loses focus
   * @arg {FocusEvent} event - The native blur event
   */
  blur: [event: FocusEvent];

  /**
   * Emitted when the dropdown opens
   */
  show: [];

  /**
   * Emitted when the dropdown closes
   */
  hide: [];
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

// Dynamic props for VoltSelect
const dynamicProps = computed(() => {
  const dynamicProps: any = {};

  if (props.readonly) {
    dynamicProps["data-p"] = "readonly disabled";
  }

  if (props.rightIcon) {
    dynamicProps.rightIcon = props.rightIcon;
  }

  return dynamicProps;
});

// Dropdown state
const dropdownOpen = ref(false);

// Event handlers
const onBeforeShow = () => {
  dropdownOpen.value = true;
  emit("show");
};

const onBeforeHide = () => {
  dropdownOpen.value = false;
  emit("hide");
};

const onChange = (event: any) => {
  const selectedOption = props.options?.find(
    (option) =>
      (typeof option === "string" ? option : option[props.optionValue]) ===
      event.value,
  );
  emit("change", { value: event.value, option: selectedOption });
};

const onFocus = (event: any) => {
  emit("focus", event);
};

const onBlur = (event: any) => {
  emit("blur", event);
};

/**
 * Select classes for styling
 */
const selectClasses = computed(() => {
  const classes = ["cui-select", "w-full", "text-xs"];

  // Size-specific classes
  if (props.size === "medium") {
    classes.push("h-8"); // 32px height for medium
  } else if (props.size === "large") {
    classes.push("h-10"); // 40px height for large
  }

  return classes;
});

// Expose dropdown state for parent components if needed
defineExpose({
  dropdownOpen,
});
</script>

<style scoped>
:deep(.cui-select) {
  /* Ensure the select takes full width and height */
  width: 100% !important;
}

/* Size-specific styling */
:deep(.cui-select.h-8) {
  /* Medium size specific styles */
  font-size: 0.75rem; /* 12px */
}

:deep(.cui-select.h-10) {
  /* Large size specific styles */
  font-size: 0.875rem; /* 14px */
}
</style>
