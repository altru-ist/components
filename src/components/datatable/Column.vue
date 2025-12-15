<script lang="ts">
/**
 * Column - DataTable column component
 *
 * Re-export of PrimeVue's Column component that defines the structure and behavior
 * of table columns. Use this with the DataTable component to create custom column layouts
 * with sorting, filtering, and custom cell rendering capabilities.
 *
 * @example
 * <DataTable :value="products">
 *   <Column field="code" header="Code" sortable></Column>
 *   <Column field="name" header="Name"></Column>
 *   <Column field="price" header="Price">
 *     <template #body="slotProps">
 *       ${{ slotProps.data.price }}
 *     </template>
 *   </Column>
 * </DataTable>
 */

import PrimeColumn from "primevue/column";

export interface ColumnProps {
  /**
   * Property name or getter function to retrieve the cell value
   */
  field?: string | ((data: any) => any);

  /**
   * Header text of the column
   */
  header?: string;

  /**
   * Whether this column is sortable
   * @default false
   */
  sortable?: boolean;

  /**
   * Inline style object to apply to the column
   */
  style?: object | string;

  /**
   * CSS class name(s) to apply to the column
   */
  class?: string;

  /**
   * Inline style object for the column header
   */
  headerStyle?: object | string;

  /**
   * CSS class name(s) for the column header
   */
  headerClass?: string;

  /**
   * Inline style object for the column body cells
   */
  bodyStyle?: object | string;

  /**
   * CSS class name(s) for the column body cells
   */
  bodyClass?: string | ((data: any) => object);

  /**
   * Inline style object for the column footer
   */
  footerStyle?: object | string;

  /**
   * CSS class name(s) for the column footer
   */
  footerClass?: string;

  /**
   * Whether to display the column
   * @default true
   */
  hidden?: boolean;

  /**
   * Number of columns to span
   */
  colspan?: number;

  /**
   * Number of rows to span
   */
  rowspan?: number;

  /**
   * Defines column based sort order
   */
  sortField?: string;

  /**
   * When enabled, column displays a filter element
   * @default false
   */
  filter?: boolean;

  /**
   * Type of filter to use for this column
   */
  filterMatchMode?: string;

  /**
   * Whether the column is frozen
   * @default false
   */
  frozen?: boolean;

  /**
   * Position of a frozen column, valid values are left and right
   */
  alignFrozen?: "left" | "right";

  /**
   * Whether the column is included during data export
   * @default true
   */
  exportable?: boolean;

  /**
   * Custom export header text
   */
  exportHeader?: string;

  /**
   * Text alignment within cells
   */
  align?: "left" | "center" | "right";

  /**
   * Defines if a column can be reordered with drag and drop
   * @default true
   */
  reorderable?: boolean;
}

/**
 * Slots definition for documentation purposes
 */
export interface ColumnSlots {
  /**
   * Custom content for the column header
   * @arg {object} slotProps - The header slot properties
   * @arg {any} slotProps.column - The column component instance
   */
  header?: (props: { column: any }) => any;

  /**
   * Custom content for the column body cells
   * @arg {object} slotProps - The body slot properties
   * @arg {any} slotProps.data - The row data object
   * @arg {any} slotProps.column - The column component instance
   * @arg {any} slotProps.field - The field value for this cell
   * @arg {number} slotProps.index - The row index
   * @arg {boolean} slotProps.frozenRow - Whether this row is frozen
   * @arg {any} slotProps.editorInitCallback - Callback to initialize inline editing
   */
  body?: (props: {
    data: any;
    column: any;
    field: any;
    index: number;
    frozenRow: boolean;
    editorInitCallback?: any;
  }) => any;

  /**
   * Custom content for the column footer
   * @arg {object} slotProps - The footer slot properties
   * @arg {any} slotProps.column - The column component instance
   */
  footer?: (props: { column: any }) => any;

  /**
   * Custom content for the filter element
   * @arg {object} slotProps - The filter slot properties
   * @arg {any} slotProps.field - The field being filtered
   * @arg {any} slotProps.filterModel - The filter model object
   * @arg {Function} slotProps.filterCallback - Callback to apply filter
   */
  filter?: (props: {
    field: any;
    filterModel: any;
    filterCallback: Function;
  }) => any;

  /**
   * Custom content for the filter header
   */
  filterheader?: () => any;

  /**
   * Custom content for the filter footer
   */
  filterfooter?: () => any;

  /**
   * Custom content for filter clear button
   * @arg {object} slotProps - The clear filter slot properties
   * @arg {Function} slotProps.filterCallback - Callback to clear the filter
   */
  filterclear?: (props: { filterCallback: Function }) => any;

  /**
   * Custom content for filter apply button
   * @arg {object} slotProps - The apply filter slot properties
   * @arg {Function} slotProps.filterCallback - Callback to apply the filter
   */
  filterapply?: (props: { filterCallback: Function }) => any;

  /**
   * Custom content for the inline cell editor
   * @arg {object} slotProps - The editor slot properties
   * @arg {any} slotProps.data - The row data object
   * @arg {any} slotProps.column - The column component instance
   * @arg {any} slotProps.field - The field being edited
   * @arg {number} slotProps.index - The row index
   * @arg {Function} slotProps.editorSaveCallback - Callback to save edited value
   * @arg {Function} slotProps.editorCancelCallback - Callback to cancel editing
   */
  editor?: (props: {
    data: any;
    column: any;
    field: any;
    index: number;
    editorSaveCallback: Function;
    editorCancelCallback: Function;
  }) => any;
}

// Re-export PrimeVue Column directly to maintain compatibility with PrimeVue's DataTable
export default PrimeColumn;
</script>
