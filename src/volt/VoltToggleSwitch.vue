<template>
  <ToggleSwitch
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </ToggleSwitch>
</template>

<script setup lang="ts">
// @ts-nocheck
import ToggleSwitch, {
  type ToggleSwitchPassThroughOptions,
  type ToggleSwitchProps,
} from "primevue/toggleswitch";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ ToggleSwitchProps {}
defineProps<Props>();

const theme = ref<ToggleSwitchPassThroughOptions>({
  root: `inline-block w-10 h-6 group-[.toggle-disabled]:opacity-40 group-[.toggle-disabled]:cursor-not-allowed`,
  input: `peer cursor-pointer group-[.toggle-disabled]:cursor-not-allowed appearance-none absolute top-0 start-0 w-full h-full m-0 p-0 opacity-0 z-10 rounded-[30px]`,
  slider: `inline-block w-full h-full rounded-[30px] shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
        bg-surface-300 dark:bg-surface-700
        border border-transparent
        transition-colors duration-200
        peer-hover:bg-surface-400 dark:peer-hover:bg-surface-600
        group-[.toggle-disabled]:peer-hover:!bg-surface-300 dark:group-[.toggle-disabled]:peer-hover:!bg-surface-700
        p-checked:bg-[var(--cui-surface-secondary-action)] 
        peer-hover:p-checked:bg-[color-mix(in_srgb,var(--cui-surface-secondary-action)_80%,white)]
        group-[.toggle-disabled]:peer-hover:p-checked:!bg-[var(--cui-surface-secondary-action)]
        p-invalid:border-red-400 dark:p-invalid:border-red-300
        peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--cui-surface-secondary-action)]`,
  handle: `absolute top-1/2 flex justify-center items-center
        bg-surface-0 dark:bg-surface-400
        text-surface-500 dark:text-surface-900
        w-4 h-4 start-1 -mt-2 rounded-full
        transition-[background,color,left] duration-200
        p-checked:bg-surface-0 dark:p-checked:bg-surface-900 p-checked:text-primary p-checked:start-5
}`,
});
</script>
