<template>
  <SplitPanel
    :orientation="orientation"
    :direction="direction"
    :primary="primary || undefined"
    :divider-hit-area="dividerHitArea"
    :size-unit="sizeUnit"
    :disabled="disabled"
    :min-size="minSize ?? undefined"
    :max-size="maxSize ?? undefined"
    :collapsible="collapsible"
    :collapse-threshold="collapseThreshold ?? undefined"
    :collapsed-size="collapsedSize ?? undefined"
    :transition-duration="transitionDuration"
    :transition-timing-function-expand="transitionTimingFunctionExpand"
    :transition-timing-function-collapse="transitionTimingFunctionCollapse"
    :snap-points="snapPoints.length > 0 ? snapPoints : undefined"
    :snap-threshold="snapThreshold"
    :ui="ui || undefined"
    v-model:size="internalSize"
    v-model:collapsed="internalCollapsed"
    :class="splitterClass"
  >
    <template #start>
      <slot name="start" />
    </template>

    <template #divider>
      <slot name="divider">
        <div class="h-full bg-muted hover:bg-primary min-w-2 min-h-2" />
      </slot>
    </template>

    <template #end>
      <slot name="end" />
    </template>
  </SplitPanel>
</template>

<script setup lang="ts">
/**
 * Splitter
 *
 * A resizable split panel component that divides content into two resizable panels.
 * Supports horizontal and vertical orientations, collapsible panels, snap points, and transitions.
 * Based on @directus/vue-split-panel.
 */

import { SplitPanel } from "@directus/vue-split-panel";
import { computed, ref, watch } from "vue";

// Design System API - Only expose props we want in our public API
export interface CuiSplitterProps {
  /** Set the rendering orientation */
  orientation?: "horizontal" | "vertical";
  /** Sets the panels text direction */
  direction?: "ltr" | "rtl";
  /** Designates which panel is primary (start or end). If not set, both panels resize equally */
  primary?: "start" | "end";
  /** CSS size to define the hitbox area around the divider slot */
  dividerHitArea?: string;
  /** Whether size, minSize, maxSize, and collapseThreshold are configured in percentages (0-100) or pixel values */
  sizeUnit?: "%" | "px";
  /** Disable the manual resizing/collapsing of the panels */
  disabled?: boolean;
  /** Minimum allowed size of the primary panel. Requires primary to be set */
  minSize?: number;
  /** Maximum allowed size of the primary panel. Requires primary to be set */
  maxSize?: number;
  /** Whether to allow the primary panel to be collapsed on enter key on divider or when the collapse threshold is met */
  collapsible?: boolean;
  /** How far to drag beyond the minSize to collapse/expand the primary panel */
  collapseThreshold?: number;
  /** How much of the collapsed panel is visible in its collapsed state */
  collapsedSize?: number;
  /** Duration of the collapse/expand transition in ms */
  transitionDuration?: number;
  /** CSS timing function for the expand transition */
  transitionTimingFunctionExpand?: string;
  /** CSS timing function for the collapse transition */
  transitionTimingFunctionCollapse?: string;
  /** Where to snap the primary panel to during dragging operations */
  snapPoints?: number[];
  /** How close the divider must be to a snap point for snapping to occur */
  snapThreshold?: number;
  /** Inject additional classes in the slot container elements */
  ui?: {
    start?: string;
    divider?: string;
    end?: string;
  };
  /** The current size of the start panel */
  size?: number;
  /** Whether the primary panel is currently collapsed */
  collapsed?: boolean;
}

const props = withDefaults(defineProps<CuiSplitterProps>(), {
  orientation: "horizontal",
  direction: "ltr",
  dividerHitArea: "12px",
  sizeUnit: "%",
  disabled: false,
  collapsible: false,
  transitionDuration: 0,
  transitionTimingFunctionExpand: "cubic-bezier(0, 0, 0.2, 1)",
  transitionTimingFunctionCollapse: "cubic-bezier(0.4, 0, 0.6, 1)",
  snapPoints: () => [],
  snapThreshold: 8,
});

// Define slots with JSDoc documentation
const slots = defineSlots<{
  /**
   * Start panel slot - content for the left/top panel
   */
  start: () => any;

  /**
   * End panel slot - content for the right/bottom panel
   */
  end: () => any;

  /**
   * Divider slot - custom divider element between panels
   * If not provided, a default divider will be rendered
   */
  divider: () => any;
}>();

// Events we want to expose
const emit = defineEmits<{
  /**
   * Emitted when the size of the start panel changes
   * @arg {number} size - The new size value
   */
  "update:size": [size: number];

  /**
   * Emitted when the collapsed state changes
   * @arg {boolean} collapsed - The new collapsed state
   */
  "update:collapsed": [collapsed: boolean];
}>();

// Internal state for v-model bindings
const internalSize = ref(props.size ?? 50);
const internalCollapsed = ref(props.collapsed ?? false);

// Sync with props when they change
watch(
  () => props.size,
  (newSize) => {
    if (newSize !== undefined) {
      internalSize.value = newSize;
    }
  },
);

watch(
  () => props.collapsed,
  (newCollapsed) => {
    if (newCollapsed !== undefined) {
      internalCollapsed.value = newCollapsed;
    }
  },
);

// Watch internal changes and emit updates
watch(internalSize, (newSize) => {
  emit("update:size", newSize);
});

watch(internalCollapsed, (newCollapsed) => {
  emit("update:collapsed", newCollapsed);
});

// Computed class for the splitter wrapper
const splitterClass = computed(() => {
  return [
    "cui-splitter",
    props.orientation === "vertical"
      ? "cui-splitter-vertical"
      : "cui-splitter-horizontal",
  ].join(" ");
});
</script>

<style>
/* Minimal styling - let the library handle layout */
.cui-splitter {
  width: 100%;
  height: 100%;
}

.sp-root {
  display: grid;
}
.sp-root.sp-collapsing {
  transition-duration: var(--4dbe2ceb-transitionDurationCss);
  transition-timing-function: var(--4dbe2ceb-transitionTimingFunctionCollapse);
}
.sp-root.sp-expanding {
  transition-duration: var(--4dbe2ceb-transitionDurationCss);
  transition-timing-function: var(--4dbe2ceb-transitionTimingFunctionExpand);
}
.sp-root.sp-horizontal {
  grid-template-columns: var(--4dbe2ceb-gridTemplate);
}
.sp-root.sp-horizontal.sp-collapsing,
.sp-root.sp-horizontal.sp-expanding {
  transition-property: grid-template-columns;
}
.sp-root.sp-horizontal.sp-dragging {
  cursor: ew-resize;
}
.sp-root.sp-vertical {
  grid-template-rows: var(--4dbe2ceb-gridTemplate);
}
.sp-root.sp-vertical.sp-collapsing,
.sp-root.sp-vertical.sp-expanding {
  transition-property: grid-template-rows;
}
.sp-root.sp-vertical.sp-dragging {
  cursor: ns-resize;
}
.sp-root.sp-dragging {
  user-select: none;
}

.sp-start,
.sp-end {
  overflow: hidden;
}

.sp-divider {
  position: relative;
  z-index: 1;
}
.sp-divider:not(.disabled) > :first-child::after {
  content: "";
  position: absolute;
}
.sp-divider:not(.disabled).sp-horizontal {
  min-width: 2px;
  min-height: 2px;
}
.sp-divider:not(.disabled).sp-horizontal {
  block-size: 100%;
  inline-size: max-content;
}
.sp-divider:not(.disabled).sp-horizontal > :first-child::after {
  block-size: 100%;
  inset-inline-start: calc(
    var(--4dbe2ceb-dividerHitArea) / -2 + var(--4dbe2ceb-dividerSize) * 1px / 2
  );
  inset-block-start: 0;
  inline-size: var(--4dbe2ceb-dividerHitArea);
  cursor: ew-resize;
}
.sp-divider:not(.disabled).sp-vertical {
  inline-size: 100%;
  block-size: max-content;
}
.sp-divider:not(.disabled).sp-vertical > :first-child::after {
  inline-size: 100%;
  inset-block-start: calc(
    var(--4dbe2ceb-dividerHitArea) / -2 + var(--4dbe2ceb-dividerSize) * 1px / 2
  );
  inset-inline-start: 0;
  block-size: var(--4dbe2ceb-dividerHitArea);
  cursor: ns-resize;
}
</style>
