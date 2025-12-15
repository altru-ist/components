<script setup lang="ts">
/**
 * AccordionHeader
 *
 * Header component for AccordionPanel. Displays the panel title and toggle icon.
 */

import VoltAccordionHeader from "../volt/VoltAccordionHeader.vue";

/**
 * Slots for accordion header customization
 */
const slots = defineSlots<{
  /**
   * Default slot for header content (title text)
   */
  default?: () => any;

  /**
   * Custom toggle icon template
   * @arg {object} slotProps - The toggle icon slot properties
   * @arg {boolean} slotProps.active - Whether the panel is active/expanded
   */
  toggleicon?: (props: { active?: boolean }) => any;
}>();
</script>

<template>
  <VoltAccordionHeader>
    <template v-if="slots.default" #default>
      <slot />
    </template>
    <template v-if="slots.toggleicon" #toggleicon="toggleProps">
      <slot name="toggleicon" v-bind="toggleProps" />
    </template>
  </VoltAccordionHeader>
</template>
