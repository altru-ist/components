/**
 * Menu Registry
 *
 * A simple registry that allows menus to register themselves by ID,
 * enabling buttons with aria-controls to automatically find and toggle them.
 */

interface MenuInstance {
  toggle: (event: Event) => void;
  show: (event: Event) => void;
  hide: () => void;
}

const menuRegistry = new Map<string, MenuInstance>();

/**
 * Register a menu instance by ID
 * @param id - The menu's ID (used in aria-controls)
 * @param instance - The menu instance with toggle/show/hide methods
 */
export function registerMenu(id: string, instance: MenuInstance): void {
  menuRegistry.set(id, instance);
}

/**
 * Unregister a menu instance by ID
 * @param id - The menu's ID to remove from registry
 */
export function unregisterMenu(id: string): void {
  menuRegistry.delete(id);
}

/**
 * Get a menu instance by ID
 * @param id - The menu's ID (from aria-controls)
 * @returns The menu instance or undefined if not found
 */
export function getMenu(id: string): MenuInstance | undefined {
  return menuRegistry.get(id);
}

/**
 * Toggle a menu by its ID
 * @param id - The menu's ID (from aria-controls)
 * @param event - The triggering event
 * @returns true if menu was found and toggled, false otherwise
 */
export function toggleMenuById(id: string, event: Event): boolean {
  const menu = menuRegistry.get(id);
  if (menu) {
    menu.toggle(event);
    return true;
  }
  return false;
}
