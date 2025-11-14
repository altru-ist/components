// Export modal system components
export { default as CuiModal } from "./CuiModal.vue";
export { default as ModalComponent } from "./ModalComponent.vue";
export { default as CuiModalsPortal } from "./ModalsPortal.vue";

// Export modal functions and composables
export { injectModal, provideModal, useModal } from "./composition";
export { closeModal, createModal, showModal } from "./controls";
export { modals } from "./state";
export type { ModalController } from "./state";
