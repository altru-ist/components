<script lang="ts" setup>
/**
 * MultiSelect
 *
 * Multi-select dropdown wrapped with InputWrapper for consistent styling. Supports multiple
 * selection, filtering, disabled states, error handling, and accessible keyboard navigation.
 */

import { computed, ref } from "vue";
import { uniqueArrayValues } from "../utils/arrayUtils";
import VoltMultiSelect from "../volt/VoltMultiSelect.vue";
import CuiInputWrapper from "./CuiInputWrapper.vue";

/**
 * @description The object structure intended for CuiDropdownList items.
 */
export type DropdownListItem = {
  id: number | string;
  value: string;
  disabled?: boolean;
};

/**
 * @description Array of DropdownListItems
 */
export type DropdownListItems = DropdownListItem[];

type MultiSelectProps = {
  /**
   * @description Text to be displayed when no list item is chosen.
   */
  description: string;

  /**
   * @description Disables the selector and sets attribute _aria-disabled_ to true.
   */
  disabled?: boolean;

  /**
   * @description The ID of the component.
   */
  id?: string;

  /**
   * @description If dropdown is affected by content around it. Does nothing if `multiLine` is false
   * @deprecated This prop does nothing. Use `layer` instead.
   */
  inline?: boolean;

  /**
   * @description The hierarchy of items available in the dropdown.
   */
  items: DropdownListItems;

  /**
   * @description Label to display above the select selector.
   */
  label?: string;

  /**
   * @description Application layer to append the floater to. Leave empty if floater is inline.
   */
  layer?: HTMLElement | "self" | "body";

  /**
   * @description Model for selected items.
   */
  modelValue: undefined | DropdownListItems;

  /**
   * @description Makes all selected items visible. Any expansion affects layout.
   * @deprecated This prop does nothing.
   */
  multiLine?: boolean;

  /**
   * @description Describes the content for screen readers.
   */
  wcagLabel: string;

  /**
   * @description Select size
   */
  size?: "medium" | "large";

  /**
   * @description Whether the field is required
   */
  required?: boolean;

  /**
   * @description Whether the select has an error state
   */
  invalid?: boolean;

  /**
   * @description Error message for validation feedback
   */
  error?: string;

  /**
   * @description Help text displayed below the select
   */
  helpText?: string;

  /**
   * @description Custom instructions for screen readers
   */
  instructions?: string;

  /**
   * @description Whether to show default instructions for screen readers
   */
  showInstructions?: boolean;
};

const props = withDefaults(defineProps<MultiSelectProps>(), {
  disabled: false,
  id: undefined,
  inline: true,
  label: undefined,
  layer: "body",
  multiLine: false,
  size: "medium",
  required: false,
  invalid: false,
  showInstructions: true,
});

if (!uniqueArrayValues(props.items, "id")) {
  throw new Error("CuiMultiSelect: Items must have unique IDs.");
}

const emit = defineEmits<{
  /**
   * Emitted when the selected value changes (for v-model support)
   * @arg {DropdownListItems} value - The selected items array
   */
  "update:modelValue": [value: DropdownListItems];
}>();
const selectedIds = ref<Array<number | string>>(
  props.modelValue?.map((item: DropdownListItem) => item.id) ?? [],
);
const localModel = computed({
  get() {
    return selectedIds.value;
  },
  set(value) {
    selectedIds.value =
      props.items
        ?.filter((item: DropdownListItem) => value?.includes(item.id))
        .map((item: DropdownListItem) => item.id) ?? [];
    emit(
      "update:modelValue",
      props.items?.filter((item: DropdownListItem) =>
        value?.includes(item.id),
      ) ?? [],
    );
  },
});

/**
 * MultiSelect classes for styling
 */
const selectClasses = computed(() => {
  const classes = ["cui-multiselect", "w-full", "text-xs"];

  // Size-specific classes
  if (props.size === "medium") {
    classes.push("h-8"); // 32px height for medium
  } else if (props.size === "large") {
    classes.push("h-10"); // 40px height for large
  }

  return classes;
});
</script>

<template>
  <CuiInputWrapper
    :label="label"
    :required="required"
    :error="error"
    :help-text="helpText"
    :disabled="disabled"
    :size="size"
    :instructions="instructions || wcagLabel"
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
      <VoltMultiSelect
        :id="wrapperId"
        v-model="localModel"
        :options="items"
        option-label="value"
        option-value="id"
        :placeholder="description"
        :disabled="disabled"
        option-disabled="disabled"
        display="chip"
        :append-to="props.layer"
        filter
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        :invalid="invalid"
        :class="[selectClasses, wrapperClasses]"
      />
    </template>
  </CuiInputWrapper>
</template>

<style scoped>
:deep(.cui-multiselect) {
  /* Ensure the select takes full width and height */
  width: 100% !important;
}

/* Size-specific styling */
:deep(.cui-multiselect.h-8) {
  /* Medium size specific styles */
  font-size: 0.75rem; /* 12px */
}

:deep(.cui-multiselect.h-10) {
  /* Large size specific styles */
  font-size: 0.875rem; /* 14px */
}
</style>
