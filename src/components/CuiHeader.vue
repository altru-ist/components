<template>
  <header
    ref="headerRef"
    class="w-full h-[70px] bg-[var(--cui-surface-default-white)]/90 backdrop-filter backdrop-blur border-none sticky top-0 z-10"
    :class="{ 'shadow-md': isScrolled }"
  >
    <div
      class="max-w-full leading-[70px] mx-auto grid items-center px-4"
      :class="gridLayoutClasses"
    >
      <!-- Left: Breadcrumbs -->
      <div
        class="min-w-0 overflow-hidden"
        :class="{ 'hidden md:block': showSearch }"
      >
        <slot name="breadcrumbs">
          <Breadcrumbs
            v-if="breadcrumbItems && breadcrumbItems.length > 0"
            :items="breadcrumbItems"
            :aria-label="breadcrumbAriaLabel"
          />
        </slot>
      </div>

      <!-- Center-Left: Search Bar -->
      <div
        v-if="showSearch"
        class="min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-[200px] md:min-w-[180px] md:max-w-[250px] lg:min-w-[200px] lg:max-w-[300px]"
      >
        <SearchBar
          :model-value="searchValue"
          :placeholder="searchPlaceholder"
          :suggestions="searchSuggestions"
          :clearable="searchClearable"
          @update:model-value="emit('update:searchValue', $event)"
          @complete="emit('searchComplete', $event)"
        />
      </div>

      <!-- Center-Right: Action Buttons Slot -->
      <div
        v-if="showActions"
        class="flex items-center justify-end gap-2 sm:gap-1 md:gap-2"
      >
        <slot name="actions">
          <!-- Default: No actions -->
        </slot>
      </div>

      <!-- Right: Avatar or Login Button -->
      <div
        v-if="loginStatus !== 'no-login'"
        class="flex items-center justify-center shrink-0"
      >
        <!-- Show Avatar when logged in -->
        <Avatar
          v-if="loginStatus === 'logged-in'"
          :src="avatarSrc"
          :alt="avatarAlt"
          :size="avatarSize"
          :interactable="avatarInteractive"
          @click="
            toggle($event);
            emit('avatarClick', $event);
          "
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <VoltMenu
          v-if="hasSlotContent(slots['avatar-menu'])"
          ref="menuCustom"
          :pt="{
            root: 'relative bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0 border border-surface-200 dark:border-surface-700 rounded-md min-w-52 p-popup:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]',
          }"
          id="overlay_menu"
          :model="itemsCustom"
          :popup="true"
        >
          <template #item="{ item }">
            <slot name="avatar-menu" :item="item" />
          </template>
        </VoltMenu>
        <VoltMenu
          v-else
          ref="menu"
          id="overlay_menu"
          :model="items"
          :popup="true"
        />
        <!-- Show Login Button when logged out -->
        <CuiButton
          v-if="loginStatus === 'logged-out'"
          variant="secondary-text"
          size="medium"
          @click="emit('loginClick', $event)"
        >
        </CuiButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Header
 *
 * Page header with responsive layout for breadcrumbs, search, actions, and avatar.
 * Integrates with CuiApp for consistent navigation and state management.
 */

import { computed, onMounted, onUnmounted, ref, useSlots } from "vue";
import { Avatar, Breadcrumbs, CuiButton, SearchBar } from "../main";
import { hasSlotContent } from "../utils/slotsUtils";
import VoltMenu from "../volt/VoltMenu.vue";
import type { BreadcrumbItem } from "./CuiBreadcrumbs.vue";

// Component API
interface Props {
  /** Breadcrumb items for navigation */
  breadcrumbItems?: BreadcrumbItem[];
  /** Custom aria-label for breadcrumb navigation */
  breadcrumbAriaLabel?: string;
  /** Whether to show the search bar */
  showSearch?: boolean;
  /** Search input value */
  searchValue?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search suggestions array */
  searchSuggestions?: string[];
  /** Whether search bar should be clearable */
  searchClearable?: boolean;
  /** Avatar image source */
  avatarSrc?: string;
  /** Avatar alt text */
  avatarAlt?: string;
  /** Avatar size */
  avatarSize?: "xs" | "sm" | "md" | "lg";
  /** Whether avatar is interactive */
  avatarInteractive?: boolean;
  /** Login status - controls whether to show avatar, login button, or nothing */
  loginStatus?: "logged-in" | "logged-out" | "no-login";
  /** Whether to show action buttons area (for layout purposes) */
  showActions?: boolean;
  /** Menu items for the avatar dropdown menu */
  avatarMenuItems?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  breadcrumbAriaLabel: "Page navigation",
  showSearch: true,
  searchPlaceholder: "Search...",
  searchClearable: true,
  avatarAlt: "User avatar",
  avatarSize: "md",
  avatarInteractive: true,
  loginStatus: "logged-in",
  showActions: true,
});

// Get slots instance
const slots = useSlots();

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Breadcrumbs slot for custom navigation content
   * Replaces the default Breadcrumbs component when provided
   * Use this to provide custom breadcrumb layouts or navigation elements
   */
  breadcrumbs?: () => any;

  /**
   * Left content slot for custom content on the left side of the header
   * Appears before the logo/brand area
   */
  "left-content"?: () => any;

  /**
   * Right content slot for custom content on the right side of the header
   * Appears after the actions area
   */
  "right-content"?: () => any;

  /**
   * Actions slot for custom action buttons
   * Replaces the default action buttons when provided
   */
  actions?: () => any;

  /**
   * Avatar menu slot for custom menu item rendering
   * @arg {object} slotProps - The menu item slot properties
   * @arg {any} slotProps.item - The menu item object being rendered
   */
  "avatar-menu"?: (props: { item: any }) => any;
}>();

// Events
const emit = defineEmits<{
  /**
   * Emitted when search value changes (for v-model support)
   * @arg {string} value - The new search value
   */
  "update:searchValue": [value: string];

  /**
   * Emitted when search suggestions are requested
   * @arg {object} event - The search complete event details
   * @arg {Event} event.originalEvent - The original input event
   * @arg {string} event.query - The search query string
   */
  searchComplete: [event: { originalEvent: Event; query: string }];

  /**
   * Emitted when the avatar is clicked
   * @arg {Event} event - The native click event
   */
  avatarClick: [event: Event];

  /**
   * Emitted when the login button is clicked
   * @arg {Event} event - The native click event
   */
  loginClick: [event: Event];
}>();

const menuCustom = ref();
const menu = ref();
const isScrolled = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);

// Use provided menu items or default
const items = computed(() => {
  return (
    props.avatarMenuItems || [
      {
        label: "Options",
        items: [
          {
            label: "Refresh",
            icon: "pi pi-refresh",
          },
          {
            label: "Export",
            icon: "pi pi-upload",
          },
        ],
      },
    ]
  );
});

const itemsCustom = computed(() => {
  return (
    props.avatarMenuItems || [
      {
        items: [
          {
            label: "dummy",
          },
        ],
      },
    ]
  );
});

// Computed properties for dynamic grid layout
const gridLayoutClasses = computed(() => {
  // Default: grid-cols-[minmax(0,1fr)_minmax(0,300px)_auto_auto] (breadcrumbs search actions avatar)
  // No actions: grid-cols-[minmax(0,1fr)_minmax(200px,300px)_auto] (breadcrumbs search avatar)
  // No login: grid-cols-[minmax(0,1fr)_minmax(200px,300px)_auto] (breadcrumbs search actions)
  // No actions + no login: grid-cols-[minmax(0,1fr)_minmax(200px,300px)] (breadcrumbs search)

  const hasActions = props.showActions;
  const hasLogin = props.loginStatus !== "no-login";

  // Mobile responsive classes - hide breadcrumbs on small screens when search is shown
  const responsiveClasses = [
    "px-3 gap-2 sm:px-4 sm:gap-3 md:px-6 md:gap-4 lg:gap-6",
  ];

  if (!hasActions && !hasLogin) {
    // Only breadcrumbs and search
    return [
      ...responsiveClasses,
      "grid-cols-[1fr_minmax(120px,200px)] sm:grid-cols-[1fr_minmax(150px,200px)] md:grid-cols-[minmax(0,1fr)_minmax(180px,250px)] lg:grid-cols-[minmax(0,1fr)_minmax(200px,300px)]",
    ].join(" ");
  } else if (!hasActions) {
    // Breadcrumbs, search, avatar
    return [
      ...responsiveClasses,
      "grid-cols-[1fr_minmax(120px,200px)_auto] sm:grid-cols-[1fr_minmax(150px,200px)_auto] md:grid-cols-[minmax(0,1fr)_minmax(180px,250px)_auto] lg:grid-cols-[minmax(0,1fr)_minmax(200px,300px)_auto]",
    ].join(" ");
  } else if (!hasLogin) {
    // Breadcrumbs, search, actions
    return [
      ...responsiveClasses,
      "grid-cols-[auto_auto_auto] sm:grid-cols-[auto_auto_auto] md:grid-cols-[minmax(0,1fr)_minmax(180px,250px)_auto] lg:grid-cols-[minmax(0,1fr)_minmax(200px,300px)_auto]",
    ].join(" ");
  } else {
    // All four: breadcrumbs, search, actions, avatar
    return [
      ...responsiveClasses,
      "grid-cols-[auto_auto_auto] sm:grid-cols-[auto_auto_auto] md:grid-cols-[minmax(0,1fr)_minmax(180px,250px)_auto_auto] lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)_auto_auto]",
    ].join(" ");
  }
});

const toggle = (event: Event) => {
  if (hasSlotContent(slots["avatar-menu"])) {
    menuCustom.value?.toggle(event);
  } else {
    menu.value?.toggle(event);
  }
};

// Find the scrollable parent element
const findScrollableParent = (
  element: HTMLElement | null,
): HTMLElement | null => {
  if (!element) return null;

  let parent = element.parentElement;

  while (parent) {
    const { overflow, overflowY } = window.getComputedStyle(parent);
    if (
      overflow === "auto" ||
      overflow === "scroll" ||
      overflowY === "auto" ||
      overflowY === "scroll"
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }

  // Fallback to window/document
  return document.documentElement;
};

// Scroll detection for shadow effect
const handleScroll = () => {
  if (scrollContainer.value) {
    isScrolled.value = scrollContainer.value.scrollTop > 0;
  } else {
    // Fallback to window scroll
    isScrolled.value = window.scrollY > 0;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Find and store the scrollable container
  scrollContainer.value = findScrollableParent(headerRef.value);

  if (
    scrollContainer.value &&
    scrollContainer.value !== document.documentElement
  ) {
    // Listen to the parent scrollable container
    scrollContainer.value.addEventListener("scroll", handleScroll);
  } else {
    // Fallback to window scroll
    window.addEventListener("scroll", handleScroll);
  }

  // Check initial scroll position
  handleScroll();
});

onUnmounted(() => {
  if (
    scrollContainer.value &&
    scrollContainer.value !== document.documentElement
  ) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  } else {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>
