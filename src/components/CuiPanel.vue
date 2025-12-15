<script setup lang="ts">
/**
 * Panel
 *
 * Collapsible panel component for organizing content into expandable/collapsible sections.
 * Supports custom headers, toggleable content, and flexible content organization.
 */

import VoltPanel from "../volt/VoltPanel.vue";

export interface CuiPanelProps {
  /**
   * @description Header text of the panel
   */
  header?: string;

  /**
   * @description Whether the panel is toggleable (collapsible)
   */
  toggleable?: boolean;

  /**
   * @description Whether the panel is initially collapsed
   */
  collapsed?: boolean;

  /**
   * @description Placement of the toggle button in the header
   */
  togglePlacement?: "left" | "right";
}

const props = withDefaults(defineProps<CuiPanelProps>(), {
  header: undefined,
  toggleable: false,
  collapsed: false,
  togglePlacement: "right",
});

/**
 * Emits for panel events
 */
const emit = defineEmits<{
  /**
   * Emitted when the panel is toggled (collapsed/expanded)
   * @arg {boolean} collapsed - The new collapsed state
   */
  toggle: [collapsed: boolean];

  /**
   * Emitted when the collapsed state changes (for v-model support)
   * @arg {boolean} value - The new collapsed state
   */
  "update:collapsed": [value: boolean];
}>();

/**
 * Slots for panel customization
 */
const slots = defineSlots<{
  /**
   * Default slot for the panel content
   */
  default?: () => any;

  /**
   * Custom header template
   * @arg {object} slotProps - The header slot properties
   * @arg {string} slotProps.id - Unique identifier of the panel
   * @arg {string} slotProps.class - Style class of the header
   */
  header?: (props: { id: string; class: any }) => any;

  /**
   * Custom icons slot for additional header actions
   * @arg {object} slotProps - The icons slot properties
   * @arg {boolean} slotProps.collapsed - Whether the panel is collapsed
   */
  icons?: (props: { collapsed: boolean }) => any;

  /**
   * Footer slot for additional content at the bottom of the panel
   */
  footer?: () => any;

  /**
   * Custom toggle button template
   * @arg {object} slotProps - The toggle button slot properties
   * @arg {boolean} slotProps.collapsed - Whether the panel is collapsed
   * @arg {() => void} slotProps.toggleCallback - Function to toggle the panel
   * @arg {(event: KeyboardEvent) => void} slotProps.keydownCallback - Keyboard handler
   */
  togglebutton?: (props: {
    collapsed: boolean;
    toggleCallback: () => void;
    keydownCallback: (event: KeyboardEvent) => void;
  }) => any;
}>();

/**
 * Handle toggle event from VoltPanel
 */
const handleToggle = (event: { value: boolean }) => {
  emit("toggle", event.value);
  emit("update:collapsed", event.value);
};
</script>

<template>
  <VoltPanel
    :header="props.header"
    :toggleable="props.toggleable"
    :collapsed="props.collapsed"
    :toggle-placement="props.togglePlacement"
    @toggle="handleToggle"
  >
    <!-- Slot forwarding -->
    <template v-if="slots.default" #default>
      <slot />
    </template>

    <template v-if="slots.header" #header="headerProps">
      <slot name="header" v-bind="headerProps" />
    </template>

    <template v-if="slots.icons" #icons="iconsProps">
      <slot name="icons" v-bind="iconsProps" />
    </template>

    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>

    <template v-if="slots.togglebutton" #togglebutton="toggleProps">
      <slot name="togglebutton" v-bind="toggleProps" />
    </template>
  </VoltPanel>
</template>
