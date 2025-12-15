<template>
  <component
    :is="modal.component"
    v-bind="modalProps"
    @close="modal.close($event)"
  />
</template>

<script setup lang="ts" generic="T = never">
/**
 * ModalComponent
 *
 * Internal wrapper rendering modal instances from the controller. Manages modal props,
 * lifecycle, and provides context to children. Used internally by ModalsPortal only.
 */

import { computed, shallowRef, unref, watch } from "vue";
import { provideModal } from "./composition";
import type { ModalController } from "./state";

const { is: modal } = defineProps<{ is: ModalController<T> }>();
const modalRef = shallowRef(modal);
const modalProps = computed(() => {
  const props = {} as typeof modal.props;

  for (const property in modal.props) {
    props[property] = unref(modal.props[property]);
  }

  return props;
});

provideModal(modalRef);
watch(
  () => modal,
  () => void (modalRef.value = modal),
);
</script>
