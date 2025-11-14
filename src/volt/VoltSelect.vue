<template>
  <Select
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #dropdownicon>
      <span class="material-symbols-rounded text-surface-400">{{
        props.rightIcon || "expand_more"
      }}</span>
    </template>
    <template #loadingicon>
      <span class="material-symbols-rounded animate-spin">autorenew</span>
    </template>
    <template #filtericon>
      <span class="material-symbols-rounded text-surface-400">search</span>
    </template>
    <template #clearicon="{ clearCallback }">
      <span
        @click="clearCallback"
        class="material-symbols-rounded h-8 w-8 text-center !text-lg text-surface-400 absolute top-0 end-10 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200 cursor-pointer flex items-center justify-center pt-0.5"
        style="top: 3px"
        >close</span
      >
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </Select>
</template>

<script setup lang="ts">
// @ts-nocheck
import Select, {
  type SelectPassThroughOptions,
  type SelectProps,
} from "primevue/select";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ SelectProps {
  /** Right icon (Material Symbols Rounded) to override default dropdown icon */
  rightIcon?: string;
}
const props = defineProps<Props>();

const theme = ref<SelectPassThroughOptions>({
  root: `inline-flex cursor-pointer relative select-none rounded-md p-fluid:flex w-full h-10 outline-hidden
        bg-surface-0 dark:bg-surface-950
        border border-surface-300 dark:border-surface-700
        hover:border-surface-800 dark:hover:border-surface-600
        p-focus:outline-none p-focus:ring-2 focp-focusus:ring-[var(--cui-border-focus)] p-focus:ring-offset-2
        p-invalid:border-red-400 dark:p-invalid:border-red-300
        p-disabled:p-readonly:bg-surface-100 p-readonly:text-surface-800 dark:p-readonly:bg-surface-700 dark:p-readonly:text-surface-400 p-readonly:pointer-events-none
        p-disabled:bg-surface-200 p-disabled:text-surface-500 dark:p-disabled:bg-surface-700 dark:p-disabled:text-surface-400 p-disabled:pointer-events-none
        shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
        transition-colors duration-200`,
  label: `flex items-center whitespace-nowrap overflow-hidden flex-auto w-[1%]
        py-2 px-3 overflow-ellipsis 
        p-clearable:pe-7 p-empty:overflow-hidden p-empty:opacity-0 p-editable:cursor-default
        text-surface-700 dark:text-surface-0 bg-transparent border-none outline-none
        p-placeholder:text-surface-500 dark:p-placeholder:text-surface-400
        p-disabled:text-surface-500 dark:p-disabled:text-surface-400
        text-sm`,
  dropdown: `flex items-center justify-center shrink-0 bg-transparent
        text-surface-400 w-10 rounded-e-md`,
  overlay: `absolute top-0 left-0 rounded-md p-portal-self:min-w-full
        bg-surface-0 dark:bg-surface-900
        border border-surface-200 dark:border-surface-700 
        text-surface-700 dark:text-surface-0
        shadow-lg z-50 mt-1`,
  header: `flex items-center p-2 gap-2 border-b border-surface-200`,
  pcFilterContainer: {
    root: `relative flex-auto`,
  },
  pcFilter: {
    root: `w-full appearance-none rounded outline-hidden text-sm
            bg-surface-0 dark:bg-surface-950
            text-surface-700 dark:text-surface-0
            placeholder:text-surface-500 dark:placeholder:text-surface-400
            border border-surface-300 dark:border-surface-700
            enabled:hover:border-surface-400 dark:enabled:hover:border-surface-600
            enabled:focus:border-primary
            disabled:bg-surface-200 disabled:text-surface-500
            dark:disabled:bg-surface-700 dark:disabled:text-surface-400
            pl-3 pr-10 py-2
            transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
  },
  pcFilterIconContainer: {
    root: `absolute top-1/2 -mt-2 leading-none end-3 z-10`,
  },
  listContainer: `overflow-auto max-h-40`,
  list: `m-0 p-1 list-none space-y-1`,
  optionGroup: `m-0 px-3 py-2 bg-transparent text-surface-500 dark:text-surface-400 font-semibold text-sm`,
  optionGroupLabel: ``,
  option: `ml-0 cursor-pointer font-normal whitespace-nowrap relative overflow-hidden flex items-center justify-between
        px-3 py-2 border-none text-surface-700 dark:text-surface-0 bg-transparent rounded
        hover:bg-surface-100 dark:hover:bg-surface-800 p-focus:bg-surface-100 dark:p-focus:bg-surface-800
        p-selected:bg-surface-100 dark:p-selected:bg-surface-800
        p-disabled:cursor-not-allowed p-disabled:text-surface-400 dark:p-disabled:text-surface-400
        transition-colors duration-200`,
  optionLabel: `flex-1 overflow-hidden text-ellipsis whitespace-nowrap order-1`,
  optionCheckIcon: ` mr-0 text-surface-600 dark:text-surface-300 text-base flex-shrink-0 order-2`,
  optionBlankIcon: `mr-0 text-[var(--cui-text-success-large)] dark:text-surface-300 text-base flex-shrink-0 order-2`,
  emptyMessage: `px-3 py-2 text-surface-500 text-center italic`,
  virtualScroller: ``,
  transition: {
    enterFromClass: "opacity-0 scale-y-75",
    enterActiveClass: "transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
});
</script>
