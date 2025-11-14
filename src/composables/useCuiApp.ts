/**
 * Composable for accessing CuiApp context
 *
 * Provides type-safe access to the CuiApp context using Vue's inject API.
 * Must be called within a component that is a descendant of CuiApp.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useCuiApp } from '@/composables/useCuiApp'
 *
 * const app = useCuiApp()
 *
 * // Access reactive state
 * console.log(app.isMenuCollapsed.value)
 * console.log(app.isMobile.value)
 * console.log(app.breadcrumbItems.value)
 *
 * // Call methods
 * app.toggleMenu()
 * app.updateBreadcrumbs([...])
 * </script>
 * ```
 *
 * @throws {Error} If called outside of a CuiApp context
 * @returns {CuiAppContext} The CuiApp context object
 */

import { inject } from "vue";
import { CuiAppContextKey, type CuiAppContext } from "../components/CuiApp.vue";

export function useCuiApp(): CuiAppContext {
  const context = inject(CuiAppContextKey);

  if (!context) {
    throw new Error(
      "useCuiApp() must be called within a descendant of <CuiApp>. " +
        "Make sure your component is nested inside a <CuiApp> component.",
    );
  }

  return context;
}

/**
 * Composable for optionally accessing CuiApp context
 *
 * Similar to useCuiApp but returns null if not within a CuiApp context
 * instead of throwing an error. Useful for components that work both
 * inside and outside of CuiApp.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useCuiAppOptional } from '@/composables/useCuiApp'
 *
 * const app = useCuiAppOptional()
 *
 * if (app) {
 *   // We're inside CuiApp
 *   app.toggleMenu()
 * } else {
 *   // We're not inside CuiApp
 *   console.log('Component is standalone')
 * }
 * </script>
 * ```
 *
 * @returns {CuiAppContext | null} The CuiApp context object or null
 */
export function useCuiAppOptional(): CuiAppContext | null {
  return inject(CuiAppContextKey, null);
}
