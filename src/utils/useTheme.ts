/**
 * Theme Management Composable
 *
 * Provides reactive theme state management for light/dark mode switching.
 * Uses localStorage for persistence and applies theme via data-theme attribute.
 */

import { computed, onMounted, ref, watch } from "vue";

export type Theme = "light" | "dark";

// Global theme state - shared across all component instances
const currentTheme = ref<Theme>("light");
const isInitialized = ref(false);

/**
 * Theme management composable
 *
 * @returns Object containing theme state and controls
 */
export function useTheme() {
  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    if (isInitialized.value) return;

    // Check localStorage first
    const savedTheme = localStorage.getItem("cui-theme") as Theme | null;

    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      currentTheme.value = savedTheme;
    } else {
      // Fall back to system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      currentTheme.value = prefersDark ? "dark" : "light";
    }

    isInitialized.value = true;
  };

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
  };

  // Set specific theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
  };

  // Computed properties
  const isDark = computed(() => currentTheme.value === "dark");
  const isLight = computed(() => currentTheme.value === "light");

  // Watch for theme changes and apply them
  watch(
    currentTheme,
    (newTheme) => {
      applyTheme(newTheme);
      localStorage.setItem("cui-theme", newTheme);
    },
    { immediate: true },
  );

  // Initialize on mount
  onMounted(() => {
    initializeTheme();
    applyTheme(currentTheme.value);
  });

  return {
    // State
    theme: computed(() => currentTheme.value),
    isDark,
    isLight,

    // Actions
    toggleTheme,
    setTheme,

    // Utilities
    initializeTheme,
  };
}
