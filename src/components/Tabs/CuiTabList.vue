<script setup lang="ts">
/**
 * TabList
 *
 * Container for tab headers providing accessible structure for tab navigation. Wrap Tab
 * components when building custom layouts. Handles ARIA attributes and keyboard navigation.
 */

import VoltTabList from "../../volt/VoltTabList.vue";

type CuiTabListProps = {
  /**
   * @description Describes the content for screen readers.
   */
  wcagLabel?: string;
};

defineProps<CuiTabListProps>();

defineSlots<{
  /**
   * @description Default slot for tab components
   */
  default?: () => any;
}>();
</script>

<template>
  <VoltTabList :aria-label="wcagLabel" v-bind="$attrs">
    <slot />
  </VoltTabList>
</template>
