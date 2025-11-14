<script setup lang="ts">
/**
 * ToggleSwitch
 *
 * Accessible toggle switch for binary on/off states with support for labels, disabled states
 * with explanations, and flexible label positioning. Full keyboard accessibility included.
 */

import { getCurrentInstance, ref } from "vue";
import VoltToggleSwitch from "../volt/VoltToggleSwitch.vue";

type ToggleProps = {
  /**
   * @description Disables the toggle and sets aria-disabled to true.
   */
  disabled?: boolean;

  /**
   * @description Explanation for why the toggle is disabled (for accessibility).
   */
  disabledReason?: string;

  /**
   * @description Label for the toggle.
   */
  label?: string;

  /**
   * @description Position of the label relative to the toggle switch.
   */
  labelPosition?: "left" | "right";

  /**
   * @description The active state of the toggle.
   */
  modelValue: boolean;

  /**
   * @description Describes the content for screen readers.
   */
  wcagLabel?: string;
};

const props = withDefaults(defineProps<ToggleProps>(), {
  disabled: false,
  disabledReason: undefined,
  label: "This is a toggle",
  labelPosition: "right",
  wcagLabel: undefined,
});
const model = defineModel<ToggleProps["modelValue"]>();

const toggleRef = ref<HTMLLabelElement | null>(null);
const id = `toggle-switch-${getCurrentInstance()?.uid}`;
const disabledReasonId = `${id}-disabled-reason`;

// Handle click prevention for disabled state
const handleClick = (event: Event) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
  }
};

// Handle keydown prevention for disabled state
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled && (event.key === " " || event.key === "Enter")) {
    event.preventDefault();
    event.stopPropagation();
  }
};
</script>

<template>
  <div
    class="flex items-center group"
    :class="{
      'flex-row-reverse': labelPosition === 'left',
      'toggle-disabled': props.disabled,
    }"
  >
    <VoltToggleSwitch
      v-model="model"
      :aria-disabled="props.disabled ? 'true' : undefined"
      :aria-label="props.wcagLabel"
      :aria-describedby="
        props.disabled && props.disabledReason ? disabledReasonId : undefined
      "
      :input-id="id"
      @click="handleClick"
      @keydown="handleKeydown"
    />
    <label
      ref="toggleRef"
      :for="id"
      :class="[
        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        props.labelPosition === 'left' ? 'me-2' : 'ms-2',
      ]"
    >
      <span
        :class="disabled ? 'opacity-40' : ''"
        class="text-[var(--cui-text-header-body)] text-[var(--font-size-sm)]"
      >
        {{ label }}
      </span>
    </label>
    <div
      v-if="props.disabled && props.disabledReason"
      :id="disabledReasonId"
      class="sr-only"
    >
      {{ props.disabledReason }}
    </div>
  </div>
</template>
