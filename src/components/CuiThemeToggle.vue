<!--
  ThemeToggle.vue - Design System Theme Toggle Component
  
  A specialized button component for switching between light and dark themes.
  Built on top of our Button component to maintain consistency.
  
  Features:
  - Automatic theme state management via useTheme composable
  - Accessible with proper ARIA labels and descriptions
  - Smooth icon transitions between light/dark states
  - Consistent styling using design tokens
  - Keyboard navigation support
-->

<template>
  <CuiButton
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :floating="floating"
    :aria-label="ariaLabel"
    :aria-pressed="isDark"
    :aria-checked="isDark"
    role="switch"
    :icon-only="iconOnly"
    @click="handleToggle"
    @focus="emits('focus', $event)"
    @blur="emits('blur', $event)"
  >
    <template #icon>
      <span
        class="material-symbols-rounded theme-toggle-icon"
        :class="{ 'theme-toggle-icon--transitioning': isTransitioning }"
      >
        {{ currentIcon }}
      </span>
    </template>

    <!-- Show label text only if not icon-only -->
    <template v-if="!iconOnly">
      {{ currentLabel }}
    </template>
  </CuiButton>
</template>

<script setup lang="ts">
/**
 * ThemeToggle
 *
 * Button component for toggling between light and dark themes. Uses the useTheme
 * composable for state management with persistent theme preference.
 */

import { computed, ref } from "vue";
import { useTheme } from "../utils/useTheme";
import CuiButton from "./CuiButton.vue";

// Design System API
export interface CuiThemeToggleProps {
  /** Visual variant of the button */
  variant?: "hero" | "primary" | "secondary-outline" | "secondary-text";
  /** Size of the button */
  size?: "small" | "medium" | "large";
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether to show only the icon (no text label) */
  iconOnly?: boolean;
  /** Whether the button should have a floating shadow */
  floating?: boolean;
  /** Custom aria-label (auto-generated if not provided) */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<CuiThemeToggleProps>(), {
  variant: "secondary-outline",
  size: "medium",
  disabled: false,
  iconOnly: false,
  floating: false,
});

// Events we want to expose
const emits = defineEmits<{
  /**
   * Emitted when the theme is toggled
   * @arg {object} event - The toggle event details
   * @arg {'light' | 'dark'} event.theme - The new theme that was set
   * @arg {'light' | 'dark'} event.previousTheme - The previous theme
   */
  toggle: [event: { theme: "light" | "dark"; previousTheme: "light" | "dark" }];

  /**
   * Emitted when the button receives focus
   * @arg {FocusEvent} event - The native focus event
   */
  focus: [event: FocusEvent];

  /**
   * Emitted when the button loses focus
   * @arg {FocusEvent} event - The native blur event
   */
  blur: [event: FocusEvent];
}>();

// Theme management
const { theme, isDark, toggleTheme } = useTheme();

// Animation state for smooth icon transitions
const isTransitioning = ref(false);

// Computed properties for dynamic content
const currentIcon = computed(() => {
  return isDark.value ? "light_mode" : "dark_mode";
});

const currentLabel = computed(() => {
  return isDark.value ? "Switch to Light Mode" : "Switch to Dark Mode";
});

const ariaLabel = computed(() => {
  if (props.ariaLabel) {
    return props.ariaLabel;
  }
  return isDark.value ? "Switch to light mode" : "Switch to dark mode";
});

// Handle theme toggle with animation
const handleToggle = async () => {
  if (props.disabled) return;

  const previousTheme = theme.value;

  // Start transition animation
  isTransitioning.value = true;

  // Toggle the theme
  toggleTheme();

  // Emit the toggle event
  emits("toggle", {
    theme: theme.value,
    previousTheme,
  });

  // End transition animation after a short delay
  setTimeout(() => {
    isTransitioning.value = false;
  }, 200);
};
</script>

<style scoped>
.theme-toggle-icon {
  display: inline-block;
  transition:
    transform 0.2s ease-in-out,
    opacity 0.15s ease-in-out;
}

.theme-toggle-icon--transitioning {
  transform: rotate(180deg);
}
</style>
