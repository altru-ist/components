<script setup lang="ts">
/**
 * DataTable
 *
 * Powerful data table for displaying tabular data with sorting, pagination, row selection,
 * and custom column rendering. Supports both array-based columns and slot customization.
 */

import { computed } from "vue";
import DataTable from "../volt/VoltDataTable.vue";
import Column from "./datatable/Column.vue";

type ColumnDefinition = {
  /**
   * @description Field property of the column
   */
  field: string;

  /**
   * @description Header text of the column
   */
  header: string;

  /**
   * @description Whether the column is sortable
   */
  sortable?: boolean;

  /**
   * @description CSS style to apply to the column
   */
  style?: string;

  /**
   * @description Whether this column displays the built-in expand/collapse button
   */
  expander?: boolean;
};

export interface CuiDataTableProps {
  /**
   * @description The array of objects to display in the table
   */
  value: any[];

  /**
   * @description Column definitions array (alternative to using Column components)
   */
  columns?: ColumnDefinition[];

  /**
   * @description Whether to enable pagination
   */
  paginator?: boolean;

  /**
   * @description Number of rows to display per page when pagination is enabled
   */
  rows?: number;

  /**
   * @description Whether to enable row selection
   */
  selectionMode?: "single" | "multiple" | undefined;

  /**
   * @description Selected row(s)
   */
  modelValue?: any | any[];

  /**
   * @description CSS class for the table
   */
  tableClass?: string;

  /**
   * @description Whether to show grid lines
   */
  showGridlines?: boolean;

  /**
   * @description Whether to enable sorting
   */
  sortable?: boolean;

  /**
   * @description Whether to enable striped rows
   */
  stripedRows?: boolean;

  /**
   * @description Whether to enable row hover effect
   */
  rowHover?: boolean;

  /**
   * @description Whether table is currently loading data
   */
  loading?: boolean;

  /**
   * @description Function to determine row class based on data
   */
  rowClass?: (data: any) => string | string[] | object;

  /**
   * @description Unique identifier field for each row. Required for row expansion functionality.
   */
  dataKey?: string;

  /**
   * @description Object tracking expanded rows by dataKey. Use with v-model:expandedRows for two-way binding.
   */
  expandedRows?: Record<string, boolean>;
}

const props = withDefaults(defineProps<CuiDataTableProps>(), {
  value: () => [],
  columns: undefined,
  paginator: false,
  rows: 10,
  selectionMode: undefined,
  modelValue: undefined,
  tableClass: "",
  showGridlines: false,
  sortable: false,
  stripedRows: false,
  rowHover: false,
  loading: false,
  rowClass: undefined,
  dataKey: undefined,
  expandedRows: undefined,
});

defineSlots<{
  /**
   * @description Default slot for custom content
   */
  default?: void;

  /**
   * @description Custom header content
   */
  header?: void;

  /**
   * @description Custom footer content
   */
  footer?: void;

  /**
   * @description Custom empty message when no records are found
   */
  empty?: void;

  /**
   * @description Custom loading content
   */
  loading?: void;

  /**
   * @description Slot for expanded row content. Native PrimeVue expansion slot.
   * @arg {object} slotProps - The slot properties
   * @arg {any} slotProps.data - The row data object
   * @arg {number} slotProps.index - The index of the row
   */
  expansion?: (props: { data: any; index: number }) => any;
}>();

const emit = defineEmits<{
  /**
   * Emitted when the selected row(s) change (for v-model support)
   * @arg {any | any[]} value - The selected row data. Single object for single selection mode, array of objects for multiple selection mode
   */
  "update:modelValue": [value: any | any[]];

  /**
   * Emitted when the expanded rows change (for v-model:expandedRows support)
   * @arg {Record<string, boolean>} value - Object tracking expanded rows by dataKey
   */
  "update:expandedRows": [value: Record<string, boolean>];

  /**
   * Emitted when a row is selected by the user
   * @arg {object} event - The row selection event object
   * @arg {any} event.data - The data object of the selected row
   * @arg {number} event.index - The index of the selected row in the data array
   * @arg {Event} event.originalEvent - The original browser event that triggered the selection
   */
  rowSelect: [event: any];

  /**
   * Emitted when a row is deselected by the user
   * @arg {object} event - The row unselect event object
   * @arg {any} event.data - The data object of the deselected row
   * @arg {number} event.index - The index of the deselected row in the data array
   * @arg {Event} event.originalEvent - The original browser event that triggered the deselection
   */
  rowUnselect: [event: any];

  /**
   * Emitted when the user navigates to a different page in paginated mode
   * @arg {object} event - The pagination event object
   * @arg {number} event.page - The zero-based index of the new page
   * @arg {number} event.first - The index of the first row on the new page
   * @arg {number} event.rows - The number of rows per page
   * @arg {number} event.pageCount - The total number of pages available
   */
  page: [event: any];

  /**
   * Emitted when a sortable column header is clicked to change the sort order
   * @arg {object} event - The sort event object
   * @arg {string} event.sortField - The field name being sorted
   * @arg {number} event.sortOrder - The sort direction (1 for ascending, -1 for descending)
   * @arg {any[]} event.multiSortMeta - Array of sort metadata for multi-column sorting (if enabled)
   */
  sort: [event: any];
}>();

const selectedRows = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const expandedRowsModel = computed({
  get: () => props.expandedRows,
  set: (value) => emit("update:expandedRows", value as Record<string, boolean>),
});

function onRowSelect(event: any) {
  emit("rowSelect", event);
}

function onRowUnselect(event: any) {
  emit("rowUnselect", event);
}

function onPage(event: any) {
  emit("page", event);
}

function onSort(event: any) {
  emit("sort", event);
}
</script>

<template>
  <DataTable
    v-model:selection="selectedRows"
    v-model:expanded-rows="expandedRowsModel"
    :value="value"
    :paginator="paginator"
    :rows="rows"
    :selection-mode="selectionMode"
    :striped-rows="stripedRows"
    :show-gridlines="showGridlines"
    :row-hover="rowHover"
    :loading="loading"
    :data-key="dataKey"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
    @page="onPage"
    @sort="onSort"
  >
    <template v-if="columns">
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
        :style="col.style"
        :expander="col.expander"
      ></Column>
    </template>

    <template v-if="$slots.header" #header>
      <slot name="header"></slot>
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>

    <template v-if="$slots.empty" #empty>
      <slot name="empty"></slot>
    </template>

    <template v-if="$slots.loading" #loading>
      <slot name="loading"></slot>
    </template>

    <template v-if="$slots.expansion" #expansion="slotProps">
      <slot name="expansion" :data="slotProps.data" :index="slotProps.index"></slot>
    </template>

    <slot></slot>
  </DataTable>
</template>
