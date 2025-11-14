/**
 * useToast - Toast Notification Composable
 *
 * A wrapper around PrimeVue's useToast that provides a consistent API
 * for showing toast notifications without directly depending on PrimeVue imports.
 *
 * @example
 * ```typescript
 * import { useToast } from '@ist/commonui-components'
 *
 * const toast = useToast()
 *
 * // Show a success message
 * toast.add({
 *   severity: 'success',
 *   summary: 'Success',
 *   detail: 'Operation completed successfully',
 *   life: 3000
 * })
 *
 * // Clear all messages
 * toast.removeAllGroups()
 * ```
 */

import type { ToastServiceMethods } from "primevue/toastservice";
import { useToast as usePrimeToast } from "primevue/usetoast";

/**
 * Toast message severity levels
 */
export type ToastSeverity =
  | "success"
  | "info"
  | "warn"
  | "error"
  | "secondary"
  | "contrast";

/**
 * Toast message configuration options
 */
export interface ToastMessageOptions {
  /** Severity level of the message */
  severity?: ToastSeverity;
  /** Title/heading of the message */
  summary?: string;
  /** Detailed message content */
  detail?: string;
  /** Duration in milliseconds before auto-dismiss (omit or use sticky for persistent messages) */
  life?: number;
  /** Whether the message can be manually closed (default: true) */
  closable?: boolean;
  /** Keep message visible until manually closed */
  sticky?: boolean;
  /** Target specific Toast instance by group key */
  group?: string;
  /** Additional CSS classes */
  styleClass?: string;
  /** Additional inline styles */
  contentStyleClass?: string;
}

/**
 * Toast service methods for managing toast notifications
 */
export interface ToastService extends ToastServiceMethods {
  /**
   * Shows a toast message
   * @param message - Toast message configuration
   */
  add: (message: ToastMessageOptions) => void;

  /**
   * Removes all messages from all groups
   */
  removeAllGroups: () => void;

  /**
   * Removes all messages from a specific group
   * @param group - Group key to clear
   */
  removeGroup: (group: string) => void;
}

/**
 * Composable for accessing toast notification service
 *
 * @returns Toast service with methods to show and manage toast notifications
 *
 * @example
 * ```typescript
 * const toast = useToast()
 *
 * // Show different severity levels
 * toast.add({ severity: 'success', summary: 'Done!', detail: 'Task completed' })
 * toast.add({ severity: 'info', summary: 'Info', detail: 'New information available' })
 * toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please review' })
 * toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' })
 *
 * // Sticky message (persists until closed)
 * toast.add({ severity: 'warn', summary: 'Important', detail: 'Read carefully', sticky: true })
 *
 * // Target specific position group
 * toast.add({ severity: 'info', summary: 'Bottom Right', group: 'br', life: 3000 })
 *
 * // Clear all messages
 * toast.removeAllGroups()
 *
 * // Clear specific group
 * toast.removeGroup('br')
 * ```
 */
export function useToast(): ToastService {
  return usePrimeToast() as ToastService;
}
