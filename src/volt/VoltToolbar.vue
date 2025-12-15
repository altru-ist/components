<template>
  <Toolbar
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" v-if="hasSlotContent($slots[slotName])" />
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import Toolbar, {
  type ToolbarPassThroughOptions,
  type ToolbarProps,
} from "primevue/toolbar";  
import { ref } from "vue";
import { ptViewMerge } from "./utils";
import { hasSlotContent } from "../utils/slotsUtils";

interface Props extends /* @vue-ignore */ ToolbarProps {}
defineProps<Props>();

const theme = ref<ToolbarPassThroughOptions>({
  root: `grid grid-cols-[1fr_auto_1fr] items-center p-3 gap-2 relative w-full
        bg-surface-0 dark:bg-surface-900
        text-surface-700 dark:text-surface-0
        border border-surface-200 dark:border-surface-700 rounded-md`,
  start: `gap-1 flex flex-wrap justify-start empty:hidden`,
  center: `gap-1 flex flex-wrap justify-center`,
  end: `gap-1 flex flex-wrap justify-end empty:hidden`,
});
</script>
