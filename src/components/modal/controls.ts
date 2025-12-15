/**
 * @fileoverview Modal control functions for creating, showing, and closing modals.
 * This module provides the main API for working with modals in the application.
 *
 * Key exports:
 * - `createModal()` - Creates a modal controller for a component
 * - `showModal()` - Shows a modal and returns a promise that resolves when closed
 * - `closeModal()` - Closes a modal by ID with optional removal settings
 *
 * @module controls
 */

import { ref, shallowRef, watch, type Component } from "vue";
import { modals, type ModalController } from "./state";
import {
  after,
  isPlainObject,
  PromisedValue,
  uuid,
  type Constructor,
  type IsAny,
  type IsPlainObject,
  type Pretty,
} from "./utils";

/**
 * Extracts the props type from a Vue component.
 * @template T - The Vue component type
 * @typedef {T extends Constructor<{ $props: infer TProps }> ? TProps : object} GetModalProps
 */
export type GetModalProps<T extends Component> =
  T extends Constructor<{ $props: infer TProps }> ? TProps : object;

/**
 * Extracts the response type from a Vue component's close event.
 * Handles various response patterns including dismissed state and response data.
 * @template T - The Vue component type
 * @typedef {Object} GetModalResponse
 * @property {boolean} dismissed - Whether the modal was dismissed without a response
 * @property {*} [response] - The response data from the modal (if not dismissed)
 */
export type GetModalResponse<T extends Component> =
  T extends Constructor<{
    $emit?: (event: "close", args: infer TResponse) => void;
  }>
    ? IsAny<TResponse> extends true
      ? { dismissed: boolean }
      : IsPlainObject<TResponse> extends true
        ?
            | Pretty<{ dismissed: false } & TResponse>
            | Pretty<
                { dismissed: true } & { [k in keyof TResponse]?: undefined }
              >
        : { dismissed: false; response: TResponse } | { dismissed: true }
    : { dismissed: boolean };

/**
 * Creates a modal controller for a component that doesn't require props.
 * @template T - The Vue component type
 * @param {T} component - The Vue component to display in the modal
 * @param {GetModalProps<T>} [props] - Optional props to pass to the component
 * @returns {ModalController<GetModalResponse<T>>} A modal controller instance
 */
export function createModal<T extends Component>(
  component: T & object extends GetModalProps<T> ? T : never,
  props?: GetModalProps<T>,
): ModalController<GetModalResponse<T>>;

/**
 * Creates a modal controller for a component that requires props.
 * @template T - The Vue component type
 * @param {T} component - The Vue component to display in the modal
 * @param {GetModalProps<T>} props - Required props to pass to the component
 * @returns {ModalController<GetModalResponse<T>>} A modal controller instance
 */
export function createModal<T extends Component>(
  component: T & object extends GetModalProps<T> ? never : T,
  props: GetModalProps<T>,
): ModalController<GetModalResponse<T>>;

/**
 * Creates a modal controller with generic component and props.
 * @param {Component} component - The Vue component to display in the modal
 * @param {Record<string, unknown>} [props] - Optional props to pass to the component
 * @returns {ModalController} A modal controller instance
 */
export function createModal(
  component: Component,
  props?: Record<string, unknown>,
): ModalController;

/**
 * Creates a modal controller instance for the given component.
 * This function manages the modal's lifecycle, visibility, and response handling.
 *
 * @template T - The Vue component type
 * @param {T} component - The Vue component to display in the modal
 * @param {GetModalProps<T>} [componentProps] - Props to pass to the component
 * @returns {ModalController<GetModalResponse<T>>} A modal controller with methods to control the modal
 *
 * @example
 * ```typescript
 * const modal = createModal(MyModal, { title: 'Confirm Action' });
 * modal.visible.value = true; // Show the modal
 * const result = await modal.promisedResult; // Wait for modal to close
 * ```
 */
export function createModal<T extends Component>(
  component: T,
  componentProps?: GetModalProps<T>,
): ModalController<GetModalResponse<T>> {
  const id = uuid();
  const props = componentProps ?? {};
  const visible = ref(false);
  const removeOnClose = ref(true);
  const child = shallowRef<ModalController | null>(null);
  const promisedResult = new PromisedValue<GetModalResponse<T>>();
  const watchingVisible = watch(visible, (newVisible) => newVisible || close());

  /**
   * Closes the modal and resolves the promise with the given result.
   * @param {unknown} [result] - The result to return when the modal closes
   * @returns {Promise<void>} A promise that resolves when the modal is closed
   */
  const close = async (result?: unknown) => {
    watchingVisible.stop();
    visible.value = false;

    if (isPlainObject(result)) {
      promisedResult.resolve({
        dismissed: false,
        ...result,
      } as GetModalResponse<T>);
    } else if (result !== undefined) {
      promisedResult.resolve({
        dismissed: false,
        response: result,
      } as unknown as GetModalResponse<T>);
    } else {
      promisedResult.resolve({ dismissed: true } as GetModalResponse<T>);
    }

    if (removeOnClose.value) {
      remove();
    }
  };

  /**
   * Removes the modal from the modal stack and handles parent-child relationships.
   * This function also ensures proper cleanup of modal hierarchy.
   */
  const remove = () => {
    const index = modals.value.findIndex((modal) => modal.id === id);

    if (index === -1) {
      return;
    }

    if (modals.value[index]?.visible.value) {
      modals.value[index]?.close();
    }

    const parentModal = modals.value[index - 1];

    if (parentModal) {
      parentModal.child.value = modals.value[index]?.child.value ?? null;
    }

    modals.value = modals.value.filter((modal) => modal.id !== id);
  };

  return {
    id,
    component,
    props,
    removeOnClose,
    visible,
    child,
    close,
    remove,
    promisedResult,
  };
}

/**
 * Shows a modal for a component that doesn't require props.
 * @template T - The Vue component type
 * @param {T} component - The Vue component to display in the modal
 * @param {GetModalProps<T>} [props] - Optional props to pass to the component
 * @returns {Promise<GetModalResponse<T>>} A promise that resolves with the modal's response
 */
export function showModal<T extends Component>(
  component: T & object extends GetModalProps<T> ? T : never,
  props?: GetModalProps<T>,
): Promise<GetModalResponse<T>>;

/**
 * Shows a modal for a component that requires props.
 * @template T - The Vue component type
 * @param {T} component - The Vue component to display in the modal
 * @param {GetModalProps<T>} props - Required props to pass to the component
 * @returns {Promise<GetModalResponse<T>>} A promise that resolves with the modal's response
 */
export function showModal<T extends Component>(
  component: T & object extends GetModalProps<T> ? never : T,
  props: GetModalProps<T>,
): Promise<GetModalResponse<T>>;

/**
 * Shows a modal with generic component and props.
 * @param {Component} component - The Vue component to display in the modal
 * @param {Record<string, unknown>} [props] - Optional props to pass to the component
 * @returns {Promise<never>} A promise that resolves with the modal's response
 */
export function showModal(
  component: Component,
  props?: Record<string, unknown>,
): Promise<never>;

/**
 * Shows an existing modal controller.
 * @template T - The modal controller type
 * @param {ModalController<T>} component - The modal controller to show
 * @returns {Promise<T>} A promise that resolves with the modal's response
 */
export function showModal<T extends ModalController>(
  component: ModalController<T>,
): Promise<T>;

/**
 * Shows a modal and returns a promise that resolves when the modal is closed.
 * This is the main function for displaying modals in the application.
 *
 * @template T - The Vue component type
 * @param {T | ModalController} componentOrModal - Either a Vue component or existing modal controller
 * @param {GetModalProps<T>} [componentProps] - Props to pass to the component (ignored if modal controller is passed)
 * @returns {Promise<GetModalResponse<T>>} A promise that resolves with the modal's response when closed
 *
 * @example
 * ```typescript
 * // Show a modal and wait for response
 * const result = await showModal(ConfirmModal, { message: 'Are you sure?' });
 * if (!result.dismissed) {
 *   console.log('User confirmed');
 * }
 *
 * // Show a modal from an existing controller
 * const modal = createModal(MyModal);
 * const result = await showModal(modal);
 * ```
 */
export function showModal<T extends Component>(
  componentOrModal: T | ModalController,
  componentProps?: GetModalProps<T>,
): Promise<GetModalResponse<T>> {
  const modal =
    "removeOnClose" in componentOrModal
      ? componentOrModal
      : createModal(componentOrModal, componentProps ?? {});
  const topModal = modals.value[modals.value.length - 1];

  if (topModal) {
    topModal.child.value = modal;
  }

  modals.value = modals.value.concat([modal]);

  return modal.promisedResult;
}

/**
 * Closes a modal by its ID with optional removal settings.
 *
 * @param {string} id - The unique identifier of the modal to close
 * @param {Object} [options={}] - Configuration options for closing
 * @param {boolean} [options.remove=false] - Whether to immediately remove the modal from the stack
 * @param {number} [options.removeAfter] - Remove the modal after this many milliseconds
 * @returns {Promise<void>} A promise that resolves when the modal is closed and optionally removed
 *
 * @example
 * ```typescript
 * // Close a modal immediately
 * await closeModal('modal-id');
 *
 * // Close and remove immediately
 * await closeModal('modal-id', { remove: true });
 *
 * // Close and remove after 300ms (for animation)
 * await closeModal('modal-id', { removeAfter: 300 });
 * ```
 */
export async function closeModal(
  id: string,
  options: { remove?: boolean; removeAfter?: number } = {},
): Promise<void> {
  const modal = modals.value.find((m) => m.id === id);

  if (!modal) {
    return;
  }

  modal.close();

  if (options.remove) {
    modal.remove();
  }

  if (options.removeAfter) {
    await after(options.removeAfter);

    modal.remove();
  }
}
