<template>
  <Tab
    :value="props.value"
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <slot></slot>
  </Tab>
</template>

<script setup lang="ts">
// @ts-nocheck
import Tab, { type TabPassThroughOptions, type TabProps } from "primevue/tab";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ TabProps {}
const props = defineProps<Props>();

const theme = ref<TabPassThroughOptions>({
  root: `flex-shrink-0 cursor-pointer select-none relative whitespace-nowrap py-4 px-[1.125rem]
        border-b border-surface-200 dark:border-surface-700 font-semibold
        text-[var(--cui-text-muted)] dark:text-surface-400
        transition-colors duration-200 -mb-px
        not-p-active:enabled:hover:text-surface-700 dark:not-p-active:enabled:hover:text-surface-0
        p-active:border-primary p-active:text-[var(--cui-text-header-body)] p-active:border-b-2 p-active:border-b-amber-300 p-active:bg-[var(--cui-surface-navigation-light)]
        disabled:pointer-events-none disabled:opacity-60
        focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-primary`,
});
</script>
