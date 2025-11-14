<template>
  <div
    class="relative block w-full"
    :class="{ 'select-none': variant === 'default' && interactive }"
  >
    <VoltCard
      unstyled
      :pt="cardTheme"
      :ptOptions="{ mergeProps: ptViewMerge }"
      :style="cardStyle"
      v-bind="$attrs"
      @click="handleCardClick"
      :tabindex="variant === 'default' && interactive ? 0 : undefined"
      :role="variant === 'default' && interactive ? 'button' : undefined"
      :aria-label="
        variant === 'default' && interactive ? interactiveLabel : undefined
      "
    >
      <!-- Default variant content -->
      <!-- Header only used for top images -->
      <template
        v-if="variant === 'default' && image && imagePosition === 'top'"
        #header
      >
        <div class="overflow-hidden p-0 m-0">
          <img
            :src="image"
            :alt="imageAlt"
            class="w-full h-full object-cover"
          />
        </div>
      </template>

      <template v-if="variant === 'default'" #content>
        <div
          class="flex gap-0"
          :class="{
            'flex-col': imagePosition === 'top',
            'flex-row items-stretch min-h-[300px]':
              imagePosition === 'left' || imagePosition === 'right',
          }"
        >
          <!-- Image container (only for side layouts) -->
          <div
            v-if="
              image && (imagePosition === 'left' || imagePosition === 'right')
            "
            class="overflow-hidden flex-shrink-0 w-[40%] min-w-[250px] self-stretch flex"
            :class="{
              'order-2': imagePosition === 'right',
            }"
          >
            <img
              :src="image"
              :alt="imageAlt"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Content container -->
          <div
            class="flex-1 flex flex-col justify-between gap-4"
            :class="{
              'order-1': imagePosition === 'right',
              'p-6': imagePosition === 'left' || imagePosition === 'right',
            }"
          >
            <div class="flex-1 flex flex-col gap-2">
              <h3
                v-if="title"
                class="m-0 text-xl font-semibold text-cui-text-header-body leading-normal"
              >
                {{ title }}
              </h3>
              <p
                v-if="subtitle"
                class="m-0 text-sm font-medium text-cui-text-subtitle-caption leading-normal"
              >
                {{ subtitle }}
              </p>
              <div
                v-if="text"
                class="m-0 text-base font-normal text-cui-text-header-body leading-normal"
              >
                {{ text }}
              </div>
              <slot name="content" />
              <slot />
            </div>

            <!-- Actions inside content area -->
            <div
              v-if="
                !interactive &&
                (primaryAction || secondaryAction || $slots.actions)
              "
              class="flex gap-2 justify-end items-center"
            >
              <slot name="actions">
                <CuiButton
                  v-if="secondaryAction"
                  variant="secondary-outline"
                  size="medium"
                  @click.stop="emit('secondary-action')"
                >
                  {{ secondaryAction }}
                </CuiButton>
                <CuiButton
                  v-if="primaryAction"
                  variant="primary"
                  size="medium"
                  @click.stop="emit('primary-action')"
                >
                  {{ primaryAction }}
                </CuiButton>
              </slot>
            </div>
          </div>
        </div>
      </template>

      <!-- Footer removed - actions now inside content area -->

      <!-- Custom variant content -->
      <template v-if="variant === 'custom'" #content>
        <div class="min-h-[200px]">
          <slot>
            <div
              class="flex flex-col items-center gap-2 text-cui-text-subtitle-caption text-center"
            >
              <span class="material-symbols-rounded text-3xl opacity-50"
                >add_box</span
              >
              <p class="m-0 text-base italic">Your custom content here</p>
            </div>
          </slot>
        </div>
      </template>
    </VoltCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Card
 *
 * Flexible container component with optional header, body, and footer sections.
 * Supports images, actions, and custom content layouts with interactive states.
 */

import { type CardPassThroughOptions } from "primevue/card";
import { computed } from "vue";
import { ptViewMerge } from "../volt/utils";
import VoltCard from "../volt/VoltCard.vue";
import CuiButton from "./CuiButton.vue";

// Design System API
interface Props {
  /** Visual variant of the card */
  variant?: "default" | "custom";
  /** Card title (default variant only) */
  title?: string;
  /** Card subtitle (default variant only) */
  subtitle?: string;
  /** Card body text (default variant only) */
  text?: string;
  /** Image source URL (default variant only) */
  image?: string;
  /** Alt text for image */
  imageAlt?: string;
  /** Image position relative to content */
  imagePosition?: "top" | "left" | "right";
  /** Primary action button text */
  primaryAction?: string;
  /** Secondary action button text */
  secondaryAction?: string;
  /** Whether the entire card is clickable (alternative to action buttons) */
  interactive?: boolean;
  /** Aria label for interactive cards */
  interactiveLabel?: string;
  /** Card elevation/shadow level */
  elevation?: "shadow" | "border";
  /** Enable gradient highlight background */
  gradientHighlight?: boolean;
  /** Gradient variant to use when gradientHighlight is enabled */
  gradientVariant?: "yellow-orange";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  imagePosition: "top",
  interactive: false,
  elevation: "shadow",
  gradientHighlight: false,
  gradientVariant: "yellow-orange",
});

// Define slots with JSDoc documentation
const slots = defineSlots<{
  /**
   * Default slot for custom content (custom variant only)
   * Used when variant is 'custom' to provide completely custom card content
   */
  default: () => any;

  /**
   * Content slot for additional content in the default variant
   * Rendered after the title, subtitle, and text but before actions
   */
  content: () => any;

  /**
   * Actions slot for custom action buttons
   * Replaces the default primary/secondary action buttons when provided
   */
  actions: () => any;
}>();

// Events we want to expose
const emit = defineEmits<{
  /**
   * Emitted when the primary action button is clicked
   */
  "primary-action": [];

  /**
   * Emitted when the secondary action button is clicked
   */
  "secondary-action": [];

  /**
   * Emitted when the card is clicked (only if interactive)
   * @arg {Event} event - The native click event
   */
  "card-click": [event: Event];
}>();

/**
 * Handle card click - only emit if interactive
 */
const handleCardClick = (event: Event) => {
  if (props.variant === "default" && props.interactive) {
    // Don't emit if click was on action buttons (they handle their own events)
    const target = event.target as HTMLElement;
    if (!target.closest(".card-actions")) {
      emit("card-click", event);
    }
  }
};

/**
 * Card theme configuration using our design tokens
 */
const cardTheme = computed<CardPassThroughOptions>(() => {
  // Base styles that apply to all cards
  const baseStyles = [
    // Layout
    ...(props.gradientHighlight
      ? [] // We'll handle gradient background in the style attribute
      : ["bg-white dark:bg-surface-900"]),
    "text-surface-900 dark:text-surface-100",
    "rounded-[var(--ds-radius-lg)]",
    "transition-all duration-[var(--ds-transition-normal)]",
    "overflow-hidden",

    // Focus styles for interactive cards
    ...(props.variant === "default" && props.interactive
      ? [
          "cursor-pointer",
          "focus:outline-none",
          "focus:ring-2 focus:ring-[var(--cui-border-focus)] focus:ring-offset-2",
          "hover:border-[var(--cui-border-neutral-default)]",
          "hover:shadow-[var(--ds-shadow-md)]",
        ]
      : []),
  ];

  // Elevation styles using design tokens
  const elevationStyles = {
    shadow: ["shadow-[var(--ds-shadow-lg)]"],
    border: [
      "border",
      "border-solid",
      "border-[var(--cui-border-neutral-subtle)]",
    ],
  };

  // Always use medium padding (p-6)
  const mediumPadding = "p-6";

  // Combine all styles
  const selectedElevationStyles =
    elevationStyles[props.elevation] || elevationStyles.shadow;
  const allStyles = [
    ...baseStyles,
    ...selectedElevationStyles,
    // Note: padding will be applied to specific sections, not root
  ].join(" ");

  return {
    root: allStyles,
    // Header styling (for top images only)
    header: "p-0 m-0",
    // Content styling (conditional padding based on layout)
    content: `${props.variant === "default" && props.image && (props.imagePosition === "left" || props.imagePosition === "right") ? "p-0" : mediumPadding} ${props.variant === "custom" ? "min-h-[200px]" : ""}`,
    // Footer styling (hidden - actions now in content)
    footer: "hidden",
  };
});

/**
 * Computed style for gradient background
 */
const cardStyle = computed(() => {
  if (props.gradientHighlight) {
    return {
      background: `var(--cui-surface-highlight-gradient-${props.gradientVariant})`,
    };
  }
  return {};
});
</script>

<style></style>
