<script setup lang="ts">
/**
 * Tag
 *
 * Visual tag for displaying categorization, status indicators, or labels with severity-based
 * color coding. Supports icons, rounded variants, and multiple severity levels.
 */

import VoltTag from "../volt/VoltTag.vue";

type TagProps = {
  /**
   * @description The value to display in the tag
   */
  value?: string | number;

  /**
   * @description Severity level that determines the tag color scheme
   */
  severity: "success" | "info" | "warn" | "danger" | "neutral" | "other";

  /**
   * @description Icon to display in the tag (Material Symbols icon name)
   */
  icon?: string;
};

const props = withDefaults(defineProps<TagProps>(), {
  value: undefined,
  icon: undefined,
});

/**
 * Slots for icon customization
 */
const slots = defineSlots<{
  /**
   * Icon slot for custom icon content
   * @arg {object} slotProps - The icon slot properties
   */
  icon?: (props: Record<string, any>) => any;
}>();
</script>

<template>
  <VoltTag
    :value="props.value"
    :severity="props.severity"
    :icon="props.icon"
    :class="{
      '!bg-purple-100 dark:!bg-purple-500/15 !text-purple-700 dark:!text-purple-300':
        props.severity === 'other',
    }"
  >
    <template v-if="props.icon" #icon="iconProps">
      <slot name="icon" v-bind="iconProps">
        <span class="material-symbols-rounded !text-lg leading-none">{{
          props.icon
        }}</span>
      </slot>
    </template>
  </VoltTag>
</template>
