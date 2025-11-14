<template>
  <Tag
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
    :value="props.value"
    :severity="props.severity"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </Tag>
</template>

<script setup lang="ts">
// @ts-nocheck
import Tag, { type TagPassThroughOptions, type TagProps } from "primevue/tag";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ TagProps {}
const props = defineProps<Props>();

const theme = ref<TagPassThroughOptions>({
  root: `inline-flex items-center justify-center text-xs py-1 px-2 rounded-md gap-1 leading-none h-[22px] p-rounded:rounded-2xl
        bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300
        p-success:bg-green-100 dark:p-success:bg-green-500/15 p-success:text-green-700 dark:p-success:text-green-300
        p-info:bg-sky-100 dark:p-info:bg-sky-500/15 p-info:text-sky-700 dark:p-info:text-sky-300
        p-warn:bg-orange-100 dark:p-warn:bg-orange-500/15 p-warn:text-orange-700 dark:p-warn:text-orange-300
        p-danger:bg-red-100 dark:p-danger:bg-red-500/15 p-danger:text-red-700 dark:p-danger:text-red-300
        p-neutral:bg-surface-100 dark:p-neutral:bg-surface-800 p-neutral:text-surface-600 dark:p-neutral:text-surface-300
        p-other:bg-purple-100 dark:p-other:bg-purple-500/15 p-other:text-purple-700 dark:p-other:text-purple-300`,
  icon: `!text-lg w-[1.125rem] h-[1.125rem] leading-none`,
});
</script>
