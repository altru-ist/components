<template>
  <div class="cui-btn-dropdown">
    <!-- Split mode: Main button + separate dropdown trigger -->
    <VoltButtonGroup v-if="split">
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
        @click="toggleDropdown"
      >
        <span class="material-symbols-rounded">
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
        @click="toggleDropdown"
      >
        <slot name="label">
          <slot />
        </slot>
        
        <span 
          class="material-symbols-rounded dropdown-icon transition-transform duration-200 ease-in-out"
          :class="{ 'rotate-180': isOpen }"
        >
          {{ dropdownIcon }}
        </span>
      </VoltButton>
    </template>

    <!-- Dropdown content using VoltPopover -->
    <VoltPopover
      ref="popoverRef"
      v-model:visible="isOpen"
      :append-to="appendTo"
      :pt="{
        root: `mt-[5px] p-flipped:-mt-[5px] p-flipped:mb-[5px]
        bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0
        border border-surface-200 dark:border-surface-700
        rounded-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]
        p-flipped:before:bottom-auto p-flipped:before:top-full p-flipped:after:bottom-auto p-flipped:after:top-full
        p-flipped:after:border-b-transparent p-flipped:after:border-t-surface-0 dark:p-flipped:after:border-t-surface-900
        p-flipped:before:border-b-transparent p-flipped:before:border-t-surface-200 dark:p-flipped:before:border-t-surface-700`,
      }"
      :pt-options="{ mergeProps: true }"
      @show="handleShow"
      @hide="handleHide"
    >
      <div class="dropdown-content" :style="contentStyle">
        <slot name="default" />
      </div>
    </VoltPopover>
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

import { ref, computed, watch } from "vue";
import VoltButton from "primevue/button";
import VoltPopover from "../volt/VoltPopover.vue";
import VoltButtonGroup from "../volt/VoltButtonGroup.vue";
import { ptViewMerge } from "../volt/utils";
import { useButtonTheme } from "../composables/useButtonTheme";

// Component props interface
interface Props {
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

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
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
const popoverRef = ref();
const isOpen = ref(props.modelValue);

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue;
});

// Watch for internal isOpen changes and emit
watch(isOpen, (newValue) => {
  emit("update:modelValue", newValue);
});

// Computed styles for dropdown content
const contentStyle = computed(() => ({
  minWidth: props.contentMinWidth,
  maxWidth: props.contentMaxWidth,
}));

// Button themes using composable
const mainButtonTheme = useButtonTheme({
  variant: () => props.variant,
  size: () => props.size,
  floating: () => props.floating,
  isIconOnly: false,
});

const dropdownTriggerTheme = useButtonTheme({
  variant: () => props.variant,
  size: () => props.size,
  floating: () => props.floating,
  isIconOnly: true,
});

// Toggle dropdown visibility
const toggleDropdown = (event: Event) => {
  event.stopPropagation();
  
  if (props.disabled || props.loading) {
    return;
  }
  
  if (isOpen.value) {
    popoverRef.value?.hide();
  } else {
    emit("before-show");
    // Get the button element to anchor the popover
    const target = buttonRef.value?.$el || event.currentTarget;
    popoverRef.value?.show(event, target);
  }
};

// Handle main button click in split mode
const handleMainClick = (event: Event) => {
  emit("click", event as MouseEvent);
};

// Handle dropdown show
const handleShow = () => {
  isOpen.value = true;
  emit("show");
};

// Handle dropdown hide
const handleHide = () => {
  emit("before-hide");
  isOpen.value = false;
  emit("hide");
};

// Expose methods for programmatic control
defineExpose({
  /**
   * Toggle the dropdown visibility
   */
  toggle: toggleDropdown,
  
  /**
   * Show the dropdown
   */
  show: () => {
    if (!isOpen.value) {
      emit("before-show");
      popoverRef.value?.show();
    }
  },
  
  /**
   * Hide the dropdown
   */
  hide: () => {
    if (isOpen.value) {
      emit("before-hide");
      popoverRef.value?.hide();
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
</style>

