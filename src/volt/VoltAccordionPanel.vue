<template>
  <AccordionPanel
    v-bind="props"
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <slot></slot>
  </AccordionPanel>
</template>

<script setup lang="ts">
// @ts-nocheck
import AccordionPanel, {
  type AccordionPanelPassThroughOptions,
  type AccordionPanelProps,
} from "primevue/accordionpanel";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ AccordionPanelProps {}
const props = defineProps<Props>();

const theme = ref<AccordionPanelPassThroughOptions>({
  root: `flex flex-col dark:border-surface-700`,
});
</script>
