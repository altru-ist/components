import PrimeVue from "primevue/config";
import type { Plugin, App as VueApp } from "vue";
import defaultConfig, { setOptions } from "./utils/config";
import { merge } from "./utils/helpers";

// Design System Components using wrapper pattern
import CuiAccordion from "./components/CuiAccordion.vue";
import CuiAccordionContent from "./components/CuiAccordionContent.vue";
import CuiAccordionHeader from "./components/CuiAccordionHeader.vue";
import CuiAccordionPanel from "./components/CuiAccordionPanel.vue";
import CuiApp from "./components/CuiApp.vue";
import CuiAvatar from "./components/CuiAvatar.vue";
import CuiBadge from "./components/CuiBadge.vue";
import CuiBreadcrumbs from "./components/CuiBreadcrumbs.vue";
import CuiButton from "./components/CuiButton.vue";
import CuiButtonDropdown from "./components/CuiButtonDropdown.vue";
import CuiButtonGroup from "./components/CuiButtonGroup.vue";
import CuiCard from "./components/CuiCard.vue";
import CuiCheckbox from "./components/CuiCheckbox.vue";
import CuiChip from "./components/CuiChip.vue";
import CuiDataTable from "./components/CuiDataTable.vue";
import CuiDatePicker from "./components/CuiDatePicker.vue";
import CuiFloater from "./components/CuiFloater.vue";
import CuiHeader from "./components/CuiHeader.vue";
import CuiInputWrapper from "./components/CuiInputWrapper.vue";
import CuiMainMenu from "./components/CuiMainMenu.vue";
import CuiMenu from "./components/CuiMenu.vue";
import CuiMessage from "./components/CuiMessage.vue";
import CuiMultiSelect from "./components/CuiMultiSelect.vue";
import CuiPanel from "./components/CuiPanel.vue";
import CuiRadioButton from "./components/CuiRadioButton.vue";
import CuiSearchBar from "./components/CuiSearchBar.vue";
import CuiSelect from "./components/CuiSelect.vue";
import CuiSelectButton from "./components/CuiSelectButton.vue";
import CuiSplitter from "./components/CuiSplitter.vue";
import CuiTag from "./components/CuiTag.vue";
import CuiTextArea from "./components/CuiTextArea.vue";
import CuiTextInput from "./components/CuiTextInput.vue";
import CuiThemeToggle from "./components/CuiThemeToggle.vue";
import CuiToast from "./components/CuiToast.vue";
import CuiToggleSwitch from "./components/CuiToggleSwitch.vue";
import CuiToolbar from "./components/CuiToolbar.vue";
import CuiTooltip from "./components/CuiTooltip.vue";
import CuiModal from "./components/modal/CuiModal.vue";

// Tab components
import {
  CuiTab,
  CuiTabList,
  CuiTabPanel,
  CuiTabPanels,
  CuiTabs,
} from "./components/Tabs";

// DataTable components
export { Column, DataTableColumn } from "./components/datatable";

import Tooltip from "primevue/tooltip";
import { ToastService } from "./services/toastService";
import * as Volt from "./volt/index";

// Export DataTable types
export type { ColumnProps, ColumnSlots } from "./components/datatable";

// Export CuiApp types and injection key
export { CuiAppContextKey, type CuiAppContext } from "./components/CuiApp.vue";

// Export config types
export type { Config } from "./utils/config";

// Export MainMenu types
export type {
  MainMenuItem,
  MainMenuItemBase,
  MenuEntry,
  MenuGroup,
} from "./components/CuiMainMenu.vue";

// Export component props types (always export properties)
export type { CuiAccordionProps } from "./components/CuiAccordion.vue";
export type { CuiAccordionPanelProps } from "./components/CuiAccordionPanel.vue";
export type { CuiAppProps } from "./components/CuiApp.vue";
export type { CuiAvatarProps } from "./components/CuiAvatar.vue";
export type { CuiBadgeProps } from "./components/CuiBadge.vue";
export type {
  BreadcrumbItem,
  CuiBreadcrumbsProps,
} from "./components/CuiBreadcrumbs.vue";
export type { CuiButtonProps } from "./components/CuiButton.vue";
export type { CuiButtonDropdownProps } from "./components/CuiButtonDropdown.vue";
export type { CuiButtonGroupProps } from "./components/CuiButtonGroup.vue";
export type { CuiCardProps } from "./components/CuiCard.vue";
export type { CuiCheckboxProps } from "./components/CuiCheckbox.vue";
export type { CuiChipProps } from "./components/CuiChip.vue";
export type { CuiDataTableProps } from "./components/CuiDataTable.vue";
export type { CuiDatePickerProps } from "./components/CuiDatePicker.vue";
export type { CuiFloaterProps } from "./components/CuiFloater.vue";
export type { CuiHeaderProps } from "./components/CuiHeader.vue";
export type { CuiInputWrapperProps } from "./components/CuiInputWrapper.vue";
export type { CuiMainMenuProps } from "./components/CuiMainMenu.vue";
export type { CuiMenuProps, MenuItem } from "./components/CuiMenu.vue";
export type { CuiMessageProps } from "./components/CuiMessage.vue";
export type { CuiMultiSelectProps } from "./components/CuiMultiSelect.vue";
export type { CuiPanelProps } from "./components/CuiPanel.vue";
export type { CuiRadioButtonProps } from "./components/CuiRadioButton.vue";
export type { CuiSearchBarProps } from "./components/CuiSearchBar.vue";
export type { CuiSelectProps } from "./components/CuiSelect.vue";
export type { CuiSelectButtonProps } from "./components/CuiSelectButton.vue";
export type { CuiSplitterProps } from "./components/CuiSplitter.vue";
export type { CuiTagProps } from "./components/CuiTag.vue";
export type { CuiTextAreaProps } from "./components/CuiTextArea.vue";
export type { CuiTextInputProps } from "./components/CuiTextInput.vue";
export type { CuiThemeToggleProps } from "./components/CuiThemeToggle.vue";
export type { CuiToastProps } from "./components/CuiToast.vue";
export type { CuiToggleSwitchProps } from "./components/CuiToggleSwitch.vue";
export type { CuiToolbarProps } from "./components/CuiToolbar.vue";
export type { CuiTooltipProps } from "./components/CuiTooltip.vue";
export type { CuiTabProps } from "./components/Tabs/CuiTab.vue";
export type { CuiTabListProps } from "./components/Tabs/CuiTabList.vue";
export type { CuiTabPanelProps } from "./components/Tabs/CuiTabPanel.vue";
export type { CuiTabsProps } from "./components/Tabs/CuiTabs.vue";

// Export composables
export {
  useButtonTheme,
  type ButtonThemeProps,
} from "./composables/useButtonTheme";
export { useCuiApp, useCuiAppOptional } from "./composables/useCuiApp";

// Export toast system
export { useToast } from "./composables/useToast";

// Export theme system
export type {
  ToastMessageOptions,
  ToastService as ToastServiceMethods,
  ToastSeverity,
} from "./composables/useToast";
export { ToastService } from "./services/toastService";
export { useTheme, type Theme } from "./utils/useTheme";

// Export modal system
export {
  closeModal,
  createModal,
  CuiModalsPortal,
  showModal,
  useModal,
} from "./components/modal";

export * as utils from "./utils";

// Export menu registry utilities for advanced usage
export {
  getMenu,
  registerMenu,
  toggleMenuById,
  unregisterMenu,
} from "./utils/menuRegistry";

export {
  // Export without Cui prefix for backward compatibility and convenience
  CuiAccordion as Accordion,
  CuiAccordionContent as AccordionContent,
  CuiAccordionHeader as AccordionHeader,
  CuiAccordionPanel as AccordionPanel,
  CuiApp as App,
  CuiAvatar as Avatar,
  CuiBadge as Badge,
  CuiBreadcrumbs as Breadcrumbs,
  CuiButtonDropdown as BtnDropdown,
  CuiButton as Button,
  CuiButtonGroup as ButtonGroup,
  CuiCard as Card,
  CuiCheckbox as Checkbox,
  CuiChip as Chip,
  // Export all components with Cui prefix (primary naming)
  CuiAccordion,
  CuiAccordionContent,
  CuiAccordionHeader,
  CuiAccordionPanel,
  CuiApp,
  CuiAvatar,
  CuiBadge,
  CuiBreadcrumbs,
  CuiButton,
  CuiButtonDropdown,
  CuiButtonGroup,
  CuiCard,
  CuiCheckbox,
  CuiChip,
  CuiDataTable,
  CuiDatePicker,
  CuiFloater,
  CuiHeader,
  CuiInputWrapper,
  CuiMainMenu,
  CuiMenu,
  CuiMessage,
  CuiModal,
  CuiMultiSelect,
  CuiPanel,
  CuiRadioButton,
  CuiSearchBar,
  CuiSelect,
  CuiSelectButton,
  CuiSplitter,
  CuiTab,
  CuiTabList,
  CuiTabPanel,
  CuiTabPanels,
  CuiTabs,
  CuiTag,
  CuiTextArea,
  CuiTextInput,
  CuiThemeToggle,
  CuiToast,
  CuiToggleSwitch,
  CuiToolbar,
  CuiTooltip,
  CuiDataTable as DataTable,
  CuiDatePicker as DatePicker,
  CuiFloater as Floater,
  CuiHeader as Header,
  CuiInputWrapper as InputWrapper,
  CuiMainMenu as MainMenu,
  CuiMenu as Menu,
  CuiMessage as Message,
  CuiModal as Modal,
  CuiMultiSelect as MultiSelect,
  CuiPanel as Panel,
  CuiRadioButton as RadioButton,
  CuiSearchBar as SearchBar,
  CuiSelect as Select,
  CuiSelectButton as SelectButton,
  CuiSplitter as Splitter,
  CuiTab as Tab,
  CuiTabList as TabList,
  CuiTabPanel as TabPanel,
  CuiTabPanels as TabPanels,
  CuiTabs as Tabs,
  CuiTag as Tag,
  CuiTextArea as TextArea,
  CuiTextInput as TextInput,
  CuiThemeToggle as ThemeToggle,
  CuiToast as Toast,
  CuiToggleSwitch as ToggleSwitch,
  CuiToolbar as Toolbar,
  CuiTooltip as Tooltip,
  Volt,
};

// Component registry for plugin installation
const components = {
  CuiApp,
  CuiAccordion,
  CuiAccordionContent,
  CuiAccordionHeader,
  CuiAccordionPanel,
  CuiAvatar,
  CuiBadge,
  CuiBreadcrumbs,
  CuiButton,
  CuiButtonDropdown,
  CuiButtonGroup,
  CuiCard,
  CuiCheckbox,
  CuiChip,
  CuiDataTable,
  CuiDatePicker,
  CuiFloater,
  CuiHeader,
  CuiInputWrapper,
  CuiMainMenu,
  CuiMenu,
  CuiMessage,
  CuiModal,
  CuiMultiSelect,
  CuiPanel,
  CuiRadioButton,
  CuiSearchBar,
  CuiSelect,
  CuiSelectButton,
  CuiSplitter,
  CuiTab,
  CuiTabList,
  CuiTabPanel,
  CuiTabPanels,
  CuiTabs,
  CuiTag,
  CuiTextArea,
  CuiTextInput,
  CuiThemeToggle,
  CuiToast,
  CuiToggleSwitch,
  CuiToolbar,
  CuiTooltip,
};

// Type for available component names (using string literal union to avoid type export issues)
export type ComponentName =
  | "CuiApp"
  | "CuiAccordion"
  | "CuiAccordionContent"
  | "CuiAccordionHeader"
  | "CuiAccordionPanel"
  | "CuiAvatar"
  | "CuiBadge"
  | "CuiBreadcrumbs"
  | "CuiButton"
  | "CuiButtonDropdown"
  | "CuiButtonGroup"
  | "CuiCard"
  | "CuiCheckbox"
  | "CuiChip"
  | "CuiDataTable"
  | "CuiDatePicker"
  | "CuiFloater"
  | "CuiHeader"
  | "CuiInputWrapper"
  | "CuiMainMenu"
  | "CuiMenu"
  | "CuiMessage"
  | "CuiModal"
  | "CuiMultiSelect"
  | "CuiPanel"
  | "CuiRadioButton"
  | "CuiSearchBar"
  | "CuiSelect"
  | "CuiSelectButton"
  | "CuiSplitter"
  | "CuiTab"
  | "CuiTabList"
  | "CuiTabPanel"
  | "CuiTabPanels"
  | "CuiTabs"
  | "CuiTag"
  | "CuiTextArea"
  | "CuiTextInput"
  | "CuiThemeToggle"
  | "CuiToast"
  | "CuiToggleSwitch"
  | "CuiToolbar"
  | "CuiTooltip";

// Plugin options interface
export interface CommonUIPluginOptions {
  /**
   * Specify which components to install globally
   * - undefined or 'all': Install all components (default)
   * - Array of component names: Install only specified components
   * @example ['CuiButton', 'CuiCard', 'CuiInput']
   */
  components?: ComponentName[] | "all";
  /** CommonUI configuration options (locale, localization strings, component defaults) */
  config?: Partial<Config>;
  /** Additional PrimeVue configuration options */
  primevue?: Record<string, any>;
  /** Register components with alternative prefix (e.g., 'App' instead of 'CuiApp') */
  prefix?: string;
}

// Helper type for the config import
type Config = typeof defaultConfig;

// Vue plugin for installing all CommonUI components
const plugin: Plugin = {
  install(app: VueApp, options: CommonUIPluginOptions = {}) {
    // Merge and set custom configuration (deep merge for nested objects)
    if (options.config) {
      setOptions(merge(defaultConfig, options.config, true));
    }

    // Install PrimeVue with unstyled mode
    app.use(PrimeVue, {
      unstyled: true,
      ...options.primevue,
    });
    // Register tooltip directive globally
    app.directive("tooltip", Tooltip);
    // Install ToastService for toast notifications
    app.use(ToastService);

    // Determine which components to install
    let componentsToInstall: ComponentName[];

    if (!options.components || options.components === "all") {
      // Install all components
      componentsToInstall = Object.keys(components) as ComponentName[];
    } else {
      // Install only specified components
      componentsToInstall = options.components;
    }

    // Register selected components globally
    for (const name of componentsToInstall) {
      const component = components[name];

      if (!component) {
        console.warn(
          `[CommonUI] Component "${name}" not found. Skipping registration.`,
        );
        continue;
      }

      app.component(name, component);

      // Also register without 'Cui' prefix if requested
      if (options.prefix === "") {
        const unprefixedName = name.replace(/^Cui/, "");
        app.component(unprefixedName, component);
      }
    }
  },
};

export default plugin;
