import { Comment, Text, type Component, type Slot, type VNode } from "vue";
import { toArray } from "./arrayUtils";

export default {
  /**
   * @deprecated Use `toArray` from _arrayUtils_ instead.
   */
  asArray: toArray,
  hasSlotContent,
  isSlotEmpty,
  isVNodeEmpty,
  hasSlotComponent,
  getSlotChildCount,
};

/**
 * Checks if a slot has content
 * @param slot - The slot to check.
 * @param props - Additional props to consider.
 * @returns A boolean indicating whether the slot has content.
 */
export function hasSlotContent(
  slot: Slot | undefined | null | void,
  props: any = {},
): boolean {
  return !isSlotEmpty(slot, props);
}

/**
 * Checks if a slot does not have content.
 * @param slot - The slot to check.
 * @param props - Additional props to consider.
 * @returns A boolean indicating whether the slot has content.
 */
export function isSlotEmpty(
  slot: Slot | undefined | null | void,
  props: any = {},
): boolean {
  return isVNodeEmpty(slot?.(props));
}

/**
 * Checks if a VNode or an array of VNodes is empty.
 * @param vnode - The VNode or array of VNodes to check.
 * @returns `true` if the VNode or array of VNodes is empty, `false` otherwise.
 */
export function isVNodeEmpty(
  vnode: VNode | VNode[] | undefined | null,
): boolean {
  return (
    !vnode ||
    toArray(vnode).every(
      (vnode) =>
        vnode.type === Comment ||
        (vnode.type === Text && !vnode.children?.length),
    )
  );
}

/**
 * Checks if a slot contains a specific component.
 * @param slot - The slot to check.
 * @param component - The component to look for.
 * @param props - Additional props to consider when rendering the slot.
 * @returns A boolean indicating whether the slot contains the specified component.
 */
export function hasSlotComponent(
  slot: Slot | undefined | null,
  component: Component,
  props: any = {},
): boolean {
  if (isSlotEmpty(slot, props)) {
    return false;
  }

  const vnodes = toArray(slot?.(props));

  return vnodes.some((vnode) => {
    return vnode && vnode.type === component;
  });
}

/**
 * Counts the number of direct children in a slot.
 * @param slot - The slot to check.
 * @param props - Additional props to consider when rendering the slot.
 * @returns The number of direct children in the slot, excluding comments and empty text nodes.
 */
export function getSlotChildCount(
  slot: Slot | undefined | null,
  props: any = {},
): number {
  if (isSlotEmpty(slot, props)) {
    return 0;
  }

  const vnodes = toArray(slot?.(props));

  return vnodes.filter(
    (vnode) =>
      vnode &&
      vnode.type !== Comment &&
      !(vnode.type === Text && !vnode.children?.length),
  ).length;
}
