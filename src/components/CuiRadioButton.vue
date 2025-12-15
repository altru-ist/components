<script setup lang="ts">
/**
 * RadioButton
 *
 * Flexible radio button supporting both default and card-based layouts. Card variant displays
 * options as interactive cards with images, titles, and descriptions for visual selection.
 */

import { getCurrentInstance } from "vue";
import VoltRadioButton from "../volt/VoltRadioButton.vue";
import CuiCard from "./CuiCard.vue";

export interface CuiRadioButtonProps {
  /**
   * @description Disables the radio button and sets aria-disabled to true.
   */
  disabled?: boolean;

  /**
   * @description The type of radio button display.
   */
  type?: "default" | "card";

  /**
   * @description Image source for card type radio buttons.
   */
  image?: string;

  /**
   * @description Card title for card type radio buttons.
   */
  cardTitle?: string;

  /**
   * @description Card text/description for card type radio buttons.
   */
  cardText?: string;
  /**
   * @description Input ID for the radio button, used for label association.
   */
  inputId?: string;

  /**
   * @description Model value of the radio button (v-model).
   */
  modelValue: string | undefined;

  /**
   * @description This is used to group radio buttons together. When multiple radio buttons have the same 'name', only one radio button in this group can be selected at a time.
   *  This is useful when you want to present a group of options to the user but only allow them to select one.
   */
  name: string;

  /**
   * @description subTitle of the radio button.
   */
  subTitle?: string;

  /**
   * @description Title of the radio button.
   */
  title: string;

  /**
   * @description Value of the radio button.
   */
  value: string;

  /**
   * @description Describes the content for screen readers.
   */
  wcagLabel: string;
}

const props = withDefaults(defineProps<CuiRadioButtonProps>(), {
  disabled: false,
  type: "default",
  subTitle: "",
  inputId: "",
});

const model = defineModel<CuiRadioButtonProps["modelValue"]>();

defineSlots<{
  /**
   * @description Default slot for additional content alongside the radio button label (only available for default type)
   */
  default?: () => any;
}>();

const idLocal =
  props.inputId || "radiobutton-" + getCurrentInstance()?.uid || "";

// Handle clicks when radio is card type
const handleCardClick = () => {
  if (!props.disabled) {
    model.value = props.value;
  }
};
</script>

<template>
  <!-- Default Type: Standard Radio Button -->
  <div
    v-if="type === 'default'"
    class="flex items-center gap-2"
    :class="[disabled ? 'cursor-not-allowed' : '']"
  >
    <VoltRadioButton
      v-model="model"
      :input-id="idLocal"
      :name="name"
      :value="value"
      :disabled="disabled"
      :aria-label="wcagLabel"
    />

    <label
      v-if="title"
      :aria-label="wcagLabel"
      :for="idLocal"
      class="radio-text-label"
      >{{ title }}</label
    >
    <slot />
  </div>

  <!-- Card Type: Card-based Radio Button -->
  <div
    v-else-if="type === 'card'"
    class="cursor-pointer transition-all duration-200 relative"
    :class="[
      disabled ? 'cursor-not-allowed opacity-50' : '',
      model === value
        ? 'ring-2 ring-black rounded-lg'
        : 'hover:ring-2 hover:ring-gray-400 hover:rounded-lg',
    ]"
    @click="!disabled ? handleCardClick() : undefined"
  >
    <!-- Card component -->
    <CuiCard
      variant="default"
      :title="cardTitle"
      :text="cardText"
      :image="image"
      :class="[
        'transition-all duration-200 h-full',
        model === value ? '' : 'grayscale-[0.7]',
      ]"
    />

    <!-- Visible radio input positioned over the card -->
    <div class="absolute top-2 left-2 z-10 pointer-events-none">
      <VoltRadioButton
        v-model="model"
        :input-id="idLocal"
        :name="name"
        :value="value"
        :disabled="disabled"
        :aria-label="wcagLabel"
      />
    </div>
  </div>
</template>

<style scoped>
.radio-text-label {
  cursor: pointer;
  font-size: 0.875rem; /* 14px - matches checkbox medium size */
  font-weight: 400;
  color: var(--cui-text-header-body);
  line-height: 1.5;
  user-select: none;
}
</style>
