<template>
  <Tabs
    :value="props.value"
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <slot></slot>
  </Tabs>
</template>

<script setup lang="ts">
// @ts-nocheck
import Tabs, {
  type TabsPassThroughOptions,
  type TabsProps,
} from "primevue/tabs";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ TabsProps {}
const props = defineProps<Props>();

const theme = ref<TabsPassThroughOptions>({
  root: `flex flex-col`,
});
</script>
