# AI Agent Development Notes

This document provides guidelines and patterns for AI-assisted development sessions in the components library.

---

## Component Library Architecture

### Two-Layer Design System

The component library follows a two-layer architecture pattern:

#### 1. Volt Layer (`src/volt/`)

The Volt components are thin wrappers around PrimeVue components that apply design system theming via PrimeVue's PassThrough API.

**Responsibilities**:

- Wrap PrimeVue components with `unstyled` prop
- Apply Tailwind classes for theming via PassThrough options
- Handle design system color variants and states
- Provide consistent Material Symbols icon styling
- Forward all slots to underlying PrimeVue components

**Key Features**:

- Uses `ptViewMerge` utility for proper style merging
- Applies theme via `ref<PassThroughOptions>` objects
- Minimal logic - focused on theming only
- Accepts all PrimeVue component props via TypeScript interface extension

#### 2. Component Layer (`src/components/`)

The component layer provides the public API with simplified, typed interfaces and additional functionality.

**Responsibilities**:

- Wrap corresponding Volt components
- Define clean, typed props with JSDoc documentation
- Implement additional functionality (e.g., selection states, custom behaviors)
- Handle and transform events
- Apply conditional styling for custom states
- Document all props, events, and slots comprehensively

**Key Features**:

- TypeScript-first with full type safety
- Comprehensive JSDoc documentation for auto-generated docs
- Custom business logic and state management
- Event handling and v-model support
- Proper slot forwarding with type information

### Benefits of Two-Layer Approach

- **Separation of Concerns**: Theming (Volt) vs. API design (Components)
- **Flexibility**: Override Volt styles when needed for custom states
- **Maintainability**: PrimeVue updates isolated to Volt layer
- **Type Safety**: Component layer provides TypeScript types
- **Documentation**: JSDoc in component layer generates API docs

---

## Wrapper Pattern Guidelines

### Creating a New Component Wrapper

Follow this consistent pattern when creating new component wrappers:

#### 1. Component Structure Order

```vue
<script setup lang="ts">
// 1. Imports
import VoltComponentName from "../volt/VoltComponentName.vue";
import { ref } from "vue"; // Additional Vue imports if needed

// 2. Component description
/**
 * Brief description of component purpose
 */

// 3. Types/Interfaces
export interface CuiComponentProps {
  /**
   * @description Prop description
   */
  propName?: type;
};

// 4. Define props
const props = withDefaults(defineProps<CuiComponentProps>(), {
  propName: defaultValue,
});

// 5. Define emits (if needed)
const emit = defineEmits<{
  /**
   * Event description
   * @arg {type} paramName - Parameter description
   */
  eventName: [paramType];
}>();

// 6. Define slots (if needed)
const slots = defineSlots<{
  /**
   * Slot description
   * @arg {object} slotProps - The slot properties
   * @arg {type} slotProps.propName - Property description
   */
  slotName?: (props: { propName: type }) => any;
}>();

// 7. State variables (ref, reactive)
const stateVar = ref(initialValue);

// 8. Computed variables
const computedValue = computed(() => /* ... */);

// 9. Functions
const handleEvent = () => {
  // Implementation
};

// 10. Watchers (if needed)
watch(/* ... */);

// 11. Lifecycle hooks (if needed)
onMounted(() => {
  // Implementation
});
</script>

<template>
  <VoltComponentName v-bind="props" @event="handleEvent">
    <!-- Slot forwarding -->
    <template v-if="slots.slotName" #slotName="slotProps">
      <slot name="slotName" v-bind="slotProps" />
    </template>
  </VoltComponentName>
</template>
```

#### 2. Prop Documentation

All props must have:

- TypeScript type definition exported as `export interface CuiComponentProps`
- JSDoc `@description` comment
- Appropriate default value in `withDefaults()`
- Clear, concise description of purpose and behavior
- **Always export the props interface** so it can be imported by library consumers

**Example**:

```typescript
export interface CuiMessageProps {
  /**
   * @description Severity level that determines the message color scheme
   */
  severity?: "success" | "info" | "warn" | "error";
}
```

#### 3. Event Documentation

Events must use typed `defineEmits<{}>()` syntax with:

- Clear description of when event is emitted
- `@arg` tags for each parameter with type and description
- Additional context for complex payloads

Example:

```typescript
const emit = defineEmits<{
  /**
   * Emitted when the selected value changes (for v-model support)
   * @arg {any} value - The selected option value
   */
  "update:modelValue": [value: any];

  /**
   * Emitted when selection changes, providing both value and option details
   * @arg {object} payload - The change event payload
   * @arg {any} payload.value - The selected option value (null when cleared)
   * @arg {any} payload.option - The full option object (undefined when cleared)
   */
  change: [payload: { value: any; option?: any }];
}>();
```

#### 4. Slot Documentation

Slots must use typed `defineSlots<{}>()` syntax with:

- Clear description of slot purpose and when it's rendered
- `@arg` tags for each slot prop with type and description
- Usage examples for complex slot props
- Default content behavior when slot is not provided

Example:

```typescript
const slots = defineSlots<{
  /**
   * Default slot for the main content
   * @arg {object} slotProps - The slot properties
   * @arg {boolean} slotProps.isActive - Whether the item is currently active
   * @arg {string} slotProps.value - The current value
   */
  default?: (props: { isActive: boolean; value: string }) => any;

  /**
   * Header slot for custom header content
   * No slot props provided - pure content slot
   */
  header?: () => any;
}>();
```

#### 5. Slot Forwarding Pattern

Use this pattern to forward all slots to Volt components:

```vue
<template>
  <VoltComponent>
    <!-- Conditional slot forwarding -->
    <template v-if="slots.slotName" #slotName="slotProps">
      <slot name="slotName" v-bind="slotProps" />
    </template>

    <!-- Alternative: Forward all slots dynamically -->
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </VoltComponent>
</template>
```

---

## Development Workflow

### 1. Creating a New Component

**Steps**:

1. Ensure corresponding Volt component exists in `src/volt/`
2. Create component file in `src/components/` following naming convention
3. Implement wrapper following the pattern guidelines above
4. **Export props interface** from component file (`export interface CuiComponentProps`)
5. Add imports and exports to `src/main.ts` (component and props type)
6. Run linter and fix any errors
7. Run `npm run extract-vue-docs` to generate documentation
8. Test component functionality

### 2. Adding to Main Exports

Update `src/main.ts` with proper imports and exports:

```typescript
// Import component
import ComponentName from "./components/ComponentName.vue";

// Export component in three forms:
export {
  ComponentName, // Original name
  ComponentName as CuiComponentName, // Cui prefix alias
  // For Cui-prefixed components, also export without prefix
  CuiComponentName as ComponentName, // For CuiSelect -> Select
};

// Export component props types (always export properties)
export type { CuiComponentProps } from "./components/ComponentName.vue";
```

**Important**: Always export component props interfaces/types from both:

1. The component file itself (using `export interface CuiComponentProps`)
2. The main entry point (`src/main.ts`) for library consumers

### 3. Documentation Generation

After updating JSDoc comments:

```bash
npm run extract-vue-docs
```

This command:

- Parses JSDoc comments from components
- Updates the documentation site
- Generates API documentation
- Creates searchable component reference

### 4. Code Quality Checklist

Before completing a component:

**TypeScript Compliance**:

- ✅ No linter errors
- ✅ Full type safety with TypeScript
- ✅ Proper type definitions for props, events, and slots
- ✅ Props interface exported from component file (`export interface CuiComponentProps`)
- ✅ Props type exported from `main.ts` for library consumers

**Documentation Standards**:

- ✅ JSDoc comments for all props
- ✅ JSDoc comments for all events with `@arg` tags
- ✅ JSDoc comments for all slots with parameter details
- ✅ Component-level description comments

**Vue Best Practices**:

- ✅ Composition API with script setup syntax
- ✅ Proper defineProps/defineEmits/defineSlots usage
- ✅ TypeScript generic syntax
- ✅ Proper slot forwarding pattern
- ✅ Appropriate lifecycle hooks

---

## Common Patterns and Solutions

### 1. V-Model Support

Implement v-model by accepting `modelValue` prop and emitting `update:modelValue`:

```typescript
type Props = {
  modelValue?: boolean;
};

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const handleChange = (newValue: boolean) => {
  emit("update:modelValue", newValue);
};
```

### 2. Conditional Styling with Important Modifiers

When overriding Volt base styles conditionally, use `!` prefix:

```vue
<template>
  <VoltComponent
    :class="{
      '!bg-[var(--cui-surface-navigation)]': isSelected,
    }"
  />
</template>
```

### 3. Event Handling with Multiple Interactions

Handle conflicts between multiple interactions (e.g., selection + removal):

```typescript
const handleClick = (event: MouseEvent) => {
  if (props.selectable) {
    emit("update:modelValue", !props.modelValue);
  }
  // Don't interfere with removal click
};
```

### 4. Design System Integration

Use CSS custom properties for colors to maintain consistency:

```vue
<template>
  <div :style="{ color: 'var(--cui-text-primary)' }">Content</div>
</template>
```

Available design tokens are in `src/design-tokens.css`.

### 5. Accessibility Considerations

Always include proper ARIA attributes:

```vue
<template>
  <component
    :aria-label="wcagLabel"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-describedby="hasDescription ? descriptionId : undefined"
  >
    <!-- Content -->
  </component>
  <div v-if="hasDescription" :id="descriptionId" class="sr-only">
    {{ description }}
  </div>
</template>
```

---

## Best Practices and Lessons Learned

### TypeScript

- Use interface extension pattern for Volt component props: `interface Props extends VoltComponentProps {}`
- **Always export component props interfaces** as `export interface CuiComponentProps` for library consumers
- Export props types from `main.ts` so they can be imported: `export type { CuiComponentProps } from "./components/ComponentName.vue"`
- Prefer explicit types over `any`
- Use generic types for reusable patterns
- Leverage TypeScript utility types (`Omit`, `Pick`, `Partial`, etc.)

### Vue Composition API

- Keep setup function organized with clear sections
- Use `ref` for primitives, `reactive` for objects
- Create composables for reusable logic
- Avoid unnecessary watchers - prefer computed properties

### Styling

- Use Tailwind classes for styling consistency
- Use design tokens (CSS custom properties) for theme values
- Use `!` prefix for important overrides when necessary
- Keep conditional classes readable and maintainable

### State Management

- Use v-model pattern for two-way binding
- Emit events for parent communication
- Keep component state minimal and focused
- Use props for configuration, not state

### Documentation

- Write JSDoc as if explaining to a new developer
- Include examples for complex usage
- Document edge cases and limitations
- Keep descriptions concise but complete
- Always run `npm run extract-vue-docs` after JSDoc changes

### Testing

- Write unit tests for complex logic
- Test prop validation and defaults
- Test event emissions
- Test slot rendering
- Test accessibility features

---

## Related Documentation

- **Cursor Rules**: `.cursorrules` - Vue component standards and JSDoc requirements
- **Wrapper Pattern**: `readme/WRAPPER_PATTERN.md` - Detailed explanation of the wrapper pattern
- **Vue Guidelines**: Vue composition API and TypeScript integration best practices
- **Design Tokens**: `components/src/design-tokens.css` - Available CSS custom properties
- **Project Setup**: `readme/PROJECT_SETUP.md` - Development environment setup

---

## Component Enhancement Considerations

When extending existing components or creating new ones, consider:

### Functionality

- Disabled states and loading states
- Keyboard navigation support (Tab, Enter, Space, Arrow keys)
- Multiple selection modes
- Search/filter capabilities
- Virtualization for large datasets

### Accessibility

- ARIA attributes (role, label, describedby, etc.)
- Screen reader announcements
- Focus management and visible focus indicators
- Keyboard-only navigation
- Color contrast requirements

### User Experience

- Animation and transitions
- Loading and error states
- Empty states
- Tooltips and helpful hints
- Responsive behavior

### Developer Experience

- Clear, intuitive prop names
- Sensible defaults
- Comprehensive TypeScript types
- Helpful error messages
- Flexible customization via slots and props

---

## Development Commands

```bash
# Build components library
npm run build

# Run linter
npm run lint

# Extract documentation from JSDoc
npm run extract-vue-docs

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

**Last Updated**: October 14, 2025
