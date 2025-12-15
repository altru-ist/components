<template>
  <div
    class="flex w-full min-h-screen max-h-screen bg-[var(--cui-surface-default-gray)] relative overflow-hidden"
    :class="appClasses"
  >
    <!-- Menu Slot -->
    <div
      data-testid="cui-app-menu"
      class="h-screen overflow-y-auto transition-[margin-left] duration-[var(--ds-transition-normal)] ease"
    >
      <slot name="menu">
        <!-- Default: No menu rendered -->
      </slot>
    </div>

    <!-- Main Content Area -->
    <div
      class="flex-1 flex-col min-w-0 max-h-screen overflow-auto! cui-app__main"
    >
      <!-- Header Slot -->
      <slot name="header">
        <!-- Default: No header rendered -->
      </slot>

      <!-- Content Area -->
      <main
        class="flex-1 w-full mx-auto"
        :class="[contentPadding, contentBackground]"
      >
        <slot>
          <!-- Default content slot -->
        </slot>
      </main>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMobile && !isMenuCollapsed"
      class="fixed inset-0 bg-black/50 z-[9]"
      @click="closeMenu"
    />
  </div>
  <CuiModalsPortal />
  <!-- Toast notifications -->
  <CuiToast />
  <CuiToast position="top-left" group="tl" />
  <CuiToast position="bottom-left" group="bl" />
  <CuiToast position="bottom-right" group="br" />
</template>
<script lang="ts">
/**
 * @description CuiApp Context - Provided to all descendant components
 */
export interface CuiAppContext {
  /** Reactive reference to menu collapsed state */
  isMenuCollapsed: Ref<boolean>;
  /** Reactive reference to mobile viewport state */
  isMobile: Ref<boolean>;
  /** Reactive reference to dashboard mode state */
  isDashboard: Ref<boolean>;
  /** Computed array of current breadcrumb items */
  breadcrumbItems: ComputedRef<BreadcrumbItem[]>;
  /** Toggle menu between collapsed and expanded states */
  toggleMenu: () => void;
  /** Close (collapse) the menu */
  closeMenu: () => void;
  /** Update all breadcrumb items */
  updateBreadcrumbs: (items: BreadcrumbItem[]) => void;
  /** Add a breadcrumb item to the end */
  addBreadcrumb: (item: BreadcrumbItem) => void;
  /** Remove the last breadcrumb item */
  popBreadcrumb: () => void;
  /** Clear all breadcrumb items */
  clearBreadcrumbs: () => void;
}

/**
 * Injection key for CuiApp context
 * Use this key with inject() to access the app context in descendant components
 */
export const CuiAppContextKey: InjectionKey<CuiAppContext> =
  Symbol("CuiAppContext");
</script>
<script setup lang="ts">
/**
 * App
 *
 * Top-level application layout container providing structure for menu, header, and content areas.
 * Manages responsive behavior, menu state, and breadcrumb navigation via provide/inject pattern.
 */

import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";
import type { BreadcrumbItem } from "./CuiBreadcrumbs.vue";
import CuiToast from "./CuiToast.vue";
import { CuiModalsPortal } from "./modal";

// Types
export interface CuiAppProps {
  /** Initial collapsed state of the menu */
  initialMenuCollapsed?: boolean;
  /** Initial breadcrumb items */
  breadcrumbItems?: BreadcrumbItem[];
  /** Mobile breakpoint in pixels (default: 768) */
  mobileBreakpoint?: number;
  /** Whether the app is in dashboard mode */
  dashboard?: boolean;
}

const props = withDefaults(defineProps<CuiAppProps>(), {
  initialMenuCollapsed: false,
  breadcrumbItems: () => [],
  mobileBreakpoint: 768,
  dashboard: false,
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Menu slot for navigation menu component
   * Use inject(CuiAppContextKey) to access app state and methods
   */
  menu?: () => any;

  /**
   * Header slot for header component
   * Use inject(CuiAppContextKey) to access app state and methods
   */
  header?: () => any;

  /**
   * Default slot for main content area
   * This is where the primary application content should be placed
   * Use inject(CuiAppContextKey) to access app state and methods
   */
  default?: () => any;
}>();

// Events
const emit = defineEmits<{
  /**
   * Emitted when menu collapse state changes
   * @arg {boolean} collapsed - The new collapsed state
   */
  "menu-toggle": [collapsed: boolean];

  /**
   * Emitted when viewport changes between mobile and desktop
   * @arg {boolean} isMobile - Whether the viewport is mobile
   */
  "viewport-change": [isMobile: boolean];

  /**
   * Emitted when breadcrumbs are updated
   * @arg {BreadcrumbItem[]} items - The new breadcrumb items
   */
  "breadcrumbs-update": [items: BreadcrumbItem[]];
}>();

// State variables
const isMenuCollapsed = ref(props.initialMenuCollapsed);
const isMobile = ref(false);
const isDashboard = ref(props.dashboard);
const internalBreadcrumbs = ref<BreadcrumbItem[]>([...props.breadcrumbItems]);

// Computed properties
const appClasses = computed(() => ({
  "cui-app--menu-collapsed": isMenuCollapsed.value,
  "cui-app--menu-expanded": !isMenuCollapsed.value,
  "cui-app--mobile": isMobile.value,
  "cui-app--desktop": !isMobile.value,
}));

const breadcrumbItems = computed(() => internalBreadcrumbs.value);

const contentPadding = computed(() => {
  if (!isMobile.value) return "p-6";
  return window.innerWidth < 480 ? "p-3" : "p-4";
});

const contentBackground = computed(() =>
  isDashboard.value
    ? "bg-[var(--cui-surface-default-gray)]"
    : "bg-[var(--cui-surface-default-white)]"
);

// Functions
/**
 * Toggles the menu between collapsed and expanded states
 */
const toggleMenu = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value;
  emit("menu-toggle", isMenuCollapsed.value);
};

/**
 * Closes (collapses) the menu
 */
const closeMenu = () => {
  if (!isMenuCollapsed.value) {
    isMenuCollapsed.value = true;
    emit("menu-toggle", true);
  }
};

/**
 * Updates the breadcrumb items
 * @param items - New breadcrumb items to display
 */
const updateBreadcrumbs = (items: BreadcrumbItem[]) => {
  internalBreadcrumbs.value = [...items];
  emit("breadcrumbs-update", items);
};

/**
 * Adds a breadcrumb item to the end of the breadcrumb trail
 * @param item - Breadcrumb item to add
 */
const addBreadcrumb = (item: BreadcrumbItem) => {
  internalBreadcrumbs.value.push(item);
  emit("breadcrumbs-update", internalBreadcrumbs.value);
};

/**
 * Removes the last breadcrumb item
 */
const popBreadcrumb = () => {
  if (internalBreadcrumbs.value.length > 0) {
    internalBreadcrumbs.value.pop();
    emit("breadcrumbs-update", internalBreadcrumbs.value);
  }
};

/**
 * Clears all breadcrumb items
 */
const clearBreadcrumbs = () => {
  internalBreadcrumbs.value = [];
  emit("breadcrumbs-update", internalBreadcrumbs.value);
};

/**
 * Checks current viewport width and updates mobile state
 */
const checkViewport = () => {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < props.mobileBreakpoint;

  // Auto-collapse menu on mobile
  if (isMobile.value && !isMenuCollapsed.value && !wasMobile) {
    isMenuCollapsed.value = true;
    emit("menu-toggle", true);
  }

  // Emit viewport change event
  if (wasMobile !== isMobile.value) {
    emit("viewport-change", isMobile.value);
  }
};

// Watchers
watch(
  () => props.breadcrumbItems,
  (newItems) => {
    internalBreadcrumbs.value = [...newItems];
  },
  { deep: true },
);

watch(
  () => props.initialMenuCollapsed,
  (newValue) => {
    isMenuCollapsed.value = newValue;
  },
);

watch(
  () => props.dashboard,
  (newValue) => {
    isDashboard.value = newValue;
  },
);

// Provide context to all descendant components
const appContext: CuiAppContext = {
  isMenuCollapsed,
  isMobile,
  isDashboard,
  breadcrumbItems,
  toggleMenu,
  closeMenu,
  updateBreadcrumbs,
  addBreadcrumb,
  popBreadcrumb,
  clearBreadcrumbs,
};

provide(CuiAppContextKey, appContext);

// Lifecycle hooks
onMounted(() => {
  checkViewport();
  window.addEventListener("resize", checkViewport);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkViewport);
});

// Expose methods and state for parent components (template refs)
defineExpose({
  updateBreadcrumbs,
  addBreadcrumb,
  popBreadcrumb,
  clearBreadcrumbs,
  toggleMenu,
  closeMenu,
  isMenuCollapsed,
  isMobile,
  isDashboard,
});
</script>

<style scoped>
/* Scrollbar gutter doesn't have a Tailwind utility */
.cui-app__main {
  scrollbar-gutter: stable;
}
</style>
