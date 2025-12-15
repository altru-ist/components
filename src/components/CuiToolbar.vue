<script setup lang="ts">
/**
 * Toolbar
 *
 * A horizontal grouping component for buttons and other content with start, center, and end sections.
 * Useful for creating action bars, form toolbars, and navigation strips.
 */

import { provide, computed } from "vue";
import { hasSlotContent } from "../utils/slotsUtils";

// Provide context for child components (like Button) to know they're inside a toolbar
provide("isInsideToolbar", true);

export interface CuiToolbarProps {
  /**
   * @description Accessibility label for the toolbar element
   */
  ariaLabelledby?: string;

  /**
   * @description Whether to show a border and horizontal padding. When false, padding left/right is 0 and no border is displayed.
   */
  border?: boolean;
}

const props = withDefaults(defineProps<CuiToolbarProps>(), {
  ariaLabelledby: undefined,
  border: false,
});

/**
 * Slots for toolbar content sections
 */
const slots = defineSlots<{
  /**
   * Default slot for toolbar content (renders in the start section)
   * @arg {object} slotProps - The slot properties (empty object)
   */
  default?: (props: Record<string, never>) => any;

  /**
   * Content aligned to the start (left) of the toolbar
   * @arg {object} slotProps - The slot properties (empty object)
   */
  start?: (props: Record<string, never>) => any;

  /**
   * Content aligned to the center of the toolbar
   * @arg {object} slotProps - The slot properties (empty object)
   */
  center?: (props: Record<string, never>) => any;

  /**
   * Content aligned to the end (right) of the toolbar
   * @arg {object} slotProps - The slot properties (empty object)
   */
  end?: (props: Record<string, never>) => any;
}>();

const hasStart = computed(() => hasSlotContent(slots.start));
const hasCenter = computed(() => hasSlotContent(slots.center));
const hasEnd = computed(() => hasSlotContent(slots.end));
const hasDefault = computed(() => hasSlotContent(slots.default));

// Use flex layout when: default slot is used, or only start/end (no center)
// Use grid layout when: center slot is used (needs 3-column layout)
const useFlexLayout = computed(() => {
  return hasDefault.value || !hasCenter.value;
});
</script>

<template>
  <div
    role="toolbar"
    :aria-labelledby="props.ariaLabelledby"
    class="items-center p-3 gap-2 relative w-full
           bg-surface-0 dark:bg-surface-900
           text-surface-700 dark:text-surface-0
           border border-surface-200 dark:border-surface-700 rounded-md"
    :class="{
      '!px-0 !border-0': !props.border,
      'flex flex-wrap justify-between': useFlexLayout,
      'grid grid-cols-[1fr_auto_1fr]': !useFlexLayout,
    }"
  >
    <slot>
      <!-- Flex layout: start and end only -->
      <template v-if="useFlexLayout">
        <div v-if="hasStart" class="gap-1 flex grow justify-start">
          <slot name="start" />
        </div>
        <div v-if="hasEnd" class="gap-1 flex shrink-0 flex-wrap justify-end">
          <slot name="end" />
        </div>
      </template>

      <!-- Grid layout: 3-column with center -->
      <template v-else>
        <div v-if="hasStart" class="gap-1 flex flex-wrap justify-start">
          <slot name="start" />
        </div>
        <div v-else />

        <div v-if="hasCenter" class="gap-1 flex flex-wrap justify-center">
          <slot name="center" />
        </div>
        <div v-else />

        <div v-if="hasEnd" class="gap-1 flex flex-wrap justify-end">
          <slot name="end" />
        </div>
        <div v-else />
      </template>
    </slot>
  </div>
</template>
