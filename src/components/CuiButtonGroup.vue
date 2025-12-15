<template>
  <div
    class="cui-button-group"
    :class="[orientation === 'vertical' ? 'flex-col' : 'flex-row']"
    role="group"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Button Group
 *
 * Groups multiple CuiButton or CuiButtonDropdown components together with connected styling.
 * Only the first and last buttons maintain rounded corners, creating
 * a seamless grouped appearance.
 */

// Design System API
export interface CuiButtonGroupProps {
  /** Orientation of the button group */
  orientation?: "horizontal" | "vertical";
  /** Accessible label for the button group */
  ariaLabel?: string;
}

withDefaults(defineProps<CuiButtonGroupProps>(), {
  orientation: "horizontal",
});

defineSlots<{
  /**
   * Default slot for CuiButton or CuiButtonDropdown components
   * All buttons placed in this slot will be visually grouped
   */
  default: () => any;
}>();
</script>

<style scoped>
.cui-button-group {
  display: inline-flex;
  isolation: isolate;
}

/* Horizontal layout - target all buttons */
.cui-button-group.flex-row
  :deep(.button-wrapper:not(:first-child):not(:last-child) button) {
  border-radius: 0 !important;
  border-right: 0 !important;
}

.cui-button-group.flex-row :deep(.button-wrapper:first-child button) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.cui-button-group.flex-row :deep(.button-wrapper:last-child button) {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

/* Prevent double borders in horizontal layout */
.cui-button-group.flex-row :deep(.button-wrapper:not(:first-child) button) {
  margin-left: -1px;
}

/* Ensure hover states stay above adjacent buttons */
.cui-button-group.flex-row :deep(.button-wrapper:hover),
.cui-button-group.flex-row :deep(.button-wrapper:focus-within) {
  z-index: 1;
}

/* Vertical layout - target all buttons */
.cui-button-group.flex-col
  :deep(.button-wrapper:not(:first-child):not(:last-child) button) {
  border-radius: 0 !important;
}

.cui-button-group.flex-col :deep(.button-wrapper:first-child button) {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.cui-button-group.flex-col :deep(.button-wrapper:last-child button) {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

/* Prevent double borders in vertical layout */
.cui-button-group.flex-col :deep(.button-wrapper:not(:first-child) button) {
  margin-top: -1px;
}

/* Ensure hover states stay above adjacent buttons */
.cui-button-group.flex-col :deep(.button-wrapper:hover),
.cui-button-group.flex-col :deep(.button-wrapper:focus-within) {
  z-index: 1;
}

/* Handle single button case - keep all corners rounded */
.cui-button-group :deep(.button-wrapper:only-child button) {
  border-radius: inherit;
}
</style>
