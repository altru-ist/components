/**
 * @fileoverview Global state management for the modal system.
 * This module defines the modal controller interface and maintains the global modal stack.
 *
 * Key exports:
 * - `ModalController` - Interface defining modal controller structure
 * - `modals` - Global reactive array of active modals
 *
 * @module state
 */

import { shallowRef, type Component, type Ref } from "vue";

/**
 * Interface for controlling a modal instance.
 * Provides methods and properties for managing modal lifecycle and state.
 *
 * @template T - The expected response type when the modal closes
 *
 * @interface ModalController
 * @property {string} id - Unique identifier for the modal instance
 * @property {Component} component - The Vue component to render in the modal
 * @property {Record<string, unknown>} props - Props to pass to the modal component
 * @property {Ref<boolean>} visible - Reactive reference to the modal's visibility state
 * @property {Ref<boolean>} removeOnClose - Whether to remove the modal when it closes
 * @property {Ref<ModalController | null>} child - Reference to any child modal
 * @property {Promise<T>} promisedResult - Promise that resolves when the modal closes
 * @property {Function} close - Method to close the modal with optional payload
 * @property {Function} remove - Method to remove the modal from the stack
 *
 * @example
 * ```typescript
 * const modal: ModalController<{ confirmed: boolean }> = createModal(ConfirmModal);
 * modal.visible.value = true;
 * const result = await modal.promisedResult;
 * ```
 */
export interface ModalController<T = never> {
  /** Unique identifier for the modal instance */
  id: string;
  /** The Vue component to render in the modal */
  component: Component;
  /** Props to pass to the modal component */
  props: Record<string, unknown>;
  /** Reactive reference to the modal's visibility state */
  visible: Ref<boolean>;
  /** Whether to remove the modal when it closes */
  removeOnClose: Ref<boolean>;
  /** Reference to any child modal */
  child: Ref<ModalController | null>;
  /** Promise that resolves when the modal closes */
  promisedResult: Promise<T>;
  /**
   * Method to close the modal with optional payload
   * @param payload - Optional data to return when closing
   */
  close(payload?: T): Promise<void>;
  /** Method to remove the modal from the stack */
  remove(): void;
}

/**
 * Global reactive array containing all active modals.
 * Modals are stored in the order they were opened, with the last item being the topmost modal.
 *
 * @type {Ref<ModalController[]>}
 *
 * @example
 * ```typescript
 * // Get the current top modal
 * const topModal = modals.value[modals.value.length - 1];
 *
 * // Check if any modals are open
 * const hasOpenModals = modals.value.length > 0;
 * ```
 */
export const modals = shallowRef<ModalController[]>([]);
