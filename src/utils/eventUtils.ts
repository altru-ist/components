import { getCurrentInstance } from "vue";

export const eventUtils = {
  hasEventListener,
};

/**
 * Check if an event listener is present on the current component
 * @param eventName
 * @returns boolean
 */
function hasEventListener(eventName: string): boolean {
  if (!eventName || eventName.length === 0) return false;

  const instance = getCurrentInstance();
  if (!instance?.vnode.props) return false;

  const firstChar = eventName.charAt(0);
  const capitalizedEventName =
    "on" + firstChar.toUpperCase() + eventName.slice(1);

  return (
    !!instance.vnode.props[capitalizedEventName] ||
    !!instance.vnode.props[eventName]
  );
}

export default { eventUtils };
