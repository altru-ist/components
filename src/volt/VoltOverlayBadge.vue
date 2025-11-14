<template>
  <div class="relative inline-flex">
    <slot />
    <Badge
      v-bind="$attrs"
      class="absolute z-10 top-0 end-0 translate-x-[50%] translate-y-[-50%] origin-[100%_0] m-0 outline-2 outline-surface-0 dark:outline-surface-900"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import Badge, { type BadgeProps } from "./VoltBadge.vue";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ BadgeProps {}
defineOptions({
  inheritAttrs: false,
});

defineProps<Props>();
</script>
