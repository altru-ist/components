<template>
  <div class="relative w-full">
    <CuiTextInput
      ref="inputRef"
      :modelValue="modelValue"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="invalid"
      :error="error"
      :size="size"
      :left-icon="'search'"
      v-bind="$attrs"
      @update:modelValue="handleModelValueUpdate"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

    <!-- Clear button overlay -->
    <button
      v-if="clearable && modelValue"
      class="absolute top-1/2 -translate-y-1/2 text-cui-text-subtitle-caption bg-transparent border-none cursor-pointer z-10 text-xl w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-cui-surface-subtle hover:text-cui-text-header-body disabled:opacity-50 disabled:cursor-not-allowed material-symbols-rounded"
      :class="label ? 'right-3 top-[calc(50%+0.875rem)]' : 'right-3'"
      type="button"
      @click="handleClear"
      :disabled="disabled"
    >
      close
    </button>

    <!-- Manual dropdown for suggestions -->
    <div
      v-if="showSuggestions && filteredSuggestions.length > 0"
      class="absolute left-0 right-0 z-1000 mt-1 bg-white border border-cui-border-neutral rounded-md shadow-md max-h-48 overflow-auto"
      :class="label ? 'top-[calc(100%)]' : 'top-full'"
    >
      <div
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        class="px-3 py-2 cursor-pointer text-cui-text-header-body border-none bg-transparent transition-colors duration-200 hover:bg-cui-surface-subtle active:bg-cui-surface-elevated"
        :class="{ 'suggestion-highlighted': index === highlightedIndex }"
        @click="selectSuggestion(suggestion)"
        @mouseenter="highlightedIndex = index"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SearchBar
 *
 * Autocomplete search input with filtering and suggestions. Wrapped with InputWrapper
 * for consistent styling and supports custom option templates.
 */

import { computed, ref, type ComponentPublicInstance } from "vue";
import CuiTextInput from "./CuiTextInput.vue";

// Component API
export interface CuiSearchBarProps {
  /** The search value (for v-model) */
  modelValue?: string;
  /** Label text for the search bar */
  label?: string;
  /** Search suggestions array */
  suggestions?: string[];
  /** Placeholder text */
  placeholder?: string;
  /** Search bar size */
  size?: "medium" | "large";
  /** Minimum characters before triggering search */
  minLength?: number;
  /** Delay in milliseconds before triggering search */
  delay?: number;
  /** Whether the search bar is disabled */
  disabled?: boolean;
  /** Whether the search bar is readonly */
  readonly?: boolean;
  /** Whether the search bar has an error state */
  invalid?: boolean;
  /** Error message for validation feedback */
  error?: string;
  /** Whether to show clear button */
  clearable?: boolean;
}

const props = withDefaults(defineProps<CuiSearchBarProps>(), {
  size: "medium",
  minLength: 1,
  delay: 300,
  disabled: false,
  readonly: false,
  invalid: false,
  clearable: false,
  placeholder: "Search...",
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Custom suggestion slot for rendering individual suggestions
   * @arg {object} slotProps - The suggestion slot properties
   * @arg {any} slotProps.suggestion - The suggestion object being rendered
   * @arg {number} slotProps.index - The index of the suggestion in the list
   */
  suggestion?: (props: { suggestion: any; index: number }) => any;
}>();

/**
 * Manual autocomplete implementation
 */
const emit = defineEmits<{
  /**
   * Emitted when the search value changes (for v-model support)
   * @arg {string} value - The new search value
   */
  "update:modelValue": [value: string];

  /**
   * Emitted when autocomplete suggestions are requested
   * @arg {object} payload - The complete event payload
   * @arg {Event} payload.originalEvent - The original input event
   * @arg {string} payload.query - The search query string
   */
  complete: [payload: { originalEvent: Event; query: string }];

  /**
   * Emitted when the search input receives focus
   * @arg {FocusEvent} event - The native focus event
   */
  focus: [event: FocusEvent];

  /**
   * Emitted when the search input loses focus
   * @arg {FocusEvent} event - The native blur event
   */
  blur: [event: FocusEvent];

  /**
   * Emitted when the user types in the search input
   * @arg {Event} event - The native input event
   */
  input: [event: Event];

  /**
   * Emitted when the search value changes via selection
   * @arg {object} payload - The change event payload
   * @arg {string} payload.value - The selected value
   */
  change: [payload: { value: string }];
}>();

const inputRef = ref<ComponentPublicInstance<typeof CuiTextInput>>();
const showSuggestions = ref(false);
const highlightedIndex = ref(-1);
const searchTimeout = ref<number>();

const filteredSuggestions = computed(() => {
  if (
    !props.modelValue ||
    !props.suggestions ||
    typeof props.modelValue !== "string"
  )
    return [];

  const query = props.modelValue.toLowerCase();
  return props.suggestions
    .filter((suggestion) => suggestion.toLowerCase().includes(query))
    .slice(0, 10); // Limit to 10 suggestions
});

const handleModelValueUpdate = (value: string | undefined = "") => {
  // Emit the value update for v-model
  emit("update:modelValue", value);

  // Clear existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Show suggestions after delay
  if (value.length >= props.minLength) {
    searchTimeout.value = setTimeout(() => {
      showSuggestions.value = true;
      highlightedIndex.value = -1;
    }, props.delay) as unknown as number;
  } else {
    showSuggestions.value = false;
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  // Emit input event for tracking
  emit("input", event);

  // Emit complete event for autocomplete functionality
  if (value.length >= props.minLength) {
    emit("complete", { originalEvent: event, query: value });
  }
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
  if (
    props.modelValue &&
    typeof props.modelValue === "string" &&
    props.modelValue.length >= props.minLength
  ) {
    showSuggestions.value = true;
  }
};

const handleBlur = (event: FocusEvent) => {
  // Delay hiding suggestions to allow for clicks
  setTimeout(() => {
    showSuggestions.value = false;
    highlightedIndex.value = -1;
  }, 150);
  emit("blur", event);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || !filteredSuggestions.value?.length) return;
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.stopImmediatePropagation();
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredSuggestions.value.length - 1,
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.stopImmediatePropagation();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.stopImmediatePropagation();
      if (highlightedIndex.value >= 0) {
        const selectedSuggestion =
          filteredSuggestions.value[highlightedIndex.value];
        if (selectedSuggestion) {
          selectSuggestion(selectedSuggestion);
        }
      }
      break;
    case "Escape":
      showSuggestions.value = false;
      highlightedIndex.value = -1;
      break;
  }
};

const selectSuggestion = (suggestion: string) => {
  emit("update:modelValue", suggestion);
  emit("change", { value: suggestion });
  showSuggestions.value = false;
  highlightedIndex.value = -1;
  // Focus the input element inside CuiTextInput
  const textInputEl = inputRef.value?.$el?.querySelector("input");
  if (textInputEl) {
    textInputEl.focus();
  }
};

const handleClear = () => {
  emit("update:modelValue", "");
  showSuggestions.value = false;
  highlightedIndex.value = -1;
  // Focus the input element inside CuiTextInput
  const textInputEl = inputRef.value?.$el?.querySelector("input");
  if (textInputEl) {
    textInputEl.focus();
  }
};
</script>

<style scoped>
/* Highlighted suggestion state */
.suggestion-highlighted {
  background: var(--cui-surface-subtle) !important;
}
</style>
