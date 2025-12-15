<script setup lang="ts">
/**
 * Floater
 *
 * A floating element component that positions itself relative to a reference element
 * using Floating UI. Supports positioning, flipping, shifting, and can be rendered
 * inline or moved to a specific layer (e.g., body or portal).
 */

import {
  autoUpdate,
  computePosition,
  flip as Flip,
  offset,
  shift as Shift,
  type ComputePositionConfig,
  type Placement,
} from "@floating-ui/dom";
import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect,
  type CSSProperties,
} from "vue";

export interface CuiFloaterProps {
  /**
   * @description How the floater is activated/shown.
   * - `'manual'` - Visibility controlled manually via v-model (default)
   * - `'click'` - Toggle on click
   * - `'hover'` - Show on hover/mouseenter, hide on mouseleave
   * - `'focus'` - Show on focus, hide on blur
   * - `'touch'` - Show on touchstart, hide on touchend (mobile)
   */
  activation?: "manual" | "click" | "hover" | "focus" | "touch";

  /**
   * @description Flip the floater on overflow.
   */
  flip?: boolean;

  /**
   * @description If the floater is inline or moved to the body element.
   * @deprecated Whether or not the floater is inline or not is now handled by the `layer` prop.
   */
  inline?: boolean;

  /**
   * @description Application layer to append the floater to. Leave empty if floater is inline.
   */
  layer?: HTMLDivElement | null;

  /**
   * @description The spacing between the floating element and its reference.
   */
  padding?: number;

  /**
   * @description Positioning of the floating element relative to the reference element.
   * @type {Placement}
   * Valid values:
   * - `'top'` - Above the reference, centered
   * - `'top-start'` - Above the reference, aligned to start
   * - `'top-end'` - Above the reference, aligned to end
   * - `'bottom'` - Below the reference, centered
   * - `'bottom-start'` - Below the reference, aligned to start (default)
   * - `'bottom-end'` - Below the reference, aligned to end
   * - `'left'` - To the left of the reference, centered
   * - `'left-start'` - To the left of the reference, aligned to start
   * - `'left-end'` - To the left of the reference, aligned to end
   * - `'right'` - To the right of the reference, centered
   * - `'right-start'` - To the right of the reference, aligned to start
   * - `'right-end'` - To the right of the reference, aligned to end
   */
  position?: Placement;

  /**
   * @description The element that the floater uses as a reference for positioning.
   */
  reference: HTMLElement | null;

  /**
   * @description Makes the floater sticky on both axes.
   */
  shift?: boolean;

  /**
   * @description Controls the visibility of the floater (for v-model support).
   */
  modelValue?: boolean;
}

const props = withDefaults(defineProps<CuiFloaterProps>(), {
  activation: "manual",
  flip: true,
  padding: 5,
  position: "bottom-start",
  layer: null,
  inline: undefined,
  shift: true,
  modelValue: undefined,
});

const emit = defineEmits<{
  /**
   * Emitted when the floater visibility changes (for v-model support)
   * @arg {boolean} value - The new visibility state
   */
  "update:modelValue": [value: boolean];

  /**
   * Emitted when the floater becomes visible
   * @arg {HTMLElement | null} reference - The reference element
   */
  show: [reference: HTMLElement | null];

  /**
   * Emitted when the floater becomes hidden
   * @arg {HTMLElement | null} reference - The reference element
   */
  hide: [reference: HTMLElement | null];
}>();

defineSlots<{
  /**
   * @description Content of the floater.
   */
  default?: void;
}>();

const floater = ref<HTMLElement | null>(null);
const floatingStyles = ref<CSSProperties>({
  position: "absolute",
  left: "0px",
  top: "0px",
  pointerEvents: "auto",
  zIndex: "9999",
});

let cleanup: (() => void) | null = null;
const originalParent = ref<Node | null>(null);

// Internal visibility state
// For manual mode with no v-model, default to true; otherwise start hidden
const isVisible = ref(
  props.activation === "manual"
    ? (props.modelValue ?? true)
    : (props.modelValue ?? false),
);

// Computed visibility for template
const shouldShow = computed(() => {
  if (props.activation === "manual") {
    // When manual and no v-model provided, default to visible
    return props.modelValue ?? true;
  }
  return isVisible.value;
});

// Update visibility when modelValue changes
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (newValue !== undefined && newValue !== oldValue) {
      isVisible.value = newValue;
      // Emit show/hide events when modelValue changes externally
      if (newValue) {
        emit("show", props.reference);
      } else {
        emit("hide", props.reference);
      }
    }
  },
);

// Handle activation events
const setupActivationListeners = () => {
  if (!props.reference || props.activation === "manual") {
    return;
  }

  const reference = props.reference;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  const clearHideTimeout = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  };

  const show = () => {
    clearHideTimeout();
    isVisible.value = true;
    emit("update:modelValue", true);
    emit("show", reference);
  };

  const hide = () => {
    // Add delay for hover/focus to allow moving between elements
    hideTimeout = setTimeout(() => {
      isVisible.value = false;
      emit("update:modelValue", false);
      emit("hide", reference);
    }, 150);
  };

  const toggle = () => {
    clearHideTimeout();
    const newValue = !isVisible.value;
    isVisible.value = newValue;
    emit("update:modelValue", newValue);
    if (newValue) {
      emit("show", reference);
    } else {
      emit("hide", reference);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    // Check if click is on reference or floater or any of their children
    const target = e.target as Node;
    const isRefClick = reference.contains(target);
    const isFloaterClick = floater.value?.contains(target);

    if (isVisible.value && !isRefClick && !isFloaterClick) {
      isVisible.value = false;
      emit("update:modelValue", false);
      emit("hide", reference);
    }
  };

  const handleFloaterMouseEnter = () => {
    if (props.activation === "hover") {
      clearHideTimeout();
    }
  };

  const handleFloaterMouseLeave = () => {
    if (props.activation === "hover") {
      hide();
    }
  };

  // Remove any existing listeners first
  const removeListeners = () => {
    clearHideTimeout();
    reference.removeEventListener("click", toggle);
    reference.removeEventListener("mouseenter", show);
    reference.removeEventListener("mouseleave", hide);
    reference.removeEventListener("focusin", show);
    reference.removeEventListener("focusout", hide);
    reference.removeEventListener("touchstart", show);
    reference.removeEventListener("touchend", hide);
    document.removeEventListener("click", handleClickOutside);
  };

  removeListeners();

  // Add listeners based on activation type
  switch (props.activation) {
    case "click":
      // Use bubble phase for click to ensure other handlers fire first
      reference.addEventListener("click", toggle);
      // Click outside listener
      document.addEventListener("click", handleClickOutside);
      break;
    case "hover":
      reference.addEventListener("mouseenter", show);
      reference.addEventListener("mouseleave", hide);
      break;
    case "focus":
      reference.addEventListener("focusin", show);
      reference.addEventListener("focusout", hide);
      break;
    case "touch":
      reference.addEventListener("touchstart", show);
      reference.addEventListener("touchend", hide);
      break;
  }

  return {
    removeListeners,
    handleFloaterMouseEnter,
    handleFloaterMouseLeave,
  };
};

let activationHandlers: ReturnType<typeof setupActivationListeners> | null =
  null;

function updatePosition(retryCount = 0) {
  if (!props.reference || !floater.value) {
    if (retryCount < 5) {
      setTimeout(() => updatePosition(retryCount + 1), 100);
    }
    return;
  }
  const config: ComputePositionConfig = {
    placement: props.position,
    middleware: [
      offset(props.padding),
      props.flip ? Flip() : null,
      props.shift ? Shift({ crossAxis: true, mainAxis: true }) : null,
    ].filter(Boolean),
  };
  computePosition(props.reference, floater.value, config).then(
    ({ x, y }: { x: number; y: number }) => {
      floatingStyles.value = {
        ...floatingStyles.value,
        left: `${x}px`,
        top: `${y - 1}px`,
      } as CSSProperties;
    },
  );
}

onBeforeUnmount(() => {
  if (cleanup) cleanup();
  if (
    props.layer !== null &&
    floater.value &&
    props.layer.contains(floater.value)
  ) {
    props.layer.removeChild(floater.value);
  }
});

// Setup activation listeners when reference is available
watch(
  [() => props.reference, () => props.activation],
  () => {
    if (activationHandlers) {
      activationHandlers.removeListeners();
      activationHandlers = null;
    }
    if (props.reference && props.activation !== "manual") {
      const handlers = setupActivationListeners();
      if (handlers) {
        activationHandlers = handlers;
      }
    }
  },
  { immediate: true },
);

// Setup floater hover listeners when floater element is created
watch(
  () => floater.value,
  (newFloater, oldFloater) => {
    // Remove listeners from old floater
    if (oldFloater && activationHandlers) {
      oldFloater.removeEventListener(
        "mouseenter",
        activationHandlers.handleFloaterMouseEnter,
      );
      oldFloater.removeEventListener(
        "mouseleave",
        activationHandlers.handleFloaterMouseLeave,
      );
    }

    // Add listeners to new floater
    if (newFloater && activationHandlers && props.activation === "hover") {
      newFloater.addEventListener(
        "mouseenter",
        activationHandlers.handleFloaterMouseEnter,
      );
      newFloater.addEventListener(
        "mouseleave",
        activationHandlers.handleFloaterMouseLeave,
      );
    }
  },
);

watchEffect(() => {
  if (floater.value && props.reference) {
    if (props.layer !== null) {
      originalParent.value = floater.value.parentNode;
      props.layer.appendChild(floater.value);
    }
    cleanup = autoUpdate(props.reference, floater.value, updatePosition);
  }
  updatePosition();
});

onBeforeUnmount(() => {
  if (activationHandlers) {
    activationHandlers.removeListeners();
  }
});
</script>

<template>
  <div v-if="shouldShow" ref="floater" :style="floatingStyles">
    <slot />
  </div>
</template>
