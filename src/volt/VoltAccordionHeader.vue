// @ts-expect-error
<template>
  <AccordionHeader
    v-bind="$props"
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <!-- @vue-expect-error -->
    <template #toggleicon="{ active }: { active?: boolean }">
      <span v-if="active" class="material-symbols-rounded">expand_less</span>
      <span v-else class="material-symbols-rounded">expand_more</span>
    </template>
    <slot></slot>
  </AccordionHeader>
</template>

<script setup lang="ts">
// @ts-nocheck
import AccordionHeader, {
  type AccordionHeaderPassThroughOptions,
  type AccordionHeaderProps,
} from "primevue/accordionheader";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ AccordionHeaderProps {}
defineProps<Props>();

const theme = ref<AccordionHeaderPassThroughOptions>({
  root: `cursor-pointer disabled:pointer-events-none disabled:opacity-60 flex items-center justify-between p-[1.125rem] font-semibold
        bg-surface-0 dark:bg-surface-900
        text-surface-500 dark:text-surface-400
        hover:text-surface-700 dark:hover:text-surface-0
        p-active:text-surface-700 dark:p-active:text-surface-0
        transition-colors duration-200
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-primary`,
});
</script>
