<script setup lang="ts">
/**
 * TabPanels
 *
 * Container for tab content panels managing display of active panel. Wrap TabPanel components
 * when building custom layouts. Coordinates with TabList for active panel selection.
 */

import VoltTabPanels from "../../volt/VoltTabPanels.vue";

defineSlots<{
  /**
   * @description Default slot for tab panel components
   */
  default?: () => any;
}>();
</script>

<template>
  <VoltTabPanels v-bind="$attrs">
    <slot />
  </VoltTabPanels>
</template>
