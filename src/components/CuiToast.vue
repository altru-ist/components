<!--
  Toast.vue - Design System Toast Component
  
  This component wraps VoltToast to provide:
  1. Toast notification API via ToastService
  2. Brand styling using our design tokens
  3. Multiple severity levels with consistent theming
  4. Flexible positioning and grouping
  
  WRAPPER PATTERN BENEFITS:
  - API Stability: Changes in Volt don't affect our public API
  - Brand Consistency: All styling comes from our design tokens
  - Service Integration: Works with PrimeVue's ToastService
  - Accessibility Preservation: Volt's accessibility features pass through
  
  USAGE:
  1. Install ToastService in your app:
     import ToastService from 'primevue/toastservice';
     app.use(ToastService);
  
  2. Add Toast component to your template:
     <CuiToast />
  
  3. Use the toast service to show messages:
     import { useToast } from 'primevue/usetoast';
     const toast = useToast();
     toast.add({ severity: 'success', summary: 'Success', detail: 'Message sent!', life: 3000 });
-->

<template>
  <VoltToast
    :position="position"
    :group="group"
    :autoZIndex="autoZIndex"
    :baseZIndex="baseZIndex"
    v-bind="$attrs"
    @close="emit('close', $event)"
    @life-end="emit('life-end', $event)"
  >
    <!-- Forward all slots to VoltToast -->
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName as string" v-bind="slotProps ?? {}" />
    </template>
  </VoltToast>
</template>

<script setup lang="ts">
// @ts-nocheck
/**
 * Toast
 *
 * Toast notification component for displaying temporary messages
 * via PrimeVue's ToastService. Toast messages are controlled programmatically
 * using the useToast composable rather than through component props.
 *
 * @example
 * // Basic usage
 * import { useToast } from 'primevue/usetoast';
 * const toast = useToast();
 * toast.add({ severity: 'success', summary: 'Success', detail: 'Operation completed', life: 3000 });
 *
 * @example
 * // Using groups and positions
 * // In template
 * <CuiToast position="top-left" group="tl" />
 * <CuiToast position="bottom-right" group="br" />
 *
 * // In script
 * toast.add({ severity: 'info', summary: 'Info', detail: 'Top left message', group: 'tl' });
 * toast.add({ severity: 'warn', summary: 'Warning', detail: 'Bottom right message', group: 'br' });
 */

import VoltToast from "../volt/VoltToast.vue";

// Design System API
interface Props {
  /**
   * @description Position of the toast on the screen. Determines where toast messages will appear.
   * Available positions: 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'center'
   * @default 'top-right'
   */
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "center";

  /**
   * @description Group key to target specific toast instances. Multiple Toast components can be used with different groups
   * to show messages in different locations simultaneously. Use the same group key when calling toast.add() to target this instance.
   */
  group?: string;

  /**
   * @description Whether to automatically manage z-index to keep toast above other elements
   * @default true
   */
  autoZIndex?: boolean;

  /**
   * @description Base z-index value to use for automatic z-index calculation
   * @default 0
   */
  baseZIndex?: number;
}

withDefaults(defineProps<Props>(), {
  position: "top-right",
  autoZIndex: true,
  baseZIndex: 0,
});

// Events
const emit = defineEmits<{
  /**
   * Emitted when a toast message is closed
   * @arg {object} message - The message object that was closed
   */
  close: [message: any];

  /**
   * Emitted when the life duration of a toast message ends
   * @arg {object} message - The message object whose life ended
   */
  "life-end": [message: any];
}>();

// Slots - Document the available slots from PrimeVue Toast
const slots = defineSlots<{
  /**
   * Custom message template to fully control the appearance of each toast message.
   * Use this slot to create custom layouts with different content arrangements.
   * @arg {object} slotProps - The message slot properties
   * @arg {object} slotProps.message - The message object containing severity, summary, detail, and other properties
   * @arg {Function} slotProps.closeCallback - Function to call to close this specific message
   */
  message?: (props: { message: any; closeCallback: () => void }) => any;

  /**
   * Container template for headless mode. Provides complete control over the entire toast container.
   * Use this for fully custom toast implementations with custom styling and layouts.
   * Typically used with severity: 'custom' in the message.
   * @arg {object} slotProps - The container slot properties
   * @arg {object} slotProps.message - The message object
   * @arg {Function} slotProps.closeCallback - Function to close the message
   */
  container?: (props: { message: any; closeCallback: () => void }) => any;

  /**
   * Custom icon template to override the default severity icons.
   * Use this to provide custom icons for different message severities.
   * @arg {object} slotProps - The icon slot properties
   * @arg {object} slotProps.message - The message object to determine which icon to show
   */
  icon?: (props: { message: any }) => any;

  /**
   * Custom close icon template (Note: VoltToast already provides a Material Symbols close icon).
   * Use this only if you need a different close icon style.
   */
  closeicon?: () => any;
}>();

/**
 * TOAST SERVICE USAGE:
 *
 * The Toast component is controlled via ToastService, not through props.
 *
 * Setup (in main.ts or App.vue):
 * ```typescript
 * import { createApp } from 'vue';
 * import ToastService from 'primevue/toastservice';
 * const app = createApp(App);
 * app.use(ToastService);
 * ```
 *
 * Using in components:
 * ```typescript
 * import { useToast } from 'primevue/usetoast';
 * const toast = useToast();
 *
 * // Show a message
 * toast.add({
 *   severity: 'success',  // 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | 'custom'
 *   summary: 'Success',   // Title of the message
 *   detail: 'Operation completed successfully',  // Detailed message content
 *   life: 3000,          // Duration in milliseconds (omit for sticky messages)
 *   group: 'br'          // Target specific Toast instance by group
 * });
 *
 * // Remove all messages
 * toast.removeAllGroups();
 *
 * // Remove messages from specific group
 * toast.removeGroup('br');
 * ```
 *
 * Severity Options:
 * - success: Green themed success messages
 * - info: Blue themed informational messages
 * - warn: Yellow themed warning messages
 * - error: Red themed error messages
 * - secondary: Neutral gray themed messages
 * - contrast: High contrast dark/light themed messages
 * - custom: Use with container slot for fully custom styling
 *
 * Message Properties:
 * - severity: string - Message type (required)
 * - summary: string - Message title (optional)
 * - detail: string - Message body (optional)
 * - life: number - Duration in ms before auto-dismiss (optional, omit for sticky)
 * - group: string - Target specific Toast instance (optional)
 * - closable: boolean - Whether message can be manually closed (default: true)
 * - sticky: boolean - Alternative to omitting life, makes message persist (optional)
 * - styleClass: string - Additional CSS classes for the message (optional)
 */
</script>
