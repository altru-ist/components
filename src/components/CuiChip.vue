<script setup lang="ts">
/**
 * Chip
 *
 * Compact, interactive element for displaying contacts, tags, or selections with support
 * for icons, images, removability, and selection states. Ideal for multi-select interfaces.
 */

import VoltChip from "../volt/VoltChip.vue";

type ChipProps = {
  /**
   * @description The text label to display in the chip
   */
  label?: string;

  /**
   * @description URL of the image to display in the chip
   */
  image?: string;

  /**
   * @description Icon to display in the chip (Material Symbols icon name)
   */
  icon?: string;

  /**
   * @description Whether the chip can be removed/dismissed
   */
  removable?: boolean;

  /**
   * @description Whether the chip can be selected/toggled
   */
  selectable?: boolean;

  /**
   * @description The selected state of the chip (for v-model support)
   */
  modelValue?: boolean;
};

const props = withDefaults(defineProps<ChipProps>(), {
  label: undefined,
  image: undefined,
  icon: undefined,
  removable: false,
  selectable: false,
  modelValue: false,
});

/**
 * Events emitted by the Chip component
 */
const emit = defineEmits<{
  /**
   * Emitted when the remove icon is clicked
   * @arg {Event} event - The click event
   */
  remove: [event: Event];

  /**
   * Emitted when the selected state changes (for v-model support)
   * @arg {boolean} value - The new selected state
   */
  "update:modelValue": [value: boolean];
}>();

// Handle remove event from VoltChip
const handleRemove = (event: Event) => {
  emit("remove", event);
};

// Handle selection toggle
const handleClick = () => {
  if (props.selectable) {
    emit("update:modelValue", !props.modelValue);
  }
};
</script>

<template>
  <VoltChip
    :label="props.label"
    :image="props.image"
    :icon="props.icon"
    :removable="props.removable"
    :class="{
      'cursor-pointer': props.selectable,
      '!bg-[var(--cui-surface-navigation)] dark:!bg-[var(--cui-surface-navigation)]':
        props.selectable && props.modelValue,
    }"
    @click="handleClick"
    @remove="handleRemove"
  >
    <template #icon v-if="props.icon">
      <span class="material-symbols-rounded w-5 h-5" style="font-size: 20px">{{
        props.icon
      }}</span>
    </template>
  </VoltChip>
</template>
