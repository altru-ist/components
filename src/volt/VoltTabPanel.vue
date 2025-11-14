<template>
  <TabPanel
    :value="props.value"
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <slot></slot>
  </TabPanel>
</template>

<script setup lang="ts">
// @ts-nocheck
import TabPanel, {
  type TabPanelPassThroughOptions,
  type TabPanelProps,
} from "primevue/tabpanel";
import { ref } from "vue";
import { ptViewMerge } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ TabPanelProps {}
const props = defineProps<Props>();

const theme = ref<TabPanelPassThroughOptions>({
  root: ``,
});
</script>
