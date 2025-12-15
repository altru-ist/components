<script setup lang="ts">
/**
 * AccordionPanel
 *
 * Individual panel component for Accordion. Each panel must have a unique value.
 */

import VoltAccordionPanel from "../volt/VoltAccordionPanel.vue";

export interface CuiAccordionPanelProps {
  /**
   * @description Unique value identifier for this panel
   */
  value: string;
}

const props = defineProps<CuiAccordionPanelProps>();

/**
 * Slots for accordion panel customization
 */
const slots = defineSlots<{
  /**
   * Default slot for accordion panel content (typically AccordionHeader and AccordionContent)
   */
  default?: () => any;
}>();
</script>

<template>
  <VoltAccordionPanel :value="props.value">
    <template v-if="slots.default" #default>
      <slot />
    </template>
  </VoltAccordionPanel>
</template>
