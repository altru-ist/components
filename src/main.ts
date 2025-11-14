import PrimeVue from "primevue/config";
import type { Plugin, App as VueApp } from "vue";
import "./design-tokens.css";
import defaultConfig, { setOptions } from "./utils/config";
import { merge } from "./utils/helpers";

// Design System Components using wrapper pattern
import CuiApp from "./components/CuiApp.vue";
import CuiAvatar from "./components/CuiAvatar.vue";
import CuiBadge from "./components/CuiBadge.vue";
import CuiBreadcrumbs from "./components/CuiBreadcrumbs.vue";
import CuiButton from "./components/CuiButton.vue";
import CuiBtnDropdown from "./components/CuiBtnDropdown.vue";
import CuiCard from "./components/CuiCard.vue";
import CuiCheckbox from "./components/CuiCheckbox.vue";
import CuiChip from "./components/CuiChip.vue";
import CuiDataTable from "./components/CuiDataTable.vue";
import CuiDatePicker from "./components/CuiDatePicker.vue";
import CuiHeader from "./components/CuiHeader.vue";
import CuiInputWrapper from "./components/CuiInputWrapper.vue";
import CuiMainMenu from "./components/CuiMainMenu.vue";
import CuiMultiSelect from "./components/CuiMultiSelect.vue";
import CuiRadioButton from "./components/CuiRadioButton.vue";
import CuiSearchBar from "./components/CuiSearchBar.vue";
import CuiSelect from "./components/CuiSelect.vue";
import CuiSelectButton from "./components/CuiSelectButton.vue";
import CuiTag from "./components/CuiTag.vue";
import CuiTextArea from "./components/CuiTextArea.vue";
import CuiTextInput from "./components/CuiTextInput.vue";
import CuiThemeToggle from "./components/CuiThemeToggle.vue";
import CuiToast from "./components/CuiToast.vue";
import CuiToggleSwitch from "./components/CuiToggleSwitch.vue";
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
  MenuEntry,
  MenuGroup,
  MenuItem,
  MenuItemBase,
} from "./components/CuiMainMenu.vue";

// Export composables
export { useCuiApp, useCuiAppOptional } from "./composables/useCuiApp";
export { useButtonTheme, type ButtonThemeProps } from "./composables/useButtonTheme";

// Export toast system
export { useToast } from "./composables/useToast";

// Export theme system
export { useTheme, type Theme } from "./utils/useTheme";
export type {
  ToastMessageOptions,
  ToastService as ToastServiceMethods,
  ToastSeverity,
} from "./composables/useToast";
export { ToastService } from "./services/toastService";

// Export modal system
export {
  closeModal,
  createModal,
  CuiModalsPortal,
  showModal,
  useModal,
} from "./components/modal";

export * as utils from "./utils";

export {
  CuiApp as App,
  // Export without Cui prefix for backward compatibility and convenience
  CuiAvatar as Avatar,
  CuiBadge as Badge,
  CuiBreadcrumbs as Breadcrumbs,
  CuiButton as Button,
  CuiBtnDropdown as BtnDropdown,
  CuiCard as Card,
  CuiCheckbox as Checkbox,
  CuiChip as Chip,
  CuiApp,
  // Export all components with Cui prefix (primary naming)
  CuiAvatar,
  CuiBadge,
  CuiBreadcrumbs,
  CuiButton,
  CuiBtnDropdown,
  CuiCard,
  CuiCheckbox,
  CuiChip,
  CuiDataTable,
  CuiDatePicker,
  CuiHeader,
  CuiInputWrapper,
  CuiMainMenu,
  CuiModal,
  CuiMultiSelect,
  CuiRadioButton,
  CuiSearchBar,
  CuiSelect,
  CuiSelectButton,
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
  CuiDataTable as DataTable,
  CuiDatePicker as DatePicker,
  CuiHeader as Header,
  CuiInputWrapper as InputWrapper,
  CuiMainMenu as MainMenu,
  CuiModal as Modal,
  CuiMultiSelect as MultiSelect,
  CuiRadioButton as RadioButton,
  CuiSearchBar as SearchBar,
  CuiSelect as Select,
  CuiSelectButton as SelectButton,
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
  Volt,
};

// Component registry for plugin installation
const components = {
  CuiApp,
  CuiAvatar,
  CuiBadge,
  CuiBreadcrumbs,
  CuiButton,
  CuiBtnDropdown,
  CuiCard,
  CuiCheckbox,
  CuiChip,
  CuiDataTable,
  CuiDatePicker,
  CuiHeader,
  CuiInputWrapper,
  CuiMainMenu,
  CuiModal,
  CuiMultiSelect,
  CuiRadioButton,
  CuiSearchBar,
  CuiSelect,
  CuiSelectButton,
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
};

// Type for available component names (using string literal union to avoid type export issues)
export type ComponentName =
  | "CuiApp"
  | "CuiAvatar"
  | "CuiBadge"
  | "CuiBreadcrumbs"
  | "CuiButton"
  | "CuiBtnDropdown"
  | "CuiCard"
  | "CuiCheckbox"
  | "CuiChip"
  | "CuiDataTable"
  | "CuiDatePicker"
  | "CuiHeader"
  | "CuiInputWrapper"
  | "CuiMainMenu"
  | "CuiModal"
  | "CuiMultiSelect"
  | "CuiRadioButton"
  | "CuiSearchBar"
  | "CuiSelect"
  | "CuiSelectButton"
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
  | "CuiToggleSwitch";

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
