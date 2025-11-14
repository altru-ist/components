import { config } from "@vue/test-utils";
import { vi } from "vitest";

// Mock PrimeVue configuration
config.global.mocks = {
  $primevue: {
    config: {
      ripple: false,
      inputStyle: "outlined",
      locale: {
        accept: "Yes",
        reject: "No",
      },
    },
  },
};

// Mock window.getComputedStyle for CSS custom properties
Object.defineProperty(window, "getComputedStyle", {
  value: vi.fn(() => ({
    getPropertyValue: vi.fn((prop: string) => {
      const mockValues: Record<string, string> = {
        "--ds-button-height-sm": "2rem",
        "--ds-button-height-md": "2.5rem",
        "--ds-button-height-lg": "3rem",
        "--ds-button-font-size-sm": "0.875rem",
        "--ds-button-font-size-md": "1rem",
        "--ds-button-font-size-lg": "1.125rem",
      };
      return mockValues[prop] || "";
    }),
  })),
});

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn;
console.warn = vi.fn((...args: any[]) => {
  // Only show design system warnings in tests that explicitly expect them
  if (args[0]?.includes?.("Design System Warning")) {
    return;
  }
  originalWarn(...args);
});
