<template>
  <Chip
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #removeicon="{ removeCallback, keydownCallback }">
      <span
        class="material-symbols-rounded pt-[1px] cursor-pointer w-5 h-5 rounded-full text-surface-800 dark:text-surface-0 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
        style="font-size: 20px"
        @click="removeCallback"
        @keydown="keydownCallback"
      >
        cancel
      </span>
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </Chip>
</template>

<script setup lang="ts">
// @ts-nocheck
import Chip, {
  type ChipPassThroughOptions,
  type ChipProps,
} from "primevue/chip";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// Accept all ChipProps except icon which we handle via slot
interface Props extends /* @vue-ignore */ ChipProps {}
const props = defineProps<Props>();

const theme = ref<ChipPassThroughOptions>({
  root: `inline-flex items-center rounded-2xl gap-2 px-3 py-1
        bg-surface-100 dark:bg-surface-800
        text-surface-800 dark:text-surface-0
        has-[img]:pt-1 has-[img]:pb-1
        p-removable:pe-2
        hover:brightness-90`,
  image: `rounded-full w-6 h-6 -ms-2`,
  icon: `text-surface-800 dark:text-surface-0 w-5 h-5`,
});
</script>
