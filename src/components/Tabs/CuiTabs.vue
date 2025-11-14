<script setup lang="ts">
/**
 * Tabs
 *
 * Container component for tabbed interfaces managing tab state and rendering. Provides
 * automatic rendering of tab headers with badges and content panels. Full keyboard navigation.
 */

import VoltTabs from "../../volt/VoltTabs.vue";
import CuiBadge from "../CuiBadge.vue";
import CuiTab from "./CuiTab.vue";
import CuiTabList from "./CuiTabList.vue";
import CuiTabPanel from "./CuiTabPanel.vue";

type Tabs = Array<{
  id: string | number;
  label: string;
  notifications?: number;
  wcagLabel?: string;
}>;

import CuiTabPanels from "./CuiTabPanels.vue";

type TabsProps = {
  /**
   * @description ID of the selected tab.
   */
  modelValue: number;

  /**
   * @description ID, label, notifications and wcagLabel for the tabs.
   */
  tabs: Tabs;

  /**
   * @description Describes the content for screen readers.
   */
  wcagLabel: string;

  /**
   * @description Whether to show tab panels (content areas). Defaults to false for tab-only navigation.
   */
  showPanels?: boolean;
};

const props = withDefaults(defineProps<TabsProps>(), {
  showPanels: false,
});

const model = defineModel<TabsProps["modelValue"]>();

defineSlots<{
  /**
   * @description Dynamic slot for custom tab content. The slot name is `tab-{id}` where id is the tab's ID.
   * @param props - Slot props containing the tab data
   * @param props.tab - The complete tab object with id, label, notifications, and wcagLabel
   * @example <template #tab-1="{ tab }">Custom content for {{ tab.label }}</template>
   */
  [slotName: `tab-${string | number}`]: (props: { tab: any }) => any;
  /**
   * @description Dynamic slot for custom panel content. The slot name is `panel-{id}` where id is the tab's ID.
   * @name panel-{id}
   * @param props - Slot props containing the tab data
   * @param props.tab - The complete tab object with id, label, notifications, and wcagLabel
   * @example <template #panel-1="{ tab }">Custom panel for {{ tab.label }}</template>
   */
  [slotName: `panel-${string | number}`]: (props: { tab: any }) => any;
}>();

if (props.wcagLabel === undefined) {
  throw new Error("The wcagLabel prop is required");
}
for (const tab of props.tabs) {
  if (tab.wcagLabel === undefined) {
    throw new Error(`Tab ${tab.id} is missing the wcagLabel property.`);
  }
}
</script>

<template>
  <VoltTabs
    :value="String(model ?? 0)"
    scrollable
    @update:value="model = Number($event)"
  >
    <CuiTabList
      :wcag-label="wcagLabel"
      class="border-0 border-b-2 border-slate-100"
    >
      <CuiTab
        v-for="tab in tabs"
        :key="tab.id"
        :value="String(tab.id)"
        :wcag-label="tab.wcagLabel"
        ><!-- @slot Custom content for tab {id}. Receives tab object -->
        <slot :name="`tab-${tab.id}`" :tab="tab">
          <!-- Default tab content -->
          <div class="flex h-fit flex-row gap-2.5">
            <span class="whitespace-nowrap text-sm font-semibold">{{
              tab.label
            }}</span>
            <CuiBadge
              v-if="tab.notifications && tab.notifications !== 0"
              :value="tab.notifications"
            />
          </div>
        </slot>
      </CuiTab>
    </CuiTabList>

    <CuiTabPanels v-if="showPanels">
      <CuiTabPanel
        v-for="tab in tabs"
        :key="`panel-${tab.id}`"
        :value="String(tab.id)"
      >
        <!-- @slot Custom content for panel {id}. Receives tab object -->
        <slot :name="`panel-${tab.id}`" :tab="tab">
          <!-- Default panel content -->
          <p>Content for {{ tab.label }}</p>
        </slot>
      </CuiTabPanel>
    </CuiTabPanels>
  </VoltTabs>
</template>
