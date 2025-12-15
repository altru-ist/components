/**
 * ToastService - Toast Notification Plugin
 *
 * A wrapper around PrimeVue's ToastService plugin that provides toast notification
 * functionality without directly depending on PrimeVue imports.
 *
 * This service must be installed as a Vue plugin before using toast notifications.
 *
 * @example
 * ```typescript
 * // In main.ts
 * import { createApp } from 'vue'
 * import { ToastService } from '@ist/commonui-components'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 * app.use(ToastService)
 * app.mount('#app')
 * ```
 *
 * @example
 * ```typescript
 * // In a component
 * import { useToast } from '@ist/commonui-components'
 *
 * const toast = useToast()
 * toast.add({
 *   severity: 'success',
 *   summary: 'Success',
 *   detail: 'Operation completed successfully',
 *   life: 3000
 * })
 * ```
 */

import PrimeToastService from "primevue/toastservice";
import type { Plugin } from "vue";

/**
 * Toast Service Plugin
 *
 * Install this plugin in your Vue application to enable toast notifications.
 * Once installed, you can use the `useToast()` composable in any component
 * to show toast messages.
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue'
 * import { ToastService } from '@ist/commonui-components'
 *
 * const app = createApp(App)
 * app.use(ToastService)
 * ```
 */
export const ToastService: Plugin = PrimeToastService;

// Re-export for convenience
export default ToastService;
