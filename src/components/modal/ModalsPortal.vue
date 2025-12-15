<template>
  <div :data-open="modals.length ? 'true' : undefined">
    <slot name="overlay" :show="modals.length > 0" />
    <template v-if="!nested">
      <ModalComponent :is="modal" v-for="modal of modals" :key="modal.id" />
    </template>
    <ModalComponent :is="modals[0]" v-else-if="modals[0]" />
  </div>
</template>

<script setup lang="ts">
/**
 * ModalsPortal
 *
 * Portal component managing rendering of modal dialogs. Handles modal stacking, overlay display,
 * and supports nested and flat layouts. Place at application root level.
 */

import ModalComponent from "./ModalComponent.vue";
import { modals } from "./state";

const { nested = false } = defineProps<{ nested?: boolean }>();
</script>
