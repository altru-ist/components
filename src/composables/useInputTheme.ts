import type { InputTextPassThroughOptions } from "primevue/inputtext";
import type { TextareaPassThroughOptions } from "primevue/textarea";
import { computed, unref, type ComputedRef, type MaybeRefOrGetter } from "vue";

/**
 * Input theme configuration interface
 */
export interface InputThemeProps {
  /** Size of the input */
  size?: MaybeRefOrGetter<"medium" | "large">;
  /** Whether the input is readonly */
  readonly?: MaybeRefOrGetter<boolean>;
  /** Whether this is a textarea (affects some styling) */
  isTextarea?: MaybeRefOrGetter<boolean>;
  /** Whether the textarea has auto-resize enabled */
  autoResize?: MaybeRefOrGetter<boolean>;
  /** Left icon (for text inputs) */
  leftIcon?: MaybeRefOrGetter<string | undefined>;
  /** Right icon (for text inputs) */
  rightIcon?: MaybeRefOrGetter<string | undefined>;
}

/**
 * Composable for generating input theme styles (TextInput and TextArea)
 *
 * This composable encapsulates the input styling logic, making it reusable
 * across TextInput and TextArea components with consistent readonly, size,
 * and state styling.
 *
 * @param props - Input theme configuration properties (supports refs and computed values)
 * @returns Computed PassThroughOptions for PrimeVue input/textarea styling
 *
 * @example
 * ```ts
 * // For TextInput
 * const textInputTheme = useInputTheme({
 *   size: computed(() => props.size),
 *   readonly: computed(() => props.readonly),
 *   leftIcon: computed(() => props.leftIcon),
 *   rightIcon: computed(() => props.rightIcon)
 * });
 *
 * // For TextArea
 * const textAreaTheme = useInputTheme({
 *   size: computed(() => props.size),
 *   readonly: computed(() => props.readonly),
 *   isTextarea: true,
 *   autoResize: computed(() => props.autoResize)
 * });
 * ```
 */
export function useInputTheme(
  props: InputThemeProps,
): ComputedRef<InputTextPassThroughOptions | TextareaPassThroughOptions> {
  return computed<InputTextPassThroughOptions | TextareaPassThroughOptions>(
    () => {
      // Helper to unwrap MaybeRefOrGetter - handles refs, getters, and plain values
      const unwrap = <T>(
        value: MaybeRefOrGetter<T> | undefined,
      ): T | undefined => {
        if (value === undefined) return undefined;
        // Check if it's a function (getter) first, before calling unref
        if (typeof value === "function") {
          return (value as () => T)();
        }
        // Otherwise use unref for refs and computed refs
        return unref(value);
      };

      // Unwrap refs/computed/getter values with explicit types and defaults
      const size: "medium" | "large" = unwrap(props.size) ?? "medium";
      const readonly: boolean = unwrap(props.readonly) ?? false;
      const isTextarea: boolean = unwrap(props.isTextarea) ?? false;
      const autoResize: boolean = unwrap(props.autoResize) ?? false;
      const leftIcon: string | undefined = unwrap(props.leftIcon);
      const rightIcon: string | undefined = unwrap(props.rightIcon);

      // Base styles that apply to all inputs
      const baseStyles = [
        // Layout
        "w-full",
        "font-[var(--font-primary)]",
        "border",
        readonly ? "border-dashed" : "border-solid",
        "transition-all duration-[var(--ds-transition-normal)]",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-[var(--cui-border-focus)]",
        "focus:ring-offset-2",

        // Hover state
        "hover:border-[var(--cui-border-focus)]",

        // Disabled state
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "disabled:hover:border-[var(--cui-border-neutral)]", // Prevent hover on disabled

        // Readonly state
        "read-only:bg-[var(--cui-surface-subtle)]",
        "read-only:cursor-default",
      ];

      // Textarea-specific styles
      if (isTextarea) {
        baseStyles.push("resize-y"); // Allow vertical resizing unless autoResize is enabled
        baseStyles.push("disabled:resize-none"); // Prevent resizing when disabled
        baseStyles.push("read-only:resize-none"); // Prevent resizing when readonly

        if (autoResize) {
          baseStyles.push("resize-none"); // Disable manual resize when auto-resize is on
        }
      }

      // Size-specific styles using design tokens
      const sizeStyles: Record<string, string[]> = isTextarea
        ? {
            // TextArea size styles
            medium: [
              "min-h-[5rem]", // Minimum height for 4 rows at medium size
              "px-3",
              "py-2",
              "text-sm", // 14px
              "rounded-[var(--ds-radius-md)]",
              "leading-5", // 20px line height
            ],
            large: [
              "min-h-[6rem]", // Minimum height for 4 rows at large size
              "px-4",
              "py-3",
              "text-base", // 16px
              "rounded-[var(--ds-radius-md)]",
              "leading-6", // 24px line height
            ],
          }
        : {
            // TextInput size styles
            medium: [
              "h-10",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              !leftIcon && !rightIcon ? "px-3" : "",
              "text-sm", // 14px
              "rounded-[var(--ds-radius-md)]",
            ].filter(Boolean),
            large: [
              "h-12",
              leftIcon ? "pl-12" : "pl-4",
              rightIcon ? "pr-12" : "pr-4",
              !leftIcon && !rightIcon ? "px-4" : "",
              "text-base", // 16px
              "rounded-[var(--ds-radius-md)]",
            ].filter(Boolean),
          };

      // Default styles using semantic color tokens
      const defaultStyles = [
        "bg-[var(--cui-surface-default-white)]",
        "border-[var(--cui-border-neutral)]",
        "text-[var(--cui-text-header-body)]",
        "placeholder:text-[var(--cui-text-subtitle-caption)]",
      ];

      // State-specific styles
      // Note: Error state styling is handled by InputWrapper via slot props
      const stateStyles: string[] = [];

      return {
        root: [
          ...baseStyles,
          ...(sizeStyles[size] || []),
          ...defaultStyles,
          ...stateStyles,
        ].join(" "),
      };
    },
  );
}
