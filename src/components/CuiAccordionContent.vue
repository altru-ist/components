<script setup lang="ts">
/**
 * AccordionContent
 *
 * Content component for AccordionPanel. Contains the collapsible content that appears when the panel is expanded.
 */

import VoltAccordionContent from "../volt/VoltAccordionContent.vue";

/**
 * Slots for accordion content customization
 */
const slots = defineSlots<{
  /**
   * Default slot for panel content
   */
  default?: () => any;
}>();
</script>

<template>
  <VoltAccordionContent>
    <template v-if="slots.default" #default>
      <slot />
    </template>
  </VoltAccordionContent>
</template>
