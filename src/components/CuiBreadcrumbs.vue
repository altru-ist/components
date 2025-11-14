<template>
  <nav class="breadcrumbs-wrapper" :aria-label="ariaLabel">
    <ol :class="breadcrumbClasses">
      <li
        v-for="(item, index) in items"
        :key="item.key || index"
        class="breadcrumb-item"
        :class="{ 'breadcrumb-current': index === items.length - 1 }"
      >
        <!-- Clickable breadcrumb link -->
        <component
          v-if="index < items.length - 1 && !item.disabled"
          :is="item.href ? 'a' : 'button'"
          :href="item.href"
          :class="breadcrumbLinkClasses"
          @click="handleItemClick(item, $event)"
        >
          <span
            v-if="index === 0"
            class="breadcrumb-icon material-symbols-rounded"
          >
            home
          </span>
          {{ item.label }}
        </component>

        <!-- Current page (non-clickable) -->
        <span
          v-else
          :class="breadcrumbCurrentClasses"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          <span
            v-if="index === 0"
            class="breadcrumb-icon material-symbols-rounded"
          >
            home
          </span>
          {{ item.label }}
        </span>

        <!-- Separator (always chevron) -->
        <span
          v-if="index < items.length - 1"
          class="breadcrumb-separator"
          aria-hidden="true"
        >
          <span class="material-symbols-rounded">chevron_right</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
/**
 * Breadcrumbs
 *
 * Navigation breadcrumb trail showing the current page location within the site hierarchy.
 * Supports custom separators, icons, and accessible keyboard navigation.
 */

import { computed } from "vue";

// Breadcrumb item interface
export interface BreadcrumbItem {
  /** Unique identifier for the item */
  key?: string;
  /** Display text for the breadcrumb */
  label: string;
  /** Link href for navigation */
  href?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Custom data for click handling */
  data?: any;
}

// Component API
interface Props {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Custom aria-label for navigation */
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  ariaLabel: "Breadcrumb navigation",
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Custom item slot for rendering individual breadcrumb items
   * @arg {object} slotProps - The breadcrumb item slot properties
   * @arg {BreadcrumbItem} slotProps.item - The breadcrumb item being rendered
   * @arg {number} slotProps.index - The index of the item in the breadcrumb list
   * @arg {boolean} slotProps.isLast - Whether this is the last (current) item
   */
  item?: (props: {
    item: BreadcrumbItem;
    index: number;
    isLast: boolean;
  }) => any;
}>();

// Events
const emit = defineEmits<{
  /**
   * Emitted when a breadcrumb item is clicked
   * @arg {BreadcrumbItem} item - The clicked breadcrumb item
   * @arg {Event} event - The native click event
   */
  itemClick: [item: BreadcrumbItem, event: Event];
}>();

/**
 * Handle breadcrumb item click
 */
const handleItemClick = (item: BreadcrumbItem, event: Event) => {
  emit("itemClick", item, event);
};

/**
 * Breadcrumb container classes using design tokens
 */
const breadcrumbClasses = computed(() => ["breadcrumb-list"]);

/**
 * Breadcrumb link classes using design tokens
 */
const breadcrumbLinkClasses = computed(() => ["breadcrumb-link"]);

/**
 * Current breadcrumb classes using design tokens
 */
const breadcrumbCurrentClasses = computed(() => ["breadcrumb-current-text"]);
</script>

<style scoped>
.breadcrumbs-wrapper {
  display: block;
  width: 100%;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Default size (medium) */
.breadcrumb-list {
  font-size: 0.875rem; /* 14px */
  line-height: 1.4;
}

/* Breadcrumb links */
.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--cui-text-link);
  text-decoration: none;
  font-family: var(--font-primary);
  font-weight: 400;
  transition: color var(--ds-transition-normal);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  line-height: inherit;
}

.breadcrumb-link:hover {
  color: var(--cui-text-link-hover);
  text-decoration: underline;
}

.breadcrumb-link:focus {
  outline: 2px solid var(--cui-border-focus);
  outline-offset: 2px;
  border-radius: var(--ds-radius-sm);
}

.breadcrumb-link:active {
  color: var(--cui-text-link-active);
}

/* Current breadcrumb (non-clickable) */
.breadcrumb-current-text {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--cui-text-header-body);
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: inherit;
  line-height: inherit;
}

/* Icons */
.breadcrumb-icon {
  font-size: 1em;
  line-height: 1;
}

/* Separators */
.breadcrumb-separator {
  display: inline-flex;
  align-items: center;
  color: var(--cui-text-muted);
  font-size: 0.875em;
  margin: 0 0.25rem;
  user-select: none;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .breadcrumb-list {
    gap: 0.125rem;
  }

  .breadcrumb-separator {
    margin: 0 0.125rem;
  }

  /* Optionally hide middle items on very small screens */
  .breadcrumb-item:not(:first-child):not(:last-child):not(:nth-last-child(2)) {
    display: none;
  }

  /* Show ellipsis when items are hidden */
  .breadcrumb-item:nth-child(2)::before {
    content: "...";
    color: var(--cui-text-muted);
    margin-right: 0.25rem;
  }
}

/* Ensure proper accessibility */
.breadcrumb-current {
  font-weight: 500;
}

/* Focus management for better keyboard navigation */
.breadcrumb-link:focus-visible {
  outline: 2px solid var(--cui-border-focus);
  outline-offset: 2px;
}
</style>
