<template>
  <div class="cui-btn-dropdown button-wrapper">
    <!-- Split mode: Main button + separate dropdown trigger -->
    <VoltButtonGroup v-if="split" ref="buttonGroupRef">
      <VoltButton
        unstyled
        :pt="mainButtonTheme"
        :pt-options="{ mergeProps: ptViewMerge }"
        :disabled="disabled"
        :loading="loading"
        :aria-label="ariaLabel"
        v-bind="buttonProps"
        @click="handleMainClick"
      >
        <slot name="label">
          <slot />
        </slot>
      </VoltButton>
      <VoltButton
        unstyled
        :pt="dropdownTriggerTheme"
        :pt-options="{ mergeProps: ptViewMerge }"
        :disabled="disabled"
        :aria-label="dropdownAriaLabel || 'Open dropdown menu'"
        :class="spacingClasses"
        @click="toggleDropdown"
      >
        <span
          class="material-symbols-rounded w-[35px] right-[4px] h-full flex-nowrap align-middle content-center"
          :class="{ 'rotate-180': isOpen }"
        >
          {{ dropdownIcon }}
        </span>
      </VoltButton>
    </VoltButtonGroup>

    <!-- Regular mode: Single button with dropdown -->
    <template v-else>
      <VoltButton
        ref="buttonRef"
        unstyled
        :pt="mainButtonTheme"
        :pt-options="{ mergeProps: ptViewMerge }"
        :disabled="disabled"
        :loading="loading"
        :aria-label="ariaLabel"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        v-bind="buttonProps"
        class="pr-10 whitespace-nowrap"
        @click="toggleDropdown"
      >
        <slot name="label">
          <span class="whitespace-nowrap">
            <slot />
          </span>
        </slot>

        <span
          class="absolute w-[35px] right-0 h-full flex-nowrap align-middle content-center material-symbols-rounded dropdown-icon transition-transform duration-200 ease-in-out"
          :class="{ 'rotate-180': isOpen }"
        >
          {{ dropdownIcon }}
        </span>
      </VoltButton>
    </template>

    <!-- Dropdown content using CuiFloater -->
    <CuiFloater
      ref="floaterRef"
      v-model="isOpen"
      :reference="buttonElement"
      :layer="layerElement"
      activation="manual"
      position="bottom-end"
      :padding="5"
      :flip="true"
      :shift="true"
      @show="handleShow"
      @hide="handleHide"
    >
      <div
        ref="dropdownContentRef"
        class="dropdown-content bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0 border border-surface-200 dark:border-surface-700 rounded-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
        :style="contentStyle"
      >
        <slot name="default" />
      </div>
    </CuiFloater>
  </div>
</template>

<script setup lang="ts">
/**
 * Button Dropdown
 *
 * A dropdown button component that combines a button with a dropdown menu/content.
 * Supports both regular mode (button opens dropdown) and split mode (separate dropdown trigger).
 * Similar to Quasar's QBtnDropdown but with VoltButton styling.
 */

import VoltButton from "primevue/button";
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { useButtonTheme } from "../composables/useButtonTheme";
import { ptViewMerge } from "../volt/utils";
import VoltButtonGroup from "../volt/VoltButtonGroup.vue";
import CuiFloater from "./CuiFloater.vue";

// Component props interface
export interface CuiButtonDropdownProps {
  /** Visual variant of the button */
  variant?: "hero" | "primary" | "secondary-outline" | "secondary-text";

  /** Size of the button */
  size?: "small" | "medium" | "large";

  /** Whether the button is disabled */
  disabled?: boolean;

  /** Whether the button is in loading state */
  loading?: boolean;

  /** Whether the button should have a floating shadow */
  floating?: boolean;

  /** Whether to use split mode (main button + separate dropdown trigger) */
  split?: boolean;

  /** Custom dropdown icon name (Material Symbols) */
  dropdownIcon?: string;

  /** Accessible label for the button */
  ariaLabel?: string;

  /** Accessible label for the dropdown trigger (split mode) */
  dropdownAriaLabel?: string;

  /** Controls dropdown visibility (v-model support) */
  modelValue?: boolean;

  /** Element to append the dropdown to (default: body) */
  appendTo?: string | HTMLElement;

  /** Minimum width for dropdown content */
  contentMinWidth?: string;

  /** Maximum width for dropdown content */
  contentMaxWidth?: string;

  /** Additional button props to pass through */
  buttonProps?: Record<string, any>;
}

const props = withDefaults(defineProps<CuiButtonDropdownProps>(), {
  size: "medium",
  disabled: false,
  loading: false,
  floating: false,
  split: false,
  dropdownIcon: "arrow_drop_down",
  modelValue: false,
  appendTo: "body",
  contentMinWidth: "200px",
  contentMaxWidth: "400px",
});

// Inject toolbar context to determine default variant
const isInsideToolbar = inject("isInsideToolbar", false);

// Compute effective variant based on context
const effectiveVariant = computed(() => {
  if (props.variant) {
    return props.variant;
  }
  // Default to secondary-outline when inside toolbar, primary otherwise
  return isInsideToolbar ? "secondary-outline" : "primary";
});

// Events
const emit = defineEmits<{
  /**
   * Emitted when the dropdown visibility changes (v-model support)
   * @arg {boolean} value - The new visibility state
   */
  "update:modelValue": [value: boolean];

  /**
   * Emitted when the dropdown is opened
   */
  show: [];

  /**
   * Emitted when the dropdown is closed
   */
  hide: [];

  /**
   * Emitted when the main button is clicked (split mode only)
   * @arg {MouseEvent} event - The click event
   */
  click: [event: MouseEvent];

  /**
   * Emitted before the dropdown is shown
   */
  "before-show": [];

  /**
   * Emitted before the dropdown is hidden
   */
  "before-hide": [];
}>();

// Slots
const slots = defineSlots<{
  /**
   * Default slot for dropdown content
   * Use this to provide the menu items or custom content that appears in the dropdown
   */
  default?: () => any;

  /**
   * Label slot for button text content
   * Use this to customize the button label
   * Falls back to the default slot if not provided
   */
  label?: () => any;
}>();

// Component state
const buttonRef = ref();
const buttonGroupRef = ref();
const floaterRef = ref();
const dropdownContentRef = ref<HTMLDivElement | null>(null);
const isOpen = ref(props.modelValue);
const triggerWidth = ref(0);
const buttonElement = computed(() => buttonRef.value?.$el || null);
const buttonGroupElement = computed(() => buttonGroupRef.value?.$el || null);

// Get the trigger element (button or button group depending on mode)
const triggerElement = computed(() => {
  return props.split ? buttonGroupElement.value : buttonElement.value;
});

// Update trigger width when needed
const updateTriggerWidth = () => {
  const el = triggerElement.value;
  if (el) {
    triggerWidth.value = el.offsetWidth;
  }
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  const dropdownContent = dropdownContentRef.value;
  const button = buttonElement.value;
  const buttonGroup = buttonGroupElement.value;

  // Check if click is outside dropdown content and outside the trigger button(s)
  const isOutsideDropdown =
    dropdownContent && !dropdownContent.contains(target);
  const isOutsideButton = !button || !button.contains(target);
  const isOutsideButtonGroup = !buttonGroup || !buttonGroup.contains(target);

  if (isOutsideDropdown && isOutsideButton && isOutsideButtonGroup) {
    isOpen.value = false;
  }
};

// Manage click outside listener based on open state
watch(isOpen, (newValue) => {
  emit("update:modelValue", newValue);

  if (newValue) {
    // Update trigger width when opening
    updateTriggerWidth();
    // Add listener when opening (use nextTick via setTimeout to avoid immediate trigger)
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});

// Handle menu hide event (from CuiMenu autoClose)
const handleMenuHide = () => {
  isOpen.value = false;
};

// Setup menu hide listener when dropdown content is available
watch(dropdownContentRef, (newRef, oldRef) => {
  if (oldRef) {
    oldRef.removeEventListener("cui-menu-hide", handleMenuHide);
  }
  if (newRef) {
    newRef.addEventListener("cui-menu-hide", handleMenuHide);
  }
});

// Cleanup on unmount
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  dropdownContentRef.value?.removeEventListener(
    "cui-menu-hide",
    handleMenuHide,
  );
});

// Compute layer element
const layerElement = computed<HTMLDivElement | null>(() => {
  if (props.appendTo === "body") {
    return typeof document !== "undefined"
      ? (document.body as HTMLDivElement)
      : null;
  }
  if (typeof props.appendTo === "string") {
    return typeof document !== "undefined"
      ? (document.querySelector(props.appendTo) as HTMLDivElement)
      : null;
  }
  return props.appendTo as HTMLDivElement;
});

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
  },
);

// Computed styles for dropdown content
const contentStyle = computed(() => {
  // Use trigger width as minimum, but respect contentMinWidth prop as a floor
  const triggerMinWidth = triggerWidth.value
    ? `${triggerWidth.value}px`
    : props.contentMinWidth;

  return {
    minWidth: triggerMinWidth,
    maxWidth: props.contentMaxWidth,
  };
});

// Button themes using composable
const mainButtonTheme = useButtonTheme({
  variant: () => effectiveVariant.value,
  size: () => props.size,
  floating: () => props.floating,
  isIconOnly: false,
});

const dropdownTriggerTheme = useButtonTheme({
  variant: () => effectiveVariant.value,
  size: () => props.size,
  floating: () => props.floating,
  isIconOnly: true,
});

// Spacing classes for dropdown trigger in split mode (left margin for hero/primary variants)
const spacingClasses = computed(() => ({
  "ml-[1px]":
    effectiveVariant.value === "hero" || effectiveVariant.value === "primary",
}));

// Toggle dropdown visibility
const toggleDropdown = (event: Event) => {
  event.stopPropagation();

  if (props.disabled || props.loading) {
    return;
  }

  if (!isOpen.value) {
    emit("before-show");
  } else {
    emit("before-hide");
  }

  isOpen.value = !isOpen.value;
};

// Handle main button click in split mode
const handleMainClick = (event: Event) => {
  emit("click", event as MouseEvent);
};

// Handle dropdown show
const handleShow = () => {
  emit("show");
};

// Handle dropdown hide
const handleHide = () => {
  emit("hide");
};

// Expose methods for programmatic control
defineExpose({
  /**
   * Toggle the dropdown visibility
   */
  toggle: () => {
    if (!isOpen.value) {
      emit("before-show");
    } else {
      emit("before-hide");
    }
    isOpen.value = !isOpen.value;
  },

  /**
   * Show the dropdown
   */
  show: () => {
    if (!isOpen.value) {
      emit("before-show");
      isOpen.value = true;
    }
  },

  /**
   * Hide the dropdown
   */
  hide: () => {
    if (isOpen.value) {
      emit("before-hide");
      isOpen.value = false;
    }
  },
});
</script>

<style scoped>
.cui-btn-dropdown {
  display: inline-flex;
  align-items: center;
}

.dropdown-icon {
  font-size: 1.25em;
  margin-left: 0.25rem;
}

.dropdown-content {
  padding: 0.5rem 0;
}

/* Remove border and padding when CuiMenu is used in the default slot */
.dropdown-content:has([role="menu"]) {
  padding: 0;
  border: none;
}
</style>
