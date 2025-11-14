<template>
  <Accordion
    v-bind="$props"
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
    @update:value="$emit('update:value', $event)"
  >
    <slot></slot>
  </Accordion>
</template>

<script setup lang="ts">
// @ts-nocheck
import Accordion, {
  type AccordionPassThroughOptions,
  type AccordionProps,
} from "primevue/accordion";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ AccordionProps {}
defineProps<Props>();

defineEmits<{
  "update:value": [value: any];
}>();

const theme = ref<AccordionPassThroughOptions>({
  root: ``,
});
</script>
