<template>
  <VoltDialog
    v-model:visible="visible"
    modal
    close-on-escape
    :header="header"
    :show-header="showHeader"
    :maximizable="showHeader"
    :closable="false"
    @after-hide="remove()"
  >
    <slot :close />
    <template v-if="hasSlotContent($slots.header)" #header>
      <slot name="header" />
    </template>
    <template v-if="hasSlotContent($slots.footer)" #footer>
      <div
        class="button-container"
        :class="{ 'with-border': showFooterBorder }"
      >
        <slot name="footer" />
      </div>
    </template>
  </VoltDialog>
</template>

<script setup lang="ts">
/**
 * Modal
 *
 * Flexible modal dialog with programmatic control, slot-based customization, and automatic
 * cleanup. Supports header, body, footer slots and dismissable behavior.
 */
import { computed } from "vue";
import { hasSlotContent } from "../../utils/slotsUtils";
import VoltDialog from "../../volt/VoltDialog.vue";
import { useModal } from "./composition";

// Define component name to satisfy multi-word requirement
defineOptions({
  name: "CuiModal",
});

defineProps<{
  /**
   * Controls the visibility state of the modal
   * @default false
   */
  open: boolean;
  /**
   * The title text displayed in the modal header
   * Only displayed when showHeader is true
   */
  header?: string;
  /**
   * Controls whether the header section is visible
   * When false, hides the entire header area including title and close button
   * @default true
   */
  showHeader?: boolean;
  /**
   * Controls whether the footer has a top border
   * @default true
   */
  showFooterBorder?: boolean;
}>();

defineSlots<{
  /**
   * Default slot for the main modal content
   * Provides a close function to programmatically close the modal
   * @arg {object} slotProps - The slot properties
   * @arg {() => void} slotProps.close - Function to close the modal
   *
   * @example
   * ```vue
   * <template #default="{ close }">
   *   <p>Your content here</p>
   *   <button @click="close">Close</button>
   * </template>
   * ```
   */
  default: (props: { close: () => void }) => any;
  /**
   * Header slot for custom header content
   * Replaces the default header when provided
   * Use this to create fully custom headers with your own layout and controls
   *
   * @example
   * ```vue
   * <template #header>
   *   <h2>Custom Header</h2>
   * </template>
   * ```
   */
  header: () => any;
  /**
   * Footer slot for custom footer content
   * Typically used for action buttons or additional information
   *
   * @example
   * ```vue
   * <template #footer>
   *   <button @click="save">Save</button>
   *   <button @click="cancel">Cancel</button>
   * </template>
   * ```
   */
  footer: () => any;
}>();

const {
  visible: modalVisible,
  remove,
  close,
} = useModal({ removeOnClose: false });

const visible = computed({
  get: () => modalVisible.value,
  set: (value: boolean) => {
    if (value) {
      // Handle opening if needed
    } else {
      close();
    }
  },
});
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0 1.25rem;
}

.button-container.with-border {
  border-top: 1px solid var(--cui-border-subtle);
}
</style>
