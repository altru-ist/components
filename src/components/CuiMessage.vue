<script setup lang="ts">
/**
 * Message
 *
 * Inline message component for displaying notifications, alerts, and feedback with various
 * severity levels. Supports closable messages, custom icons, and automatic dismissal.
 */

import { computed } from "vue";
import { hasSlotContent } from "../utils/slotsUtils";
import VoltMessage from "../volt/VoltMessage.vue";

export interface CuiMessageProps {
  /**
   * @description Severity level that determines the message color scheme
   */
  severity?: "success" | "info" | "warn" | "error" | "secondary";

  /**
   * @description Whether the message can be closed manually using the close icon
   */
  closable?: boolean;

  /**
   * @description Delay in milliseconds to close the message automatically
   */
  life?: number;

  /**
   * @description Display a custom icon for the message (Material Symbols icon name)
   */
  icon?: string;

  /**
   * @description Icon to display in the message close button (Material Symbols icon name)
   */
  closeIcon?: string;

  /**
   * @description Specifies the variant of the component
   */
  variant?: "outlined" | "simple";

  /**
   * @description Title text displayed in bold above the message content
   */
  title?: string;

  /**
   * @description Message content text displayed below the title
   */
  content?: string;
}

const props = withDefaults(defineProps<CuiMessageProps>(), {
  severity: "info",
  closable: false,
  life: undefined,
  icon: undefined,
  closeIcon: undefined,
  variant: undefined,
  title: undefined,
  content: undefined,
});

/**
 * Emits for message events
 */
const emit = defineEmits<{
  /**
   * Emitted when a message is closed
   * @arg {Event} event - Browser event
   */
  close: [event: Event];

  /**
   * Emitted when the message's timeout is over
   */
  "life-end": [];
}>();

/**
 * Slots for message customization
 */
const slots = defineSlots<{
  /**
   * Default slot for the message content
   */
  default?: () => any;

  /**
   * Custom message icon template
   * @arg {object} slotProps - The icon slot properties
   * @arg {any} slotProps.class - Style class of the item icon element
   */
  icon?: (props: { class: any }) => any;

  /**
   * Custom close icon template
   * @arg {object} slotProps - The close icon slot properties
   * @arg {any} slotProps.class - Style class of the item icon element
   */
  closeicon?: (props: { class: any }) => any;

  /**
   * Custom container slot
   * @arg {object} slotProps - The container slot properties
   * @arg {() => void} slotProps.closeCallback - Close message function
   */
  container?: (props: { closeCallback: () => void }) => any;
}>();

/**
 * Default icons for each severity level (Material Symbols icon names)
 */
const severityIcons: Record<string, string> = {
  success: "check_circle",
  info: "info",
  warn: "warning",
  error: "error",
};

/**
 * Resolved icon - uses custom icon if provided, otherwise uses severity default
 */
const resolvedIcon = computed(() => {
  if (props.icon) return props.icon;
  return severityIcons[props.severity] ?? undefined;
});
</script>

<template>
  <VoltMessage
    :severity="props.severity"
    :closable="props.closable"
    :life="props.life"
    :icon="resolvedIcon"
    :closeIcon="props.closeIcon"
    :variant="props.variant"
    @close="emit('close', $event)"
    @life-end="emit('life-end')"
  >
    <!-- Slot forwarding -->
    <template
      v-if="hasSlotContent(slots.default) || props.title || props.content"
      #default
    >
      <slot>
        <div class="flex flex-col">
          <span v-if="props.title" class="font-semibold">{{
            props.title
          }}</span>
          <span
            v-if="props.content"
            class="text-sm text-[var(--cui-text-header-body)]"
            >{{ props.content }}</span
          >
        </div>
      </slot>
    </template>

    <template
      v-if="hasSlotContent(slots.icon) || resolvedIcon"
      #icon="iconProps"
    >
      <slot name="icon" v-bind="iconProps">
        <span class="material-symbols-rounded">{{ resolvedIcon }}</span>
      </slot>
    </template>

    <template
      v-if="hasSlotContent(slots.closeicon)"
      #closeicon="closeIconProps"
    >
      <slot name="closeicon" v-bind="closeIconProps" />
    </template>

    <template
      v-if="hasSlotContent(slots.container)"
      #container="containerProps"
    >
      <slot name="container" v-bind="containerProps" />
    </template>
  </VoltMessage>
</template>
