/**
 * MyButton Stories - Design System Button Wrapper
 *
 * Demonstrates the wrapper pattern with:
 * 1. Clean design system API (semantic variants)
 * 2. Composition examples (badges inside buttons)
 * 3. Proper accessibility handling
 * 4. Brand styling using design tokens
 */

import MyBadge from "../components/MyBadge.vue";
import MyButton from "../components/MyButton.vue";

export const myButtonStories = [
  {
    title: "Button Variants",
    description:
      "Semantic variants that map to brand styling via design tokens",
    component: MyButton,
    variants: [
      {
        name: "Primary",
        description: "Main call-to-action button for important actions",
        props: {
          variant: "primary",
        },
        slots: {
          default: "Primary Action",
        },
        tokens: [
          "--cui-button-primary-rest",
          "--cui-button-primary-hover",
          "--cui-button-primary-active",
        ],
        accessibility: ["WCAG AA", "Keyboard Navigation", "Focus Management"],
      },
      {
        name: "Secondary",
        description: "Secondary actions with outlined styling",
        props: {
          variant: "secondary",
        },
        slots: {
          default: "Secondary Action",
        },
        tokens: [
          "--cui-button-outline-border",
          "--cui-button-outline-hover-bg",
        ],
        accessibility: ["WCAG AA", "Keyboard Navigation", "Focus Management"],
      },
      {
        name: "Ghost",
        description: "Subtle actions with minimal visual weight",
        props: {
          variant: "ghost",
        },
        slots: {
          default: "Ghost Action",
        },
        tokens: ["--cui-surface-default-hover"],
        accessibility: ["WCAG AA", "Keyboard Navigation", "Focus Management"],
      },
    ],
  },

  {
    title: "Button Sizes",
    description: "Consistent sizing using design system tokens",
    component: MyButton,
    variants: [
      {
        name: "Small",
        description: "Compact button for dense layouts",
        props: {
          variant: "primary",
          size: "sm",
        },
        slots: {
          default: "Small Button",
        },
        tokens: ["--ds-button-height-sm", "--ds-button-font-size-sm"],
        accessibility: ["Minimum 44px touch target (met via padding)"],
      },
      {
        name: "Medium",
        description: "Default button size for most use cases",
        props: {
          variant: "primary",
          size: "md",
        },
        slots: {
          default: "Medium Button",
        },
        tokens: ["--ds-button-height-md", "--ds-button-font-size-md"],
        accessibility: ["44px touch target", "Optimal readability"],
      },
      {
        name: "Large",
        description: "Prominent button for hero actions",
        props: {
          variant: "primary",
          size: "lg",
        },
        slots: {
          default: "Large Button",
        },
        tokens: ["--ds-button-height-lg", "--ds-button-font-size-lg"],
        accessibility: ["Generous touch target", "Enhanced visibility"],
      },
    ],
  },

  {
    title: "Button States",
    description: "Interactive and loading states with proper accessibility",
    component: MyButton,
    variants: [
      {
        name: "Normal",
        description: "Default interactive state",
        props: {
          variant: "primary",
        },
        slots: {
          default: "Normal Button",
        },
        accessibility: ["Keyboard focusable", "Click handlers"],
      },
      {
        name: "Disabled",
        description: "Non-interactive state",
        props: {
          variant: "primary",
          disabled: true,
        },
        slots: {
          default: "Disabled Button",
        },
        accessibility: [
          "Not focusable",
          "Reduced opacity",
          "cursor: not-allowed",
        ],
      },
      {
        name: "Loading",
        description: "Processing state with spinner",
        props: {
          variant: "primary",
          loading: true,
        },
        slots: {
          default: "Loading Button",
        },
        accessibility: [
          "Maintains focus",
          "Loading indication",
          "cursor: wait",
        ],
      },
    ],
  },

  {
    title: "🎯 Composition Examples",
    description:
      "MyBadge nested inside MyButton with proper accessibility and auto-sizing",
    component: MyButton,
    variants: [
      {
        name: "Button with Info Badge",
        description: "Notification button with badge count (decorative)",
        props: {
          variant: "primary",
          size: "md",
        },
        // This would be the actual Vue template in a real story
        template: `
          <MyButton variant="primary" size="md">
            <MyBadge variant="info" decorative>3</MyBadge>
            Notifications
          </MyButton>
        `,
        accessibility: [
          "Badge is aria-hidden (decorative)",
          'Screen reader announces: "Notifications button"',
          "Badge count is visual-only enhancement",
        ],
        composition: [
          "Badge auto-sizes to complement button",
          "Proper spacing via --ds-badge-gap-from-text",
          "Vertical centering via flexbox",
        ],
      },
      {
        name: "Button with Success Badge",
        description: "Action button with success indicator",
        props: {
          variant: "secondary",
          size: "lg",
        },
        template: `
          <MyButton variant="secondary" size="lg">
            Messages
            <MyBadge variant="success">2</MyBadge>
          </MyButton>
        `,
        accessibility: [
          "Badge is decorative in button context",
          "Focus management preserved",
          "Keyboard navigation unaffected",
        ],
      },
      {
        name: "Button with Warning Badge",
        description: "Alert button with warning count",
        props: {
          variant: "ghost",
          size: "sm",
        },
        template: `
          <MyButton variant="ghost" size="sm">
            <MyBadge variant="warning">!</MyBadge>
            Alerts
          </MyButton>
        `,
        accessibility: [
          "Warning badge provides visual emphasis",
          "Button remains primary interaction target",
          "Compact size maintains readability",
        ],
      },
    ],
  },

  {
    title: "Standalone Badge Examples",
    description: "MyBadge used independently with full accessibility",
    component: MyBadge,
    variants: [
      {
        name: "Status Badges",
        description: "Independent status indicators",
        variants: [
          {
            name: "Info Badge",
            props: { variant: "info", value: "New" },
            accessibility: [
              "Screen reader announces content",
              "Proper semantic meaning",
            ],
          },
          {
            name: "Success Badge",
            props: { variant: "success", value: "Complete" },
            accessibility: [
              "Success indication",
              "Color + text for accessibility",
            ],
          },
          {
            name: "Warning Badge",
            props: { variant: "warning", value: "Pending" },
            accessibility: ["Warning indication", "WCAG compliant contrast"],
          },
          {
            name: "Error Badge",
            props: { variant: "error", value: "Failed" },
            accessibility: ["Error indication", "High contrast for visibility"],
          },
        ],
      },
    ],
  },
];

/**
 * WRAPPER PATTERN DOCUMENTATION:
 *
 * This story file demonstrates the key benefits of our wrapper approach:
 *
 * 1. **API Stability**: Our public API (variant, size) is independent of Volt's internal API
 * 2. **Brand Consistency**: All styling comes from design tokens, not hardcoded values
 * 3. **Composition Support**: Components work together seamlessly with proper accessibility
 * 4. **Future-Proofing**: Volt updates won't break our component interfaces
 *
 * EXTENDING THIS PATTERN:
 *
 * For each new Volt component you want to wrap:
 * 1. Define semantic API (variants, sizes, states)
 * 2. Map to design tokens, never hardcode styles
 * 3. Preserve Volt's accessibility features
 * 4. Add composition behavior as needed
 * 5. Document with comprehensive stories
 *
 * REAL IMPLEMENTATION NOTES:
 *
 * In an actual Storybook setup, the template strings above would be
 * rendered as live Vue components. This file shows the data structure
 * that would drive those stories.
 */

export default myButtonStories;
