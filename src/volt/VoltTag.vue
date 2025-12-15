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
        p-success:bg-[var(--cui-surface-success-light)] p-success:text-[var(--cui-text-success-small)]
        p-info:bg-[var(--cui-surface-info-light)] p-info:text-[var(--cui-text-info-small)]
        p-warn:bg-[var(--cui-surface-warn-light)] p-warn:text-[var(--cui-text-warn-small)]
        p-danger:bg-[var(--cui-surface-danger-light)] p-danger:text-[var(--cui-text-danger-small)]
        p-neutral:bg-surface-100 dark:p-neutral:bg-surface-800 p-neutral:text-surface-600 dark:p-neutral:text-surface-300
        p-other:bg-purple-100 dark:p-other:bg-purple-500/15 p-other:text-purple-700 dark:p-other:text-purple-300`,
  icon: `!text-lg w-[1.125rem] h-[1.125rem] leading-none`,
});
</script>
