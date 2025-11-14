/**
 * @fileoverview Vue composables and dependency injection utilities for modal components.
 * This module provides hooks and providers for working with modals within Vue components.
 *
 * Key exports:
 * - `useModal()` - Composable for modal components to access modal state and controls
 * - `injectModal()` - Injects modal controller from component tree
 * - `provideModal()` - Provides modal controller to child components
 *
 * @module composition
 */

import { computed, inject, onMounted, provide, watch, type Ref } from "vue";
import type { ModalController } from "./state";
import { fail } from "./utils";

/**
 * Symbol used for dependency injection of modal controllers.
 * @private
 */
const modalSymbol = Symbol();

/**
 * Injects the modal controller from the Vue component tree.
 * This function should only be called within modal components.
 *
 * @template T - The expected response type from the modal
 * @returns {Ref<ModalController<T>>} A reactive reference to the modal controller
 * @throws {Error} Throws an error if called outside of a modal component context
 *
 * @example
 * ```typescript
 * // In a modal component
 * const modal = injectModal<{ confirmed: boolean }>();
 * modal.value.close({ confirmed: true });
 * ```
 */
export function injectModal<T = never>(): Ref<ModalController<T>> {
  return (
    inject(modalSymbol) ??
    fail(
      "Could not inject modal controller, " +
        "are you calling injectModal() or useModal() outside of a modal component?",
    )
  );
}

/**
 * Provides a modal controller to child components via dependency injection.
 * This is typically used internally by the modal system.
 *
 * @template T - The expected response type from the modal
 * @param {Ref<ModalController<T>>} controller - The modal controller to provide
 *
 * @example
 * ```typescript
 * // In a modal wrapper component
 * const controller = ref(modalController);
 * provideModal(controller);
 * ```
 */
export function provideModal<T = never>(
  controller: Ref<ModalController<T>>,
): void {
  provide(modalSymbol, controller);
}

/**
 * Composable function for working with modals within Vue components.
 * Provides reactive access to modal state and control methods.
 *
 * @template T - The expected response type from the modal
 * @param {Object} [options] - Configuration options for the modal
 * @param {boolean} [options.removeOnClose] - Whether to remove the modal when it closes
 * @returns {Object} Modal state and control methods
 * @returns {ComputedRef<string>} returns.id - The unique identifier of the modal
 * @returns {ComputedRef<boolean>} returns.visible - Whether the modal is currently visible
 * @returns {ComputedRef<ModalController | null>} returns.child - Any child modal controller
 * @returns {Function} returns.close - Function to close the modal with optional payload
 * @returns {Function} returns.remove - Function to remove the modal from the stack
 *
 * @example
 * ```typescript
 * // In a modal component
 * const { visible, close, remove } = useModal<{ confirmed: boolean }>({
 *   removeOnClose: true
 * });
 *
 * // Close with a response
 * const handleConfirm = () => close({ confirmed: true });
 *
 * // Close without response (dismissed)
 * const handleCancel = () => close();
 * ```
 */
export function useModal<T = never>(options?: { removeOnClose?: boolean }) {
  let mounted = false;
  const modal = injectModal<T>();

  if (options?.removeOnClose !== undefined) {
    watch(
      modal,
      (newModal, oldModal) => {
        newModal.removeOnClose.value = !!options?.removeOnClose;
        newModal.visible.value = mounted;

        if (!oldModal || !mounted) {
          return;
        }

        oldModal.visible.value = false;
      },
      { immediate: true },
    );
  }

  onMounted(() => ((mounted = true), (modal.value.visible.value = true)));

  return {
    id: computed(() => modal.value.id),
    visible: computed(() => modal.value.visible.value),
    child: computed(() => modal.value.child.value),
    close: (payload?: T) => modal.value.close(payload),
    remove: () => modal.value.remove(),
  };
}
