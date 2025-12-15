<script setup lang="ts">
/**
 * Tab
 *
 * Individual tab header within a TabList. Use for custom tab layouts with manual control.
 * For automatic tab rendering from data, use the Tabs component instead.
 */

import VoltTab from "../../volt/VoltTab.vue";

export interface CuiTabProps {
  /**
   * @description Value to identify the tab, should match with the corresponding tab panel's value.
   */
  value: string | number;

  /**
   * @description Describes the tab content for screen readers.
   */
  wcagLabel?: string;

  /**
   * @description Whether the tab is disabled.
   */
  disabled?: boolean;
}

defineProps<CuiTabProps>();

defineSlots<{
  /**
   * Default slot for tab content
   */
  default?: () => any;
}>();
</script>

<template>
  <VoltTab
    :value="value"
    :disabled="disabled"
    :aria-label="wcagLabel"
    v-bind="$attrs"
  >
    <slot />
  </VoltTab>
</template>
