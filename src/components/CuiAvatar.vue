<template>
  <div class="cui-avatar-wrapper" :class="`cui-avatar-wrapper--${size}`">
    <div :class="avatarClasses" :style="avatarStyles">
      <!-- User Image or Default Avatar with proper error handling -->
      <img
        :src="src || defaultAvatarUrl"
        :alt="alt || 'User avatar'"
        class="cui-avatar__image"
      />
    </div>
    <!-- Badge in top-right corner - positioned outside avatar for no clipping -->
    <div v-if="badgeDisplayValue" class="cui-avatar__badge">
      <CuiBadge
        :variant="badgeType"
        :value="badgeDisplayValue"
        :outlined="true"
        size="small"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Avatar
 *
 * A flexible avatar component for displaying user profile images with customizable sizes,
 * optional borders, interactive states, and notification badges. Includes automatic fallback
 * to default avatar and badge number formatting (99+ for values >= 100).
 */

import { computed } from "vue";
import CuiBadge from "./CuiBadge.vue";
// Default avatar image from your avatar collection
const defaultAvatarUrl = "/avatars/avatar-2.png";

// Design System API - Following our established patterns
interface Props {
  /** Image source URL for the avatar */
  src?: string;
  /** Alt text for accessibility (auto-generated if not provided) */
  alt?: string;
  /** Size variant following our design system scale */
  size?: "xs" | "sm" | "md" | "lg";
  /** Whether to show white border around avatar */
  bordered?: boolean;
  /** Whether avatar is clickable/interactive (adds hover effects) */
  interactable?: boolean;
  /** Badge number to display in top-right corner (numbers >= 100 show as "99+") */
  badge?: number;
  /** Badge variant (always outlined when used with avatar) */
  badgeType?: "badge" | "pill-large" | "pill-small";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  bordered: false,
  interactable: false,
  badgeType: "badge",
});

// Size mapping to our specified pixel values
const sizeMap = {
  xs: "28px", // 1.75rem
  sm: "42px", // 2.625rem
  md: "56px", // 3.5rem
  lg: "96px", // 6rem
} as const;

// Computed classes following our design system patterns
const avatarClasses = computed(() => [
  "cui-avatar",
  `cui-avatar--${props.size}`,
  {
    "cui-avatar--bordered": props.bordered,
    "cui-avatar--interactable": props.interactable,
  },
]);

// Computed badge display value with 99+ logic
const badgeDisplayValue = computed(() => {
  if (!props.badge) return undefined;
  return props.badge >= 100 ? "99+" : props.badge.toString();
});

// Dynamic sizing styles
const avatarStyles = computed(() => ({
  width: sizeMap[props.size],
  height: sizeMap[props.size],
}));

// Default avatar fallback is handled directly with defaultAvatarUrl constant
</script>

<style scoped>
/* Wrapper for avatar and badge positioning */
.cui-avatar-wrapper {
  display: inline-flex;
  position: relative;
  flex-shrink: 0;
}

/* Base avatar styles using design tokens */
.cui-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--cui-surface-subtle);
  border: none; /* No default border - only when bordered prop is true */
  border-radius: var(--ds-radius-full); /* Always circular */
  font-family: var(--font-primary);
  flex-shrink: 0;
  user-select: none;
}

/* Image styles */
.cui-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border: none;
  background: none;
}

/* Accessibility */
.cui-avatar:focus-visible {
  outline: 2px solid var(--cui-border-focus);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .cui-avatar {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .cui-avatar {
    transition: none;
  }
}

/* Bordered variants - white border outside the avatar */
.cui-avatar--bordered {
  border: 2px solid white; /* White border only, no grey outline */
}

/* Size-specific border widths */
.cui-avatar--bordered.cui-avatar--xs {
  border-width: 2px;
}

.cui-avatar--bordered.cui-avatar--sm {
  border-width: 3px;
}

.cui-avatar--bordered.cui-avatar--md {
  border-width: 4px;
}

.cui-avatar--bordered.cui-avatar--lg {
  border-width: 4px;
}

/* Interactable variants - hover effects for clickable avatars */
.cui-avatar--interactable {
  cursor: pointer;
  transition:
    transform var(--ds-transition-normal) ease,
    box-shadow var(--ds-transition-normal) ease,
    opacity var(--ds-transition-normal) ease;
}

.cui-avatar--interactable:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cui-avatar--interactable:active {
  transform: scale(0.98);
  transition-duration: 0.1s;
}

/* Enhanced hover effect for bordered interactable avatars */
.cui-avatar--interactable.cui-avatar--bordered:hover {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 0 3px rgba(255, 255, 255, 0.8);
}

/* Badge positioning - relative to wrapper, not avatar */
/* Using transform to center badges regardless of their width */
.cui-avatar__badge {
  position: absolute;
  top: -2px;
  right: -2px;
  z-index: 2;
  pointer-events: none; /* Badge should not interfere with avatar clicks */
  transform: translate(
    50%,
    -50%
  ); /* Center the badge on the positioning point */
}

/* Badge positioning adjustments by avatar size - targeting wrapper */
/* Positioning the center point of the badge, not the edge */
.cui-avatar-wrapper--xs .cui-avatar__badge {
  top: 3px;
  right: 1px;
}

.cui-avatar-wrapper--sm .cui-avatar__badge {
  top: 4px;
  right: 0px;
}

.cui-avatar-wrapper--md .cui-avatar__badge {
  top: 8px;
  right: 2px;
}

.cui-avatar-wrapper--lg .cui-avatar__badge {
  top: 12px;
  right: 6px;
}
</style>
