# DataTable Column Component

A re-export of PrimeVue's Column component that provides convenient import paths, TypeScript support, and comprehensive JSDoc documentation.

## Usage

### Basic Column Definition

```vue
<script setup>
import { DataTable, Column } from "@ist/commonui-components";

const products = ref([
  { code: "P001", name: "Product 1", price: 29.99 },
  { code: "P002", name: "Product 2", price: 49.99 },
]);
</script>

<template>
  <DataTable :value="products">
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="price" header="Price"></Column>
  </DataTable>
</template>
```

### Sortable Columns

```vue
<template>
  <DataTable :value="products">
    <Column field="code" header="Code" sortable></Column>
    <Column field="name" header="Name" sortable></Column>
    <Column field="price" header="Price" sortable></Column>
  </DataTable>
</template>
```

### Custom Cell Content

```vue
<script setup>
import { DataTable, Column, Badge } from "@ist/commonui-components";
</script>

<template>
  <DataTable :value="products">
    <Column field="name" header="Product Name"></Column>

    <Column field="status" header="Status">
      <template #body="slotProps">
        <Badge
          :label="slotProps.data.status"
          :severity="
            slotProps.data.status === 'In Stock' ? 'success' : 'danger'
          "
        />
      </template>
    </Column>

    <Column header="Actions">
      <template #body="slotProps">
        <Button size="small" @click="edit(slotProps.data)">Edit</Button>
      </template>
    </Column>
  </DataTable>
</template>
```

### Frozen Columns

```vue
<template>
  <DataTable :value="products">
    <Column field="code" header="Code" frozen></Column>
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="price" header="Price" frozen align-frozen="right"></Column>
  </DataTable>
</template>
```

### Column Styling

```vue
<template>
  <DataTable :value="products">
    <Column
      field="code"
      header="Code"
      header-style="background-color: var(--cui-surface-elevated)"
      body-class="font-bold"
    ></Column>

    <Column
      field="price"
      header="Price"
      align="right"
      :body-style="{ color: 'var(--cui-text-success)' }"
    ></Column>
  </DataTable>
</template>
```

## Import Aliases

The Column component can be imported using several aliases:

```typescript
// Standard import
import { Column } from "@ist/commonui-components";

// With DataTable prefix
import { DataTableColumn } from "@ist/commonui-components";

// With Cui prefix
import { CuiColumn, CuiDataTableColumn } from "@ist/commonui-components";
```

## Props

See the component JSDoc for complete prop documentation. Key props include:

- `field` - Property name to retrieve cell value
- `header` - Header text
- `sortable` - Enable column sorting
- `frozen` - Freeze column in place
- `align` - Text alignment ('left' | 'center' | 'right')
- `hidden` - Hide column
- `exportable` - Include in data export

## Slots

- `header` - Custom header content
- `body` - Custom cell content
- `footer` - Custom footer content
- `filter` - Custom filter element
- `editor` - Custom inline editor

## Migration from PrimeVue

If you're currently importing from PrimeVue:

```typescript
// Old
import Column from "primevue/column";

// New
import { Column } from "@ist/commonui-components";
```

The API is identical to PrimeVue's Column, but you now get:

- ✅ Convenient import from design system package
- ✅ Better TypeScript support with exported types
- ✅ Comprehensive JSDoc documentation
- ✅ Consistent with other design system components
- ✅ Single import source for all DataTable components
- ✅ 100% compatibility with PrimeVue's DataTable
