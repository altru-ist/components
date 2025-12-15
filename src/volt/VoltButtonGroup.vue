<template>
  <ButtonGroup
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template
      v-for="slotName in slotNames"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </ButtonGroup>
</template>

<script setup lang="ts">
import ButtonGroup, {
  type ButtonGroupPassThroughOptions,
  type ButtonGroupProps,
} from "primevue/buttongroup";
import { computed, ref, useSlots, type Slots } from "vue";
import { ptViewMerge } from "./utils";

export interface Props extends /* @vue-ignore */ ButtonGroupProps {}
defineProps<Props>();

const slots: Slots = useSlots();
const slotNames = computed<string[]>(() => Object.keys(slots));

const theme = ref<ButtonGroupPassThroughOptions>({
  root: `flex *:rounded-none *:first:rounded-s-md *:last:rounded-e-md
        *:focus-visible:relative *:focus-visible:z-10 *:not-last:border-r-0`,
});
</script>
