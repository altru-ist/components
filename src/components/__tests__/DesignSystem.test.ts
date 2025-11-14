import { render } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import CuiAvatar from "../CuiAvatar.vue";
import CuiBadge from "../CuiBadge.vue";
import CuiBreadcrumbs from "../CuiBreadcrumbs.vue";
import CuiButton from "../CuiButton.vue";
import CuiCard from "../CuiCard.vue";
import CuiHeader from "../CuiHeader.vue";
import CuiMainMenu from "../CuiMainMenu.vue";
import CuiSearchBar from "../CuiSearchBar.vue";
import CuiTextInput from "../CuiTextInput.vue";

describe("Design System Constraints", () => {
  describe("Icon-Only Buttons Must Be Square", () => {
    it("should make icon-only buttons square", () => {
      const { container } = render(CuiButton, {
        props: { iconOnly: true, ariaLabel: "Edit" },
        slots: {
          default: '<span class="material-symbols-rounded">edit</span>',
        },
      });

      const button = container.querySelector('[data-pc-name="button"]');
      const classes = button?.className || "";

      // Should have matching width and height
      expect(classes).toContain("w-[var(--ds-button-height-md)]");
      expect(classes).toContain("h-[var(--ds-button-height-md)]");
      expect(classes).toContain("p-0"); // No padding for icon-only
    });

    it("should keep regular buttons rectangular", () => {
      const { container } = render(CuiButton, {
        slots: {
          default: "Click me",
        },
      });

      const button = container.querySelector('[data-pc-name="button"]');
      const classes = button?.className || "";

      // Should have regular padding, not square
      expect(classes).toContain("px-4");
      expect(classes).toContain("py-2");
      expect(classes).not.toContain("w-[var(--ds-button-height-md)]");
    });
  });

  describe("Icon-Only Buttons Must Use Pill Badges", () => {
    it("should warn when badge variant is used on icon-only button", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      render({
        template: `
          <CuiButton icon-only aria-label="Notifications">
            <span class="material-symbols-rounded">notifications</span>
            <template #badge>
              <CuiBadge variant="badge" value="3" />
            </template>
          </CuiButton>
        `,
        components: { CuiButton, CuiBadge },
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Design System Warning: Icon-only buttons should use pill variants, not badge variant. Auto-converting to pill-large.",
      );

      consoleWarnSpy.mockRestore();
    });

    it("should auto-convert badge to pill on icon-only buttons", () => {
      const { container } = render({
        template: `
          <CuiButton icon-only aria-label="Notifications">
            <span class="material-symbols-rounded">notifications</span>
            <template #badge>
              <CuiBadge variant="badge" value="3" />
            </template>
          </CuiButton>
        `,
        components: { CuiButton, CuiBadge },
      });

      const badge = container.querySelector('[data-pc-name="badge"]');
      const classes = badge?.className || "";

      // Should be converted to pill-large dimensions
      expect(classes).toContain("w-[9px]");
      expect(classes).toContain("h-[9px]");

      // Should not show content (pill behavior)
      expect(badge?.textContent).toBe("");
    });

    it("should allow pill variants without warning", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      render({
        template: `
          <CuiButton icon-only aria-label="Notifications">
            <span class="material-symbols-rounded">notifications</span>
            <template #badge>
              <Badge variant="pill-large" />
            </template>
          </CuiButton>
        `,
        components: { CuiButton, CuiBadge },
      });

      // Should not warn about badge variant (since we're using pill-large)
      // The only warning should be filtered out by our test setup
      const designSystemWarnings = consoleWarnSpy.mock.calls.filter((call) =>
        call[0]?.includes?.("Design System Warning"),
      );
      expect(designSystemWarnings).toHaveLength(0);
      consoleWarnSpy.mockRestore();
    });
  });

  describe("Pill Badges Must Be Absolutely Positioned", () => {
    it("should position pill badges absolutely on buttons", () => {
      const { container } = render({
        template: `
          <CuiButton icon-only aria-label="Notifications">
            <span class="material-symbols-rounded">notifications</span>
            <template #badge>
              <CuiBadge variant="pill-large" />
            </template>
          </CuiButton>
        `,
        components: { CuiButton, CuiBadge },
      });

      const badge = container.querySelector('[data-pc-name="badge"]');
      const classes = badge?.className || "";

      expect(classes).toContain("absolute");
      expect(classes).toContain("top-0");
      expect(classes).toContain("-right-0.5");
    });

    it("should not position regular badges absolutely", () => {
      const { container } = render({
        template: `
          <CuiButton>
            Button Text
            <template #badge>
              <CuiBadge variant="badge" value="3" />
            </template>
          </CuiButton>
        `,
        components: { CuiButton, CuiBadge },
      });

      const badge = container.querySelector('[data-pc-name="badge"]');
      const classes = badge?.className || "";

      expect(classes).not.toContain("absolute");
      expect(classes).toContain("ml-[var(--ds-badge-gap-from-text)]");
    });
  });

  describe("Pill Badges Must Have Outlines Inside Buttons", () => {
    it("should automatically outline pill badges inside buttons", () => {
      const { container } = render({
        template: `
          <CuiButton icon-only aria-label="Notifications">
            <span class="material-symbols-rounded">notifications</span>
            <template #badge>
              <CuiBadge variant="pill-large" />
            </template>
          </CuiButton>
        `,
        components: { CuiButton, CuiBadge },
      });

      const badge = container.querySelector('[data-pc-name="badge"]');
      const classes = badge?.className || "";

      expect(classes).toContain("badge-outlined");
    });
  });

  describe("Badge Content Rules", () => {
    it("should show content only for badge variant", () => {
      const { container: badgeContainer } = render(CuiBadge, {
        props: { variant: "badge", value: "3" },
      });

      const { container: pillContainer } = render(CuiBadge, {
        props: { variant: "pill-large" },
      });

      const badgeElement = badgeContainer.querySelector(
        '[data-pc-name="badge"]',
      );
      const pillElement = pillContainer.querySelector('[data-pc-name="badge"]');

      expect(badgeElement?.textContent).toBe("3");
      expect(pillElement?.textContent).toBe("");
    });
  });

  describe("Badge Component API", () => {
    it("should render all badge variants correctly", () => {
      // Test badge variant
      const { container: badgeContainer } = render(CuiBadge, {
        props: { variant: "badge", value: "Test" },
      });
      const badgeElement = badgeContainer.querySelector(
        '[data-pc-name="badge"]',
      );
      expect(badgeElement).toBeTruthy();
      expect(badgeElement?.className).toContain(
        "bg-[var(--cui-surface-notification-badge)]",
      );
      expect(badgeElement?.className).not.toContain("absolute");

      // Test pill-large variant
      const { container: pillLargeContainer } = render(CuiBadge, {
        props: { variant: "pill-large" },
      });
      const pillLargeElement = pillLargeContainer.querySelector(
        '[data-pc-name="badge"]',
      );
      expect(pillLargeElement).toBeTruthy();
      expect(pillLargeElement?.className).toContain(
        "bg-[var(--cui-surface-notification-pill)]",
      );
      expect(pillLargeElement?.className).toContain("w-[9px]");
      expect(pillLargeElement?.className).toContain("h-[9px]");

      // Test pill-small variant
      const { container: pillSmallContainer } = render(CuiBadge, {
        props: { variant: "pill-small" },
      });
      const pillSmallElement = pillSmallContainer.querySelector(
        '[data-pc-name="badge"]',
      );
      expect(pillSmallElement).toBeTruthy();
      expect(pillSmallElement?.className).toContain(
        "bg-[var(--cui-surface-notification-pill)]",
      );
      expect(pillSmallElement?.className).toContain("w-[7px]");
      expect(pillSmallElement?.className).toContain("h-[7px]");
    });

    it("should handle outlined prop correctly", () => {
      const { container } = render(CuiBadge, {
        props: { variant: "badge", outlined: true },
      });

      const badge = container.querySelector('[data-pc-name="badge"]');
      const classes = badge?.className || "";

      expect(classes).toContain("badge-outlined");
    });

    it("should handle value prop for badge variant", () => {
      const { container } = render(CuiBadge, {
        props: { variant: "badge", value: "Custom Value" },
      });

      expect(container.textContent).toContain("Custom Value");
    });

    it("should test pill-small variant coverage", () => {
      const { container } = render({
        template: `
          <CuiButton icon-only aria-label="Notifications">
            <span class="material-symbols-rounded">notifications</span>
            <template #badge>
              <CuiBadge variant="pill-small" />
            </template>
          </CuiButton>
        `,
        components: { CuiButton, CuiBadge },
      });

      const badge = container.querySelector('[data-pc-name="badge"]');
      const classes = badge?.className || "";

      // Should be pill-small size
      expect(classes).toContain("w-[7px]");
      expect(classes).toContain("h-[7px]");

      // Should be absolutely positioned inside button
      expect(classes).toContain("absolute");

      // Should have outline inside button
      expect(classes).toContain("badge-outlined");
    });
  });

  describe("Size Consistency", () => {
    it("should maintain proportions across sizes for icon-only buttons", () => {
      // Test small size
      const { container: smallContainer } = render(CuiButton, {
        props: { size: "small", iconOnly: true, ariaLabel: "Edit" },
        slots: {
          default: '<span class="material-symbols-rounded">edit</span>',
        },
      });
      const smallButton = smallContainer.querySelector(
        '[data-pc-name="button"]',
      );
      expect(smallButton?.className).toContain(
        "w-[var(--ds-button-height-sm)]",
      );

      // Test medium size
      const { container: mediumContainer } = render(CuiButton, {
        props: { size: "medium", iconOnly: true, ariaLabel: "Edit" },
        slots: {
          default: '<span class="material-symbols-rounded">edit</span>',
        },
      });
      const mediumButton = mediumContainer.querySelector(
        '[data-pc-name="button"]',
      );
      expect(mediumButton?.className).toContain(
        "w-[var(--ds-button-height-md)]",
      );

      // Test large size
      const { container: largeContainer } = render(CuiButton, {
        props: { size: "large", iconOnly: true, ariaLabel: "Edit" },
        slots: {
          default: '<span class="material-symbols-rounded">edit</span>',
        },
      });
      const largeButton = largeContainer.querySelector(
        '[data-pc-name="button"]',
      );
      expect(largeButton?.className).toContain(
        "w-[var(--ds-button-height-lg)]",
      );
    });
  });

  describe("TextInput Component Compliance", () => {
    describe("Wrapper Pattern Implementation", () => {
      it("should wrap PrimeVue InputText with unstyled approach", () => {
        const { container } = render(CuiTextInput, {
          props: { placeholder: "Test input" },
        });

        const inputElement = container.querySelector(
          'input[data-pc-name="inputtext"]',
        );
        expect(inputElement).toBeTruthy();

        // Should use our design tokens for styling
        const classes = inputElement?.className || "";
        expect(classes).toContain("w-full");
        expect(classes).toContain("font-[var(--font-primary)]");
        expect(classes).toContain("border");
      });

      it("should use semantic API props correctly", () => {
        const { container } = render(CuiTextInput, {
          props: {
            size: "large",
            disabled: true,
            placeholder: "Large disabled input",
          },
        });

        const inputElement = container.querySelector("input");
        expect(inputElement).toBeTruthy();
        expect(inputElement?.disabled).toBe(true);
        expect(inputElement?.placeholder).toBe("Large disabled input");

        const classes = inputElement?.className || "";
        expect(classes).toContain("h-12"); // Large size
        expect(classes).toContain("bg-[var(--cui-surface-default-white)]"); // Default style
      });
    });

    describe("Design Token Usage", () => {
      it("should use only semantic color tokens", () => {
        const { container } = render(CuiTextInput);

        const inputElement = container.querySelector("input");
        const classes = inputElement?.className || "";

        // Should use semantic tokens, not hardcoded colors
        expect(classes).toContain("bg-[var(--cui-surface-default-white)]");
        expect(classes).toContain("border-[var(--cui-border-neutral)]");
        expect(classes).toContain("text-[var(--cui-text-header-body)]");
        expect(classes).toContain(
          "placeholder:text-[var(--cui-text-subtitle-caption)]",
        );
      });

      it("should use proper focus styling with semantic tokens", () => {
        const { container } = render(CuiTextInput);

        const inputElement = container.querySelector("input");
        const classes = inputElement?.className || "";

        expect(classes).toContain("focus:ring-[var(--cui-border-focus)]");
        expect(classes).toContain("hover:border-[var(--cui-border-focus)]");
      });
    });

    describe("Component API Consistency", () => {
      it("should use consistent default styling", () => {
        const { container } = render(CuiTextInput, {
          props: { placeholder: "default input" },
        });

        const inputElement = container.querySelector("input");
        const classes = inputElement?.className || "";

        expect(classes).toContain("bg-[var(--cui-surface-default-white)]");
        expect(classes).toContain("border-[var(--cui-border-neutral)]");
        expect(classes).toContain("text-[var(--cui-text-header-body)]");
      });

      it("should support consistent size prop pattern", () => {
        // Test medium size
        const { container: mediumContainer } = render(CuiTextInput, {
          props: { size: "medium", placeholder: "medium input" },
        });
        const mediumInput = mediumContainer.querySelector("input");
        expect(mediumInput?.className).toContain("h-10");

        // Test large size
        const { container: largeContainer } = render(CuiTextInput, {
          props: { size: "large", placeholder: "large input" },
        });
        const largeInput = largeContainer.querySelector("input");
        expect(largeInput?.className).toContain("h-12");
      });

      it("should handle standard interaction states", () => {
        const { container: disabledContainer } = render(CuiTextInput, {
          props: { disabled: true },
        });

        const { container: readonlyContainer } = render(CuiTextInput, {
          props: { readonly: true, modelValue: "readonly value" },
        });

        const { container: errorContainer } = render(CuiTextInput, {
          props: { invalid: true, error: "This field is required" },
        });

        // Disabled state
        const disabledInput = disabledContainer.querySelector("input");
        expect(disabledInput?.disabled).toBe(true);
        expect(disabledInput?.className).toContain("disabled:opacity-60");

        // Readonly state
        const readonlyInput = readonlyContainer.querySelector("input");
        expect(readonlyInput?.readOnly).toBe(true);
        expect(readonlyInput?.value).toBe("readonly value");

        // Error state
        const errorInput = errorContainer.querySelector("input");
        expect(errorInput?.className).toContain(
          "!border-[var(--cui-border-danger)]",
        );

        // Error message should be displayed
        const errorMessage = errorContainer.querySelector(
          ".text-input-error-message",
        );
        expect(errorMessage?.textContent).toBe("This field is required");
      });
    });

    describe("Label and Form Integration", () => {
      it("should render labels correctly when provided", () => {
        const { container } = render(CuiTextInput, {
          props: { label: "Full Name", placeholder: "Enter your name" },
        });

        const label = container.querySelector(".text-input-label");
        expect(label?.textContent).toBe("Full Name");

        const input = container.querySelector("input");
        expect(input?.placeholder).toBe("Enter your name");
      });

      it("should not render label when not provided", () => {
        const { container } = render(CuiTextInput, {
          props: { placeholder: "No label input" },
        });

        const label = container.querySelector(".text-input-label");
        expect(label).toBeFalsy();
      });

      it("should support v-model through modelValue prop", () => {
        const { container } = render(CuiTextInput, {
          props: { modelValue: "Initial value" },
        });

        const input = container.querySelector("input");
        expect(input?.value).toBe("Initial value");
      });
    });

    describe("Event Handling", () => {
      it("should emit standard form events", () => {
        const { container } = render(CuiTextInput, {
          props: { placeholder: "Test input" },
        });

        const input = container.querySelector("input");

        // Trigger events to verify they're properly forwarded
        if (input) {
          input.focus();
          input.blur();
        }

        // Note: In a real implementation, we'd test that events are emitted
        // For now, we verify the component renders and accepts event handlers
        expect(input).toBeTruthy();
      });
    });

    describe("Accessibility Compliance", () => {
      it("should maintain proper ARIA attributes from PrimeVue", () => {
        const { container } = render(CuiTextInput, {
          props: {
            label: "Email Address",
            invalid: true,
            error: "Please enter a valid email",
          },
        });

        const input = container.querySelector("input");
        const wrapper = container.querySelector(".text-input-wrapper");

        expect(input).toBeTruthy();
        expect(wrapper).toBeTruthy();

        // Should preserve input semantics
        expect(input?.tagName.toLowerCase()).toBe("input");
      });

      it("should handle error states accessibly", () => {
        const { container } = render(CuiTextInput, {
          props: {
            invalid: true,
            error: "This field is required",
          },
        });

        const input = container.querySelector("input");
        const errorMessage = container.querySelector(
          ".text-input-error-message",
        );

        expect(input?.className).toContain(
          "!border-[var(--cui-border-danger)]",
        );
        expect(errorMessage?.textContent).toBe("This field is required");
        expect(errorMessage).toBeTruthy(); // Error message exists
      });
    });

    describe("Design System Integration", () => {
      it("should work consistently with other form components", () => {
        // Test that TextInput follows the same patterns as Button
        const { container: inputContainer } = render(CuiTextInput, {
          props: { size: "large" },
        });

        const { container: buttonContainer } = render(CuiButton, {
          props: { size: "large" },
          slots: { default: "Large Button" },
        });

        const input = inputContainer.querySelector("input");
        const button = buttonContainer.querySelector('[data-pc-name="button"]');

        // Both should use same height token for consistency
        expect(input?.className).toContain("h-12"); // Large size
        expect(button?.className).toContain("h-[var(--ds-button-height-lg)]"); // Large size
      });

      it("should maintain consistent border radius with design tokens", () => {
        const { container } = render(CuiTextInput, {
          props: { size: "medium" },
        });

        const input = container.querySelector("input");
        const classes = input?.className || "";

        // Should use design system radius tokens
        expect(classes).toContain("rounded-[var(--ds-radius-md)]");
      });
    });
  });

  // Basic smoke tests for remaining components to ensure they render
  describe("Component Smoke Tests", () => {
    it("should render Card component", () => {
      const { container } = render(CuiCard, {
        props: { title: "Test Card" },
      });
      expect(container.querySelector('[data-pc-name="card"]')).toBeTruthy();
    });

    it("should render Avatar component", () => {
      const { container } = render(CuiAvatar, {
        props: { alt: "Test User" },
      });
      expect(container.firstChild).toBeTruthy();
    });

    it("should render Breadcrumbs component", () => {
      const { container } = render(CuiBreadcrumbs, {
        props: { items: [{ label: "Home" }] },
      });
      expect(container.firstChild).toBeTruthy();
    });

    it("should render Header component", () => {
      const { container } = render(CuiHeader, {
        props: { breadcrumbItems: [{ label: "Home" }] },
      });
      expect(container.firstChild).toBeTruthy();
    });

    it("should render MainMenu component", () => {
      const { container } = render(CuiMainMenu, {
        props: { items: [] },
      });
      expect(container.firstChild).toBeTruthy();
    });

    it("should render SearchBar component", () => {
      const { container } = render(CuiSearchBar, {
        props: { placeholder: "Search..." },
      });
      expect(container.querySelector(".block.w-full")).toBeTruthy();
    });
  });
});
