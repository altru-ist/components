<template>
  <Teleport :to="appendTo" :disabled="!popup || appendTo === 'self'">
    <Transition
      enter-from-class="opacity-0 scale-y-75"
      enter-active-class="transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]"
      leave-active-class="transition-opacity duration-100 ease-linear"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!popup || isVisible"
        ref="menuRef"
        :id="menuId"
        role="menu"
        :class="rootClasses"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :style="popup ? popupStyle : undefined"
        @keydown="onKeyDown"
      >
        <!-- Start slot -->
        <slot name="start" />

        <ul
          :id="`${menuId}_list`"
          ref="listRef"
          role="menu"
          :tabindex="tabindex"
          class="m-0 p-1 list-none outline-none flex flex-col gap-[2px]"
          @focus="onFocus"
          @blur="onBlur"
        >
          <template
            v-for="(item, index) in flattenedItems"
            :key="item.key || index"
          >
            <!-- Separator -->
            <li
              v-if="item.separator"
              role="separator"
              class="border-t border-surface-200 dark:border-surface-700"
            />

            <!-- Submenu Label -->
            <li
              v-else-if="item.isSubmenuLabel"
              :id="`${menuId}_${index}`"
              role="none"
              class="bg-transparent px-3 py-2 text-surface-500 dark:text-surface-400 font-semibold"
            >
              <slot name="submenuheader" :item="item">
                {{ getLabel(item) }}
              </slot>
            </li>

            <!-- Menu Item -->
            <li
              v-else
              :id="`${menuId}_${index}`"
              role="menuitem"
              :aria-label="getLabel(item)"
              :aria-disabled="isItemDisabled(item) ? 'true' : undefined"
              :data-p-focused="focusedIndex === index"
              :data-p-disabled="isItemDisabled(item)"
              :class="itemClasses(item)"
            >
              <slot
                name="item"
                :item="item"
                :label="getLabel(item)"
                :props="getItemProps(item, index)"
              >
                <div :class="itemContentClasses(index)">
                  <a
                    :href="item.url || '#'"
                    :target="item.target"
                    tabindex="-1"
                    class="cursor-pointer flex items-center no-underline! overflow-hidden relative text-inherit px-3 py-2 gap-2 select-none outline-none"
                    @click="(e) => onItemClick(e, item, index)"
                  >
                    <slot
                      name="itemicon"
                      :item="item"
                      :class="iconClasses(index)"
                    >
                      <span
                        v-if="item.icon"
                        :class="iconClasses(index)"
                        class="material-symbols-rounded text-[1.125rem]!"
                        >{{ item.icon }}</span
                      >
                    </slot>
                    <span>{{ getLabel(item) }}</span>
                  </a>
                </div>
              </slot>
            </li>
          </template>
        </ul>

        <!-- End slot -->
        <slot name="end" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Menu Component
 *
 * A popup menu component that displays a list of menu items.
 * Supports hierarchical menu items with icons, separators, and custom templates.
 * Full keyboard navigation and accessibility support.
 */

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from "vue";
import { registerMenu, unregisterMenu } from "../utils/menuRegistry";

// Re-export PrimeVue MenuItem type for consumers
export type { MenuItem } from "primevue/menuitem";

import type { MenuItem } from "primevue/menuitem";

/**
 * Extended MenuItem with internal flags
 *
 * Note: Menu items can include an optional `autoClose` property (boolean)
 * to control whether clicking that item closes the menu.
 * This overrides the component-level autoClose prop.
 */
interface FlattenedMenuItem extends MenuItem {
  isSubmenuLabel?: boolean;
  originalIndex?: number;
  /** Whether clicking this item should auto-close the menu (overrides component prop) */
  autoClose?: boolean;
}

/**
 * Props interface for CuiMenu component
 */
export interface CuiMenuProps {
  /**
   * @description Array of menu items to display
   */
  model?: MenuItem[];

  /**
   * @description Whether the menu should be displayed as a popup overlay
   */
  popup?: boolean;

  /**
   * @description Whether to automatically close the menu when an item is clicked.
   * Can be overridden per item using the item's autoClose property.
   * @default true
   */
  autoClose?: boolean;

  /**
   * @description Whether to automatically manage layering (z-index)
   */
  autoZIndex?: boolean;

  /**
   * @description Base z-index value to use for layering
   */
  baseZIndex?: number;

  /**
   * @description A valid query selector or an HTMLElement to specify where the overlay gets attached
   */
  appendTo?: "body" | "self" | string | HTMLElement;

  /**
   * @description Index of the element in tabbing order
   */
  tabindex?: number;

  /**
   * @description Accessible label for the menu
   */
  ariaLabel?: string;

  /**
   * @description ID of the element that labels the menu for accessibility
   */
  ariaLabelledby?: string;
}

const props = withDefaults(defineProps<CuiMenuProps>(), {
  model: () => [],
  popup: false,
  autoClose: true,
  autoZIndex: true,
  baseZIndex: 0,
  appendTo: "body",
  tabindex: 0,
});

/**
 * Events emitted by CuiMenu
 */
const emit = defineEmits<{
  /**
   * Emitted when the menu receives focus
   * @arg {Event} event - The browser focus event
   */
  focus: [event: Event];

  /**
   * Emitted when the menu loses focus
   * @arg {Event} event - The browser blur event
   */
  blur: [event: Event];

  /**
   * Emitted when the popup menu is shown
   */
  show: [];

  /**
   * Emitted when the popup menu is hidden
   */
  hide: [];
}>();

/**
 * Slots available in CuiMenu
 */
const slots = defineSlots<{
  /**
   * Custom content template to display before the menu items
   */
  start?: () => any;

  /**
   * Custom content template to display after the menu items
   */
  end?: () => any;

  /**
   * Custom template for rendering a menu item
   * @arg {object} slotProps - The slot properties
   * @arg {MenuItem} slotProps.item - The menu item data
   * @arg {string} slotProps.label - Resolved label text of the item
   * @arg {object} slotProps.props - Bindings for the item element
   */
  item?: (props: { item: MenuItem; label: string; props: object }) => any;

  /**
   * Custom template for rendering menu item icons
   * @arg {object} slotProps - The slot properties
   * @arg {MenuItem} slotProps.item - The menu item data
   * @arg {any} slotProps.class - CSS class binding for the icon
   */
  itemicon?: (props: { item: MenuItem; class: any }) => any;

  /**
   * Custom template for rendering submenu headers
   * @arg {object} slotProps - The slot properties
   * @arg {MenuItem} slotProps.item - The submenu header item data
   */
  submenuheader?: (props: { item: MenuItem }) => any;
}>();

// Get the id from attrs
const attrs = useAttrs();
const menuId = computed(
  () =>
    (attrs.id as string) ||
    `cui_menu_${Math.random().toString(36).substr(2, 9)}`,
);

// Refs
const menuRef = ref<HTMLElement>();
const listRef = ref<HTMLElement>();
const isVisible = ref(false);
const focusedIndex = ref(-1);
const targetElement = ref<HTMLElement | null>(null);

// Popup positioning
const popupStyle = ref<Record<string, string>>({});

// Root classes
const rootClasses = computed(() => [
  "bg-surface-0 dark:bg-surface-900",
  "text-surface-700 dark:text-surface-0",
  "border border-surface-200 dark:border-surface-700",
  "rounded-md min-w-52",
  props.popup
    ? "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] absolute z-50"
    : "",
]);

/**
 * Flatten model to handle grouped items
 */
const flattenedItems = computed<FlattenedMenuItem[]>(() => {
  const result: FlattenedMenuItem[] = [];

  props.model.forEach((item) => {
    if (!isItemVisible(item)) return;

    // Check if this is a group (has items array)
    if (item.items && item.items.length > 0) {
      // Add the group label
      result.push({
        ...item,
        isSubmenuLabel: true,
      });

      // Add all child items
      item.items.forEach((childItem) => {
        if (isItemVisible(childItem)) {
          result.push(childItem);
        }
      });
    } else {
      result.push(item);
    }
  });

  return result;
});

/**
 * Get focusable items (excluding separators and submenu labels)
 */
const focusableIndices = computed(() => {
  return flattenedItems.value
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item }) =>
        !item.separator && !item.isSubmenuLabel && !isItemDisabled(item),
    )
    .map(({ index }) => index);
});

/**
 * Check if item is visible
 */
function isItemVisible(item: MenuItem): boolean {
  if (item.visible === undefined) return true;
  return typeof item.visible === "function" ? item.visible() : item.visible;
}

/**
 * Check if item is disabled
 */
function isItemDisabled(item: MenuItem): boolean {
  if (item.disabled === undefined) return false;
  return typeof item.disabled === "function" ? item.disabled() : item.disabled;
}

/**
 * Get label from item
 */
function getLabel(item: MenuItem): string {
  if (!item.label) return "";
  return typeof item.label === "function" ? item.label() : item.label;
}

/**
 * Get item props for custom templates
 */
function getItemProps(item: MenuItem, index: number) {
  return {
    action: {
      href: item.url || "#",
      target: item.target,
      tabindex: -1,
      onClick: (e: MouseEvent) => onItemClick(e, item, index),
    },
  };
}

/**
 * Item classes
 */
function itemClasses(item: MenuItem) {
  return [isItemDisabled(item) ? "opacity-60 pointer-events-none" : ""];
}

/**
 * Item content classes based on focus state
 */
function itemContentClasses(index: number) {
  return [
    "group transition-colors duration-200 rounded-sm",
    "text-surface-700 dark:text-surface-0",
    focusedIndex.value === index
      ? "bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-0"
      : "hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-800 dark:hover:text-surface-0",
  ];
}

/**
 * Icon classes based on focus state
 */
function iconClasses(index: number) {
  return [
    "text-surface-400 dark:text-surface-500",
    focusedIndex.value === index
      ? "text-surface-500 dark:text-surface-400"
      : "group-hover:text-surface-500 dark:group-hover:text-surface-400",
  ];
}

/**
 * Handle item click
 */
function onItemClick(event: MouseEvent, item: MenuItem, _index?: number) {
  if (isItemDisabled(item)) {
    event.preventDefault();
    return;
  }

  // Execute command if present
  if (item.command) {
    item.command({
      originalEvent: event,
      item,
    });
  }

  // Prevent default for non-URL items
  if (!item.url) {
    event.preventDefault();
  }

  // Determine if menu should auto-close
  // Item-level autoClose overrides component-level prop if specified
  const shouldAutoClose =
    item.autoClose !== undefined ? item.autoClose : props.autoClose;

  // Hide menu after click if autoClose is enabled
  if (shouldAutoClose) {
    hide();
  }
}

/**
 * Handle focus event
 */
function onFocus(event: Event) {
  emit("focus", event);

  // Focus first focusable item if none focused
  if (focusedIndex.value === -1 && focusableIndices.value.length > 0) {
    focusedIndex.value = focusableIndices.value[0] ?? -1;
  }
}

/**
 * Handle blur event
 */
function onBlur(event: Event) {
  emit("blur", event);
}

/**
 * Handle keyboard navigation
 */
function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      navigateNext();
      break;

    case "ArrowUp":
      event.preventDefault();
      navigatePrev();
      break;

    case "Home":
      event.preventDefault();
      navigateFirst();
      break;

    case "End":
      event.preventDefault();
      navigateLast();
      break;

    case "Enter":
    case " ":
      event.preventDefault();
      activateFocusedItem(event);
      break;

    case "Escape":
      if (props.popup) {
        event.preventDefault();
        hide();
        targetElement.value?.focus();
      }
      break;

    case "Tab":
      if (props.popup) {
        hide();
      }
      break;
  }
}

/**
 * Navigate to next focusable item
 */
function navigateNext() {
  const currentIdx = focusableIndices.value.indexOf(focusedIndex.value);
  const nextIdx =
    currentIdx < focusableIndices.value.length - 1 ? currentIdx + 1 : 0;
  focusedIndex.value = focusableIndices.value[nextIdx] ?? -1;
}

/**
 * Navigate to previous focusable item
 */
function navigatePrev() {
  const currentIdx = focusableIndices.value.indexOf(focusedIndex.value);
  const prevIdx =
    currentIdx > 0 ? currentIdx - 1 : focusableIndices.value.length - 1;
  focusedIndex.value = focusableIndices.value[prevIdx] ?? -1;
}

/**
 * Navigate to first focusable item
 */
function navigateFirst() {
  if (focusableIndices.value.length > 0) {
    focusedIndex.value = focusableIndices.value[0] ?? -1;
  }
}

/**
 * Navigate to last focusable item
 */
function navigateLast() {
  if (focusableIndices.value.length > 0) {
    focusedIndex.value =
      focusableIndices.value[focusableIndices.value.length - 1] ?? -1;
  }
}

/**
 * Activate the currently focused item
 */
function activateFocusedItem(event: Event) {
  if (focusedIndex.value >= 0) {
    const item = flattenedItems.value[focusedIndex.value];
    if (item && !item.separator && !item.isSubmenuLabel) {
      onItemClick(event as MouseEvent, item, focusedIndex.value);
    }
  }
}

/**
 * Position the popup menu relative to target element
 */
function positionMenu(event: Event) {
  const target = (event.currentTarget || event.target) as HTMLElement;
  targetElement.value = target;

  nextTick(() => {
    if (!menuRef.value || !target) return;

    const targetRect = target.getBoundingClientRect();
    const menuRect = menuRef.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = targetRect.bottom + window.scrollY;
    let left = targetRect.left + window.scrollX;

    // Check if menu would overflow bottom
    if (targetRect.bottom + menuRect.height > viewportHeight) {
      top = targetRect.top + window.scrollY - menuRect.height;
    }

    // Check if menu would overflow right
    if (targetRect.left + menuRect.width > viewportWidth) {
      left = targetRect.right + window.scrollX - menuRect.width;
    }

    // Ensure minimum top position
    if (top < window.scrollY) {
      top = window.scrollY;
    }

    const style: Record<string, string> = {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
    };

    if (props.autoZIndex) {
      style.zIndex = String(props.baseZIndex + 1000);
    }

    popupStyle.value = style;
  });
}

/**
 * Handle click outside
 */
function onClickOutside(event: MouseEvent) {
  if (props.popup && isVisible.value && menuRef.value) {
    const target = event.target as Node;
    if (
      !menuRef.value.contains(target) &&
      !targetElement.value?.contains(target)
    ) {
      hide();
    }
  }
}

/**
 * Toggle the popup menu visibility
 */
const toggle = (event: Event) => {
  if (isVisible.value) {
    hide();
  } else {
    show(event);
  }
};

/**
 * Show the popup menu
 */
const show = (event: Event) => {
  if (!props.popup) return;

  isVisible.value = true;
  positionMenu(event);
  emit("show");

  nextTick(() => {
    listRef.value?.focus();
    if (focusableIndices.value.length > 0) {
      focusedIndex.value = focusableIndices.value[0] ?? -1;
    }
  });
};

/**
 * Hide the menu (emits hide event for parent components to react)
 */
const hide = () => {
  if (props.popup) {
    isVisible.value = false;
  }
  focusedIndex.value = -1;
  emit("hide");

  // Dispatch bubbling DOM event for parent containers (e.g., CuiButtonDropdown)
  menuRef.value?.dispatchEvent(
    new CustomEvent("cui-menu-hide", { bubbles: true }),
  );
};

// Expose methods for programmatic control
defineExpose({
  /**
   * Toggle the popup menu visibility
   */
  toggle,

  /**
   * Show the popup menu
   */
  show,

  /**
   * Hide the popup menu
   */
  hide,
});

// Register/unregister menu in the registry for aria-controls support
onMounted(() => {
  const id = attrs.id as string | undefined;
  if (id) {
    registerMenu(id, { toggle, show, hide });
  }

  // Add click outside listener for popup mode
  if (props.popup) {
    document.addEventListener("click", onClickOutside);
  }
});

onBeforeUnmount(() => {
  const id = attrs.id as string | undefined;
  if (id) {
    unregisterMenu(id);
  }

  // Remove click outside listener
  document.removeEventListener("click", onClickOutside);
});

// Watch for id changes (in case it's dynamic)
watch(
  () => attrs.id as string | undefined,
  (newId, oldId) => {
    if (oldId) {
      unregisterMenu(oldId);
    }
    if (newId) {
      registerMenu(newId, { toggle, show, hide });
    }
  },
);
</script>
