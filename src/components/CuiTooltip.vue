<template>
  <span ref="wrapperRef" :class="wrapperClass">
    <slot />
  </span>

  <CuiFloater
    v-if="value"
    v-model="actualVisible"
    :reference="wrapperRef"
    :position="floaterPosition"
    :activation="activationMethod"
    :padding="8"
    :flip="true"
    :shift="true"
    :layer="layerElement"
  >
    <div
      class="tooltip-container bg-gray-900 text-white text-sm px-3 py-2 rounded-md shadow-lg max-w-[200px] wrap-break-word relative"
      :class="tooltipClass"
    >
      <!-- Arrow pointer -->
      <div
        class="tooltip-arrow absolute w-2 h-2 bg-gray-900 rotate-45"
        :class="arrowPositionClass"
      ></div>

      <!-- Tooltip content -->
      <div class="relative z-10">
        {{ value }}
      </div>
    </div>
  </CuiFloater>
</template>

<script setup lang="ts">
/**
 * Tooltip
 *
 * A tooltip component that provides advisory information for components.
 * Built with CuiFloater, supports positioning, events, delays, and custom styling
 * with a black background and arrow pointer.
 */

import type { Placement } from "@floating-ui/dom";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import CuiFloater from "./CuiFloater.vue";

// Design System API
export interface CuiTooltipProps {
  /**
   * @description Tooltip text content
   */
  value: string;

  /**
   * @description Position of the tooltip relative to the target
   */
  position?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";

  /**
   * @description Event that triggers the tooltip display
   */
  event?: "hover" | "focus" | "click" | "manual";

  /**
   * @description Delay in milliseconds before showing tooltip
   */
  showDelay?: number;

  /**
   * @description Delay in milliseconds before hiding tooltip
   */
  hideDelay?: number;

  /**
   * @description Custom CSS classes for the tooltip
   */
  tooltipClass?: string;

  /**
   * @description Custom CSS classes for the wrapper element
   */
  wrapperClass?: string;

  /**
   * @description Controls tooltip visibility (for manual event type)
   */
  modelValue?: boolean;
}

const props = withDefaults(defineProps<CuiTooltipProps>(), {
  position: "top",
  event: "hover",
  showDelay: 0,
  hideDelay: 0,
  modelValue: false,
});

const emit = defineEmits<{
  /**
   * Emitted when the tooltip visibility changes (for v-model support)
   * @arg {boolean} value - The new visibility state
   */
  "update:modelValue": [value: boolean];

  /**
   * Emitted when the tooltip becomes visible
   */
  show: [];

  /**
   * Emitted when the tooltip becomes hidden
   */
  hide: [];
}>();

defineSlots<{
  /**
   * Default slot for the element that the tooltip wraps
   * This is the trigger element that users interact with to show the tooltip
   * Can be any element (button, input, icon, text, etc.)
   */
  default?: () => any;
}>();

// Component state
const wrapperRef = ref<HTMLElement | null>(null);
const isVisible = ref(props.modelValue);
const internalVisible = ref(props.modelValue); // Internal state for delay handling
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

// Layer element for floater
const layerElement = computed<HTMLDivElement | null>(() => {
  return typeof document !== "undefined"
    ? (document.body as HTMLDivElement)
    : null;
});

// Map event to CuiFloater activation
// If delays are specified, we need to use manual mode and handle events ourselves
const activationMethod = computed<"manual" | "click" | "hover" | "focus">(
  () => {
    if (props.showDelay > 0 || props.hideDelay > 0) {
      return "manual"; // Use manual mode when delays are involved
    }
    return props.event === "manual" ? "manual" : props.event;
  },
);

// Convert position to Placement type for CuiFloater
const floaterPosition = computed<Placement>(() => {
  return props.position as Placement;
});

// Compute arrow position classes based on tooltip position
const arrowPositionClass = computed(() => {
  const position = props.position;

  // For positions with arrows pointing to the reference element
  if (position.startsWith("top")) {
    return "bottom-[-4px] left-1/2 -translate-x-1/2"; // Arrow points down
  } else if (position.startsWith("bottom")) {
    return "top-[-4px] left-1/2 -translate-x-1/2"; // Arrow points up
  } else if (position.startsWith("left")) {
    return "right-[-4px] top-1/2 -translate-y-1/2"; // Arrow points right
  } else if (position.startsWith("right")) {
    return "left-[-4px] top-1/2 -translate-y-1/2"; // Arrow points left
  }

  // Default: top position
  return "bottom-[-4px] left-1/2 -translate-x-1/2";
});

// Helper functions for delay handling
const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
};

const showWithDelay = () => {
  clearTimers();
  if (props.showDelay > 0) {
    showTimer = setTimeout(() => {
      internalVisible.value = true;
    }, props.showDelay);
  } else {
    internalVisible.value = true;
  }
};

const hideWithDelay = () => {
  clearTimers();
  if (props.hideDelay > 0) {
    hideTimer = setTimeout(() => {
      internalVisible.value = false;
    }, props.hideDelay);
  } else {
    internalVisible.value = false;
  }
};

// Set up event listeners when delays are specified
onMounted(() => {
  if (
    (props.showDelay > 0 || props.hideDelay > 0) &&
    props.event !== "manual"
  ) {
    const wrapper = wrapperRef.value;
    if (!wrapper) return;

    switch (props.event) {
      case "hover":
        wrapper.addEventListener("mouseenter", showWithDelay);
        wrapper.addEventListener("mouseleave", hideWithDelay);
        break;
      case "focus":
        wrapper.addEventListener("focusin", showWithDelay);
        wrapper.addEventListener("focusout", hideWithDelay);
        break;
      case "click":
        wrapper.addEventListener("click", () => {
          if (internalVisible.value) {
            hideWithDelay();
          } else {
            showWithDelay();
          }
        });
        break;
    }
  }
});

// Cleanup timers and event listeners
onBeforeUnmount(() => {
  clearTimers();
  if (
    (props.showDelay > 0 || props.hideDelay > 0) &&
    props.event !== "manual"
  ) {
    const wrapper = wrapperRef.value;
    if (!wrapper) return;

    switch (props.event) {
      case "hover":
        wrapper.removeEventListener("mouseenter", showWithDelay);
        wrapper.removeEventListener("mouseleave", hideWithDelay);
        break;
      case "focus":
        wrapper.removeEventListener("focusin", showWithDelay);
        wrapper.removeEventListener("focusout", hideWithDelay);
        break;
      case "click":
        // Click handler is anonymous, can't remove specifically
        break;
    }
  }
});

// Use internalVisible when delays are involved, otherwise use isVisible
const actualVisible = computed(() => {
  if (props.showDelay > 0 || props.hideDelay > 0) {
    return internalVisible.value;
  }
  return isVisible.value;
});

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue;
    internalVisible.value = newValue;
  },
);

// Watch for internal visibility changes and emit
watch(actualVisible, (newValue) => {
  emit("update:modelValue", newValue);
  if (newValue) {
    emit("show");
  } else {
    emit("hide");
  }
});

/**
 * COMPONENT USAGE EXAMPLES:
 *
 * Basic usage:
 * <CuiTooltip value="Enter your username">
 *   <CuiTextInput />
 * </CuiTooltip>
 *
 * With position:
 * <CuiTooltip value="Help text" position="top">
 *   <CuiButton label="Save" />
 * </CuiTooltip>
 *
 * With focus event:
 * <CuiTooltip value="Enter your username" event="focus" position="top">
 *   <CuiTextInput />
 * </CuiTooltip>
 *
 * With click event:
 * <CuiTooltip value="Click to see more" event="click" position="bottom">
 *   <CuiButton label="Info" />
 * </CuiTooltip>
 *
 * Manual control:
 * <CuiTooltip v-model="showTooltip" value="Manual tooltip" event="manual">
 *   <CuiButton label="Hover over me" />
 * </CuiTooltip>
 *
 * With custom styling:
 * <CuiTooltip
 *   value="Custom tooltip"
 *   position="bottom"
 *   tooltip-class="!bg-blue-600 text-lg"
 * >
 *   <CuiButton label="Button" />
 * </CuiTooltip>
 *
 * ACCESSIBILITY NOTES:
 * - Tooltip automatically positions itself relative to the wrapped element
 * - Use tooltips for supplementary information, not essential content
 * - Consider keyboard users - tooltips on hover may not be accessible
 * - For essential information, use help text or labels instead
 * - Focus event is recommended for form elements
 */
</script>
