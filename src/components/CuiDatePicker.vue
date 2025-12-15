<script setup lang="ts">
/**
 * DatePicker
 *
 * Comprehensive date picker wrapped with InputWrapper for consistent styling. Supports inline
 * and popup modes, date ranges, validation, disabled dates, localization, and custom formatting.
 */

import type { DatePickerDateSlotOptions } from "primevue/datepicker";
import { computed, ref, useSlots, watch } from "vue";
import { getDatePattern } from "../utils/dateUtils";
import Datepicker from "../volt/VoltDatePicker.vue";
import CuiInputWrapper from "./CuiInputWrapper.vue";

type DateFormatOptions = {
  day?: "2-digit" | "numeric";
  month?: "2-digit" | "numeric" | "short" | "long";
  year?: "2-digit" | "numeric";
};

export interface CuiDatePickerProps {
  /**
   * Help text displayed below the date picker field
   * Provides additional context or instructions to the user
   */
  assistiveText?: string;

  /**
   * Whether the date picker is disabled
   * When disabled, user cannot interact with the component
   */
  disabled?: boolean;

  /**
   * Whether the date picker is readonly
   * When readonly, user can view but not modify the value
   */
  readonly?: boolean;

  /**
   * Unique identifier for the date picker
   */
  id?: string;

  /**
   * Custom instructions for screen readers
   * Overrides the default instructions when provided
   */
  instructions?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Size variant for the date picker
   */
  size?: "medium" | "large";

  /**
   * Whether to show default instructions for screen readers
   */
  showInstructions?: boolean;

  /**
   * Format options for displaying the date
   * Controls how day, month, and year are formatted
   */
  formatOptions?: DateFormatOptions;

  /**
   * The selected date value (v-model support)
   * Can be a Date object, array of dates (for multiple/range modes), or undefined
   */
  modelValue: Date | Date[] | undefined;

  /**
   * Whether to show the calendar inline instead of as a dropdown
   * Inline mode displays the calendar directly in the layout
   */
  inline?: boolean;

  /**
   * Label text displayed above the date picker input
   * Describes the purpose of the date picker to the user
   */
  label?: string;

  /**
   * Application layer to append the floater to
   * Leave empty if floater is inline or uses default positioning
   */
  layer?: HTMLDivElement | null;

  /**
   * Whether the date picker should display a loading spinner
   * Useful when fetching available dates or processing selections
   */
  loading?: boolean;

  /**
   * Locale for date formatting and display
   * Uses standard locale codes (e.g., 'en-US', 'de-DE')
   * @default 'en-US'
   */
  locale?: string;

  /**
   * Minimum selectable date
   * Dates before this will be disabled in the calendar
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   * Dates after this will be disabled in the calendar
   */
  maxDate?: Date;

  /**
   * Selection mode for date picking
   * - 'single': Select a single date (default)
   * - 'multiple': Select multiple dates
   * - 'range': Select a date range (start and end date)
   * @default 'single'
   */
  selectionMode?: "single" | "multiple" | "range";

  /**
   * Whether to display time picker alongside the date picker
   * Allows selection of hours, minutes, and optionally seconds
   * @default false
   */
  showTime?: boolean;

  /**
   * Whether to display week numbers in the calendar
   * Shows ISO week numbers in the leftmost column
   * @default true
   */
  showWeek?: boolean;

  /**
   * Array of dates that should be disabled/unavailable for selection
   * Users cannot select these dates
   */
  unavailableDates?: Date[];

  /**
   * Error message displayed when validation fails
   * Shown when an invalid or unavailable date is selected
   */
  validationFailText?: string;

  /**
   * Accessible label describing the date picker for screen readers
   * Required for WCAG compliance
   */
  wcagLabel: string;
}

const props = withDefaults(defineProps<CuiDatePickerProps>(), {
  assistiveText: "",
  disabled: false,
  readonly: false,
  formatOptions: () => ({}),
  inline: false,
  label: "",
  layer: null,
  loading: false,
  unavailableDates: () => [],
  validationFailText: "",
  locale: "en-US",
  selectionMode: "single",
  showTime: false,
  showWeek: true,
  size: "medium",
  showInstructions: false,
});

const model = defineModel<CuiDatePickerProps["modelValue"]>();

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Custom date slot for rendering individual dates in the calendar
   * @arg {object} slotProps - The date slot properties
   * @arg {object} slotProps.date - The date information object
   * @arg {number} slotProps.date.day - The day number (1-31)
   * @arg {number} slotProps.date.month - The month (0-11)
   * @arg {number} slotProps.date.year - The year
   * @arg {boolean} slotProps.date.today - Whether this date is today
   * @arg {boolean} slotProps.date.selectable - Whether this date is selectable
   */
  date?: (props: { date: DatePickerDateSlotOptions }) => any;
}>();

const emit = defineEmits<{
  /**
   * Emitted when a date is selected
   * @arg {Date | null} date - The selected date (null if cleared)
   * @arg {boolean} isInvalid - Whether the selected date is invalid
   */
  select: [date: Date | null, isInvalid: boolean];
}>();

if (props.wcagLabel === undefined) {
  throw new Error("CuiDatePicker: wcagLabel is required");
}

const datepicker = ref();
const isValidDate = ref<boolean>(true);
const hasValidated = ref<boolean>(false);

// Watch for model value changes to reset validation when cleared
watch(
  () => props.modelValue,
  (newValue: Date | Date[] | undefined) => {
    if (!newValue || (Array.isArray(newValue) && newValue.length === 0)) {
      hasValidated.value = false;
      isValidDate.value = true;
    }
  },
);

const placeholder = computed(() => {
  return getDatePattern(props.locale);
});

const dateFormat = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat(
    props.locale,
    options,
  ).formatToParts();
  const d = formatter
    .map(function (e) {
      switch (e.type) {
        case "month":
          return "mm";

        case "day":
          return "dd";

        case "year":
          return "yy";

        default:
          return e.value;
      }
    })
    .join("");
  return d;
});

const isDatePickerVisible = computed(() => {
  return datepicker.value?.overlayVisible;
});

const slots = useSlots();
const slotNames = computed((): string[] => Object.keys(slots));

const disabledDates = computed(() => props.unavailableDates || []);

function handleDateSelect(value: Date) {
  const isInvalid = props.unavailableDates.some(
    (date) => date.getTime() === value.getTime(),
  );

  // Update validation state
  hasValidated.value = true;
  isValidDate.value = !isInvalid;

  emit("select", value, isInvalid);
}

defineExpose({
  /**
   * Whether the Datepicker is visible.
   * @returns {boolean}
   */
  isDatePickerVisible,
});
</script>

<template>
  <CuiInputWrapper
    :id="id"
    :label="!inline ? label : undefined"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :error="
      hasValidated && !isValidDate && model ? validationFailText : undefined
    "
    :help-text="!inline ? assistiveText : undefined"
    :invalid="hasValidated && !isValidDate"
    :size="size"
    :instructions="instructions || wcagLabel"
    :show-instructions="showInstructions"
  >
    <template #default="{ id, ariaDescribedBy, ariaInvalid }">
      <Datepicker
        ref="datepicker"
        v-model="model"
        :id="id"
        :disabled="disabled"
        :inline="inline"
        :loading="loading"
        :locale="locale"
        :placeholder="placeholder"
        :disabled-dates="disabledDates"
        :min-date="minDate"
        :max-date="maxDate"
        :selection-mode="selectionMode"
        :date-format="dateFormat"
        :aria-label="wcagLabel"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        :show-time="showTime"
        :show-week="showWeek"
        :show-icon="!inline"
        class="w-full"
        :class="{
          'p-invalid': hasValidated && !isValidDate,
          'p-valid': hasValidated && isValidDate,
        }"
        @date-select="handleDateSelect"
      >
        <template v-if="slotNames.includes('date')" #date="{ date }">
          <slot name="date" v-bind="{ date }" />
        </template>
      </Datepicker>
    </template>
  </CuiInputWrapper>
</template>
