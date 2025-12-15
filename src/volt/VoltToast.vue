<template>
  <Toast
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <template #closeicon>
      <span class="material-symbols-rounded w-4 h-4">close</span>
    </template>
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </Toast>
</template>

<script setup lang="ts">
// @ts-nocheck
import Toast, {
  type ToastPassThroughOptions,
  type ToastProps,
} from "primevue/toast";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ ToastProps {}
defineProps<Props>();

const theme = ref<ToastPassThroughOptions>({
  root: `w-96 rounded-md whitespace-pre-line break-words
        p-top-center:-translate-x-1/2 p-bottom-center:-translate-x-1/2
        p-center:min-w-[20vw] p-center:-translate-x-1/2 p-center:-translate-y-1/2`,
  message: `mb-4 not-p-custom:border not-p-custom:backdrop-blur-sm dark:not-p-custom:backdrop-blur-md not-p-custom:rounded-md
        p-info:bg-[var(--cui-surface-info-lighter)] p-info:border-[var(--cui-border-info)] p-info:text-[var(--cui-text-info-large)]
        p-success:bg-[var(--cui-surface-success-lighter)] p-success:border-[var(--cui-border-success)] p-success:text-[var(--cui-text-success-large)]
        p-warn:bg-[var(--cui-surface-warn-lighter)] p-warn:border-[var(--cui-border-warn)] p-warn:text-[var(--cui-text-warn-large)]
        p-error:bg-[var(--cui-surface-danger-lighter)] p-error:border-[var(--cui-border-danger)] p-error:text-[var(--cui-text-danger-large)]
        p-secondary:bg-surface-100 p-secondary:border-surface-200 p-secondary:text-surface-600 dark:p-secondary:bg-surface-800 dark:p-secondary:border-surface-700 dark:p-secondary:text-surface-300
        p-contrast:bg-surface-900 p-contrast:border-surface-950 p-contrast:text-surface-50 dark:p-contrast:bg-surface-0 dark:p-contrast:border-surface-100 dark:p-contrast:text-surface-950`,
  messageContent: `flex items-start p-3 gap-2`,
  messageIcon: `flex-shrink-0 text-lg w-[1.125rem] h-[1.125rem] mt-1`,
  messageText: `flex-auto flex flex-col gap-2`,
  summary: `font-medium text-base`,
  detail: `font-medium text-sm text-surface-700 dark:text-surface-0
        p-contrast:text-surface-0 dark:p-contrast:text-surface-950`,
  buttonContainer: ``,
  closeButton: `flex items-center justify-center overflow-hidden relative cursor-pointer bg-transparent select-none
        transition-colors duration-200 text-inherit w-7 h-7 rounded-full -mt-[25%] -end-1/4 p-0 border-none
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2
        p-info:hover:bg-[var(--cui-surface-info-light)] p-info:focus-visible:outline-[var(--cui-text-info-large)]
        p-success:hover:bg-[var(--cui-surface-success-light)] p-success:focus-visible:outline-[var(--cui-text-success-large)]
        p-warn:hover:bg-[var(--cui-surface-warn-light)] p-warn:focus-visible:outline-[var(--cui-text-warn-large)]
        p-error:hover:bg-[var(--cui-surface-danger-light)] p-error:focus-visible:outline-[var(--cui-text-danger-large)]
        p-secondary:hover:bg-surface-200 p-secondary:focus-visible:outline-surface-600 dark:p-secondary:hover:bg-surface-700 dark:p-secondary:focus-visible:outline-surface-300
        p-contrast:hover:bg-surface-800 p-contrast:focus-visible:outline-surface-50 dark:p-contrast:hover:bg-surface-100 dark:p-contrast:focus-visible:outline-surface-950`,
  closeIcon: `text-base w-4 h-4`,
  transition: {
    enterFromClass: "opacity-0 translate-y-1/2",
    enterActiveClass: "transition-all duration-500",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass: "transition-all duration-500",
    leaveToClass: "max-h-0 opacity-0 mb-0 overflow-hidden",
  },
});
</script>
