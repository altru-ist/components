<script setup lang="ts">
/**
 * Accordion
 *
 * Accordion component for grouping a collection of contents in panels.
 * Supports single or multiple active panels, controlled/uncontrolled modes, and custom headers.
 */

import VoltAccordion from "../volt/VoltAccordion.vue";

export interface CuiAccordionProps {
  /**
   * @description Value of the active panel(s). For single selection, use a string. For multiple selection, use an array of strings.
   */
  value?: string | string[];

  /**
   * @description Whether multiple panels can be active at the same time
   */
  multiple?: boolean;
}

const props = withDefaults(defineProps<CuiAccordionProps>(), {
  value: undefined,
  multiple: false,
});

/**
 * Emits for accordion events
 */
const emit = defineEmits<{
  /**
   * Emitted when the active panel(s) change (for v-model support)
   * @arg {string | string[]} value - The new active panel value(s)
   */
  "update:value": [value: string | string[]];
}>();

/**
 * Slots for accordion customization
 */
const slots = defineSlots<{
  /**
   * Default slot for accordion panels
   */
  default?: () => any;
}>();

/**
 * Handle value update from VoltAccordion
 */
const handleUpdateValue = (value: string | string[]) => {
  emit("update:value", value);
};
</script>

<template>
  <VoltAccordion
    :value="props.value"
    :multiple="props.multiple"
    @update:value="handleUpdateValue"
  >
    <template v-if="slots.default" #default>
      <slot />
    </template>
  </VoltAccordion>
</template>
