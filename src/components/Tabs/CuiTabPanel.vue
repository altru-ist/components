<script setup lang="ts">
/**
 * TabPanel
 *
 * Individual content panel associated with a tab. Shown when corresponding tab is active.
 * Use within TabPanels when building custom tab layouts with manual control.
 */

import VoltTabPanel from "../../volt/VoltTabPanel.vue";

export interface CuiTabPanelProps {
  /**
   * @description Value to identify the tab panel, should match with the corresponding tab's value.
   */
  value: string | number;
}

defineProps<CuiTabPanelProps>();

defineSlots<{
  /**
   * @description Default slot for panel content
   */
  default?: () => any;
}>();
</script>

<template>
  <VoltTabPanel :value="value" v-bind="$attrs">
    <slot />
  </VoltTabPanel>
</template>
