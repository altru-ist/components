<template>
  <!-- Desktop/Tablet Menu -->
  <div
    v-if="!isMobile"
    ref="menuContainerRef"
    v-bind="$attrs"
    :class="[
      menuClasses,
      COMMON_CLASSES.flexCol,
      COMMON_CLASSES.bgSurfaceElevated,
      COMMON_CLASSES.borderNeutral,
      COMMON_CLASSES.flexShrink0,
      'h-full min-h-[700px] border-r border-solid font-[var(--font-primary)] [transition:width_var(--ds-transition-normal)_ease] relative [/*_Accessibility_*/@media(prefers-reduced-motion:reduce)]:transition-none',
      isCollapsed
        ? 'w-[80px] cursor-pointer [/*_Responsive_Design_*/@media(max-width:768px)]:w-[60px]'
        : 'w-[320px] [/*_Responsive_Design_*/@media(max-width:768px)]:w-full [/*_Responsive_Design_*/@media(max-width:768px)]:max-w-[300px]',
    ]"
    :data-collapsed="isCollapsed"
    @click="handleMenuClick"
  >
    <!-- Menu Header -->
    <div
      :class="[
        COMMON_CLASSES.flexRow,
        COMMON_CLASSES.bgSurfaceElevated,
        COMMON_CLASSES.borderNeutral,
        'h-[70px] px-4 py-[0] border-b border-solid',
        isCollapsed ? 'justify-center px-2 py-[0]' : '',
      ]"
    >
      <div
        :class="[
          COMMON_CLASSES.flexRow,
          'gap-3.5 w-full',
          isCollapsed ? 'justify-center w-auto' : '',
        ]"
      >
        <div :class="[COMMON_CLASSES.flexShrink0, COMMON_CLASSES.flexCenter]">
          <img
            v-if="logo"
            :src="logo"
            :alt="logoAlt"
            class="w-[45px] h-[27px] object-contain block"
            data-testid="menu-logo-image"
          />
          <div
            v-else
            :class="[
              COMMON_CLASSES.flexCenter,
              COMMON_CLASSES.roundedSm,
              'w-[45px] h-[27px] bg-[var(--cui-surface-subtle)]',
            ]"
          >
            <span class="material-symbols-rounded">business</span>
          </div>
        </div>
        <div
          v-if="!isCollapsed"
          :class="[COMMON_CLASSES.flex1, 'min-w-[0]']"
          data-testid="menu-brand"
        >
          <div
            :class="[
              COMMON_CLASSES.textHeaderBody,
              COMMON_CLASSES.leadingRelaxed,
              'text-[0.75rem] m-0 font-[var(--font-weight-normal)]',
            ]"
            data-testid="menu-title"
          >
            {{ title }}
          </div>
          <p
            v-if="subtitle"
            :class="[
              COMMON_CLASSES.textMuted,
              COMMON_CLASSES.leadingRelaxed,
              'text-[0.6875rem] m-0 font-[var(--font-weight-normal)]',
            ]"
            data-testid="menu-subtitle"
          >
            {{ subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Menu Tools -->
    <div
      :class="[
        COMMON_CLASSES.bgSurfaceElevated,
        COMMON_CLASSES.borderNeutral,
        'flex justify-end items-stretch h-[43px] px-[0.8125rem] py-[0] border-b border-solid',
        isCollapsed ? 'justify-center' : '',
      ]"
    >
      <CuiButton
        variant="secondary-text"
        size="small"
        icon-only
        @click.stop="toggleCollapse"
        :ariaLabel="isCollapsed ? 'Expand menu' : 'Collapse menu'"
        class="w-[40px] h-full !items-center !justify-center"
      >
        <span
          class="material-symbols-rounded flex items-center justify-center w-full h-full leading-none"
        >
          {{
            isCollapsed
              ? "keyboard_double_arrow_right"
              : "keyboard_double_arrow_left"
          }}
        </span>
      </CuiButton>
    </div>

    <!-- Menu Content -->
    <div
      :class="[
        COMMON_CLASSES.flex1,
        COMMON_CLASSES.bgSurfaceElevated,
        'overflow-y-auto px-[1.125rem] py-4',
        isCollapsed ? 'px-2 py-4' : '',
      ]"
    >
      <nav class="w-full" aria-label="Main navigation">
        <ul class="[list-style:none] m-0 p-0">
          <template v-for="item in items" :key="item.id">
            <!-- Menu Item -->
            <li v-if="item.type === 'item'" class="my-[2px]">
              <button
                type="button"
                :class="[
                  'group flex items-center w-full min-h-[56px] px-2 py-3 bg-transparent cursor-pointer box-border bg-clip-padding border-[2px] border-transparent focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px] [font-family:inherit]',
                  COMMON_CLASSES.roundedSm,
                  COMMON_CLASSES.transitionAll,
                  COMMON_CLASSES.gap2,
                  COMMON_CLASSES.textHeaderBody,
                  isCollapsed ? 'justify-center px-1 py-3' : '',
                  !item.disabled && activeItemId !== item.id
                    ? 'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent'
                    : '',
                  activeItemId === item.id
                    ? `[box-shadow:inset_0_0_0_1px_var(--cui-surface-navigation),_inset_0_0_0_999px_var(--cui-surface-navigation-light)] bg-transparent ${COMMON_CLASSES.fontSemibold}`
                    : '',
                  item.disabled ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                :disabled="item.disabled"
                @click="
                  isCollapsed
                    ? null
                    : (handleItemClick(item), $event.stopPropagation())
                "
              >
                <span
                  :class="[
                    'material-symbols-rounded !text-[1.125rem]',
                    COMMON_CLASSES.flexShrink0,
                    COMMON_CLASSES.textMuted,
                    'group-hover:[color:var(--cui-text-header-body)]',
                    activeItemId === item.id
                      ? COMMON_CLASSES.textHeaderBody
                      : '',
                  ]"
                  >{{ item.icon }}</span
                >
                <span
                  v-if="!isCollapsed"
                  :class="[
                    COMMON_CLASSES.flex1,
                    COMMON_CLASSES.textSm,
                    COMMON_CLASSES.fontMedium,
                    COMMON_CLASSES.leadingRelaxed,
                    'text-left [color:inherit]',
                  ]"
                  >{{ item.label }}</span
                >
                <div
                  v-if="!isCollapsed && item.badge"
                  :class="COMMON_CLASSES.flexShrink0"
                  data-testid="menu-item-badge"
                >
                  <CuiBadge
                    :variant="item.badgeType || 'badge'"
                    :value="item.badge"
                    :outlined="item.badgeOutline || false"
                  />
                </div>
              </button>
            </li>

            <!-- Menu Group -->
            <li v-else-if="item.type === 'group'" class="my-[2px]">
              <button
                type="button"
                :class="[
                  'group flex items-center w-full min-h-[56px] px-2 py-3 bg-transparent cursor-pointer box-border bg-clip-padding border-[2px] border-transparent focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px] [font-family:inherit]',
                  COMMON_CLASSES.roundedSm,
                  COMMON_CLASSES.transitionAll,
                  COMMON_CLASSES.gap2,
                  COMMON_CLASSES.textHeaderBody,
                  isCollapsed ? 'justify-center px-1 py-3' : '',
                  !item.disabled &&
                  !(activeItemId === item.id || isGroupActive(item))
                    ? 'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent'
                    : '',
                  activeItemId === item.id || isGroupActive(item)
                    ? `[box-shadow:inset_0_0_0_1px_var(--cui-surface-navigation),_inset_0_0_0_999px_var(--cui-surface-navigation-light)] bg-transparent ${COMMON_CLASSES.fontSemibold}`
                    : '',
                  item.disabled ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                :disabled="item.disabled"
                @click="
                  isCollapsed
                    ? null
                    : (handleItemClick(item), $event.stopPropagation())
                "
              >
                <span
                  :class="[
                    'material-symbols-rounded !text-[1.125rem]',
                    COMMON_CLASSES.flexShrink0,
                    COMMON_CLASSES.textMuted,
                    'group-hover:[color:var(--cui-text-header-body)]',
                    activeItemId === item.id || isGroupActive(item)
                      ? COMMON_CLASSES.textHeaderBody
                      : '',
                  ]"
                  >{{ item.icon }}</span
                >
                <span
                  v-if="!isCollapsed"
                  :class="[
                    COMMON_CLASSES.flex1,
                    COMMON_CLASSES.textSm,
                    COMMON_CLASSES.fontMedium,
                    COMMON_CLASSES.leadingRelaxed,
                    'text-left [color:inherit]',
                  ]"
                  >{{ item.label }}</span
                >
                <span
                  v-if="!isCollapsed"
                  :class="[
                    'material-symbols-rounded !text-[1.125rem] [transition:transform_var(--ds-transition-fast)_ease] [/*_Accessibility_*/@media(prefers-reduced-motion:reduce)]:transition-none',
                    COMMON_CLASSES.flexShrink0,
                    isGroupExpanded(item.id) ? 'rotate-180' : '',
                  ]"
                >
                  {{
                    isGroupExpanded(item.id)
                      ? "keyboard_arrow_up"
                      : "keyboard_arrow_down"
                  }}
                </span>
              </button>

              <!-- Submenu -->
              <div
                v-if="!isCollapsed && isGroupExpanded(item.id)"
                class="ml-9 mt-1"
              >
                <ul class="[list-style:none] m-0 p-0">
                  <li
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    class="my-[2px]"
                  >
                    <button
                      type="button"
                      :class="[
                        'group flex items-center w-full min-h-[35px] px-[0.5625rem] py-[0.4375rem] bg-transparent cursor-pointer box-border bg-clip-padding border-[2px] border-transparent focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px] [font-family:inherit]',
                        COMMON_CLASSES.roundedSm,
                        COMMON_CLASSES.transitionAll,
                        COMMON_CLASSES.gap2,
                        COMMON_CLASSES.textMuted,
                        !subItem.disabled && activeItemId !== subItem.id
                          ? 'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent hover:border-transparent'
                          : '',
                        activeItemId === subItem.id
                          ? `[box-shadow:inset_0_0_0_1px_var(--cui-surface-navigation),_inset_0_0_0_999px_var(--cui-surface-navigation-light)] bg-transparent ${COMMON_CLASSES.fontSemibold}`
                          : '',
                        subItem.disabled ? 'opacity-50 cursor-not-allowed' : '',
                      ]"
                      :disabled="subItem.disabled"
                      @click="
                        isCollapsed
                          ? null
                          : (handleItemClick(subItem), $event.stopPropagation())
                      "
                    >
                      <span
                        :class="[
                          COMMON_CLASSES.flex1,
                          COMMON_CLASSES.textSm,
                          COMMON_CLASSES.leadingRelaxed,
                          'text-left font-[var(--font-weight-light)] [color:inherit]',
                        ]"
                        >{{ subItem.label }}</span
                      >
                      <div
                        v-if="subItem.badge"
                        :class="COMMON_CLASSES.flexShrink0"
                      >
                        <CuiBadge
                          :variant="subItem.badgeType || 'badge'"
                          :value="subItem.badge"
                          :outlined="subItem.badgeOutline || false"
                        />
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </template>
        </ul>
      </nav>
    </div>

    <!-- Menu Footer -->
    <div
      v-if="!isCollapsed && props.bottomMenu && props.bottomMenu.length > 0"
      :class="[
        COMMON_CLASSES.bgSurfaceElevated,
        COMMON_CLASSES.borderNeutral,
        COMMON_CLASSES.flexShrink0,
        'border-t border-solid py-1 relative z-0 mt-auto sticky bottom-0',
      ]"
    >
      <button
        ref="supportButtonRef"
        type="button"
        :class="[
          'flex items-center justify-between px-6 py-2.5 cursor-pointer select-none w-full bg-transparent border-none text-left',
          COMMON_CLASSES.roundedSm,
          COMMON_CLASSES.transitionAll,
          'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent',
          'focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px]',
        ]"
        @click="toggleSupportMenu"
      >
        <span
          :class="[
            COMMON_CLASSES.textMuted,
            COMMON_CLASSES.leadingRelaxed,
            'text-[0.6875rem] font-[var(--font-weight-normal)]',
          ]"
          >{{ supportText }}</span
        >
        <span
          :class="[
            'material-symbols-rounded !text-[1.125rem] transition-transform duration-200',
            COMMON_CLASSES.textHeaderBody,
            { 'rotate-180': showSupportMenu },
          ]"
          >keyboard_arrow_up</span
        >
      </button>
    </div>
  </div>

  <!-- Support Menu Popup (Teleported) -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0 transform translate-y-1"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-1"
    >
      <div
        v-if="
          !isCollapsed &&
          showSupportMenu &&
          props.bottomMenu &&
          props.bottomMenu.length > 0
        "
        ref="supportMenuRef"
        :class="[
          COMMON_CLASSES.bgSurfaceElevated,
          COMMON_CLASSES.borderNeutral,
          'fixed p-3 px-2 border border-solid shadow-lg z-[9999]',
        ]"
        :style="{
          top: `${supportMenuPosition.top - 4}px`,
          left: `${supportMenuPosition.left}px`,
          width: `${supportMenuPosition.width}px`,
          transform: 'translateY(-100%)',
        }"
      >
        <ul class="[list-style:none] m-0 p-0 gap-1 flex flex-col">
          <li v-for="item in props.bottomMenu" :key="item.id" class="my-[2px]">
            <button
              type="button"
              :class="[
                'group flex items-center w-full min-h-[35px] px-[0.5625rem] py-[0.4375rem] bg-transparent cursor-pointer box-border bg-clip-padding border-[2px] border-transparent focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px] [font-family:inherit]',
                COMMON_CLASSES.roundedSm,
                COMMON_CLASSES.transitionAll,
                COMMON_CLASSES.gap2,
                COMMON_CLASSES.textHeaderBody,
                !item.disabled && activeItemId !== item.id
                  ? 'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent'
                  : '',
                activeItemId === item.id
                  ? `[box-shadow:inset_0_0_0_1px_var(--cui-surface-navigation),_inset_0_0_0_999px_var(--cui-surface-navigation-light)] bg-transparent ${COMMON_CLASSES.fontSemibold}`
                  : '',
                item.disabled ? 'opacity-50 cursor-not-allowed' : '',
              ]"
              :disabled="item.disabled"
              @click="handleItemClick(item, true)"
            >
              <span
                :class="[
                  'material-symbols-rounded !text-[1.125rem]',
                  COMMON_CLASSES.flexShrink0,
                  COMMON_CLASSES.textMuted,
                  'group-hover:[color:var(--cui-text-header-body)]',
                  activeItemId === item.id ? COMMON_CLASSES.textHeaderBody : '',
                ]"
                >{{ item.icon }}</span
              >
              <span
                :class="[
                  COMMON_CLASSES.flex1,
                  COMMON_CLASSES.textSm,
                  COMMON_CLASSES.leadingRelaxed,
                  'text-left font-[var(--font-weight-light)] [color:inherit]',
                ]"
                >{{ item.label }}</span
              >
              <div v-if="item.badge" :class="COMMON_CLASSES.flexShrink0">
                <CuiBadge
                  :variant="item.badgeType || 'badge'"
                  :value="item.badge"
                  :outlined="item.badgeOutline || false"
                />
              </div>
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </Teleport>

  <!-- Mobile Menu -->
  <div v-if="isMobile" v-bind="$attrs" class="mobile-menu-container">
    <!-- Overlay -->
    <div
      v-if="mobileMenuVisible"
      class="fixed bottom-0 left-0 right-0 inset-0 bg-black/50 z-40 transition-opacity duration-300"
      @click="toggleMobileMenu"
    ></div>

    <!-- Expanded Menu -->
    <Transition
      @before-enter="mobileBeforeEnter"
      @enter="mobileEnter"
      @after-enter="mobileAfterEnter"
      @before-leave="mobileBeforeLeave"
      @leave="mobileLeave"
      @after-leave="mobileAfterLeave"
    >
      <div
        v-if="mobileMenuVisible"
        ref="mobileMenuRef"
        :class="[
          COMMON_CLASSES.bgSurfaceElevated,
          COMMON_CLASSES.borderNeutral,
          'fixed bottom-16 left-0 right-0 shadow-lg border-t z-50 max-h-96 overflow-y-auto',
        ]"
      >
        <div class="p-4">
          <nav class="w-full" aria-label="Mobile navigation">
            <ul class="[list-style:none] m-0 p-0">
              <template v-for="item in items" :key="item.id">
                <!-- Menu Item -->
                <li v-if="item.type === 'item'" class="my-[2px]">
                  <button
                    type="button"
                    :class="[
                      'group flex items-center w-full min-h-[56px] px-2 py-3 bg-transparent cursor-pointer box-border bg-clip-padding border-[2px] border-transparent focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px] [font-family:inherit]',
                      COMMON_CLASSES.roundedSm,
                      COMMON_CLASSES.transitionAll,
                      COMMON_CLASSES.gap2,
                      COMMON_CLASSES.textHeaderBody,
                      !item.disabled && activeItemId !== item.id
                        ? 'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent'
                        : '',
                      activeItemId === item.id
                        ? `[box-shadow:inset_0_0_0_1px_var(--cui-surface-navigation),_inset_0_0_0_999px_var(--cui-surface-navigation-light)] bg-transparent ${COMMON_CLASSES.fontSemibold}`
                        : '',
                      item.disabled ? 'opacity-50 cursor-not-allowed' : '',
                    ]"
                    :disabled="item.disabled"
                    @click="handleItemClick(item)"
                  >
                    <span
                      :class="[
                        'material-symbols-rounded !text-[1.125rem]',
                        COMMON_CLASSES.flexShrink0,
                        COMMON_CLASSES.textMuted,
                        'group-hover:[color:var(--cui-text-header-body)]',
                        activeItemId === item.id
                          ? COMMON_CLASSES.textHeaderBody
                          : '',
                      ]"
                      >{{ item.icon }}</span
                    >
                    <span
                      :class="[
                        COMMON_CLASSES.flex1,
                        COMMON_CLASSES.textSm,
                        COMMON_CLASSES.fontMedium,
                        COMMON_CLASSES.leadingRelaxed,
                        'text-left [color:inherit]',
                      ]"
                      >{{ item.label }}</span
                    >
                    <div v-if="item.badge" :class="COMMON_CLASSES.flexShrink0">
                      <CuiBadge
                        :variant="item.badgeType || 'badge'"
                        :value="item.badge"
                        :outlined="item.badgeOutline || false"
                      />
                    </div>
                  </button>
                </li>

                <!-- Menu Group -->
                <li v-else-if="item.type === 'group'" class="my-[2px]">
                  <button
                    type="button"
                    class="group flex items-center w-full min-h-[56px] px-2 py-3 bg-transparent cursor-pointer rounded-[var(--ds-radius-sm)] [transition:all_var(--ds-transition-fast)_ease] gap-2 [font-family:inherit] box-border bg-clip-padding border-[2px] border-transparent text-[var(--cui-text-header-body)] focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px]"
                    :class="[
                      !item.disabled &&
                      !(activeItemId === item.id || isGroupActive(item))
                        ? 'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent'
                        : '',
                      activeItemId === item.id || isGroupActive(item)
                        ? '[box-shadow:inset_0_0_0_1px_var(--cui-surface-navigation),_inset_0_0_0_999px_var(--cui-surface-navigation-light)] bg-transparent font-[var(--font-weight-semibold)]'
                        : '',
                      item.disabled ? 'opacity-50 cursor-not-allowed' : '',
                    ]"
                    :disabled="item.disabled"
                    @click="handleItemClick(item)"
                  >
                    <span
                      class="material-symbols-rounded flex-shrink-0 !text-[1.125rem] [color:var(--cui-text-muted)] group-hover:[color:var(--cui-text-header-body)]"
                      :class="[
                        activeItemId === item.id || isGroupActive(item)
                          ? '[color:var(--cui-text-header-body)]'
                          : '',
                      ]"
                      >{{ item.icon }}</span
                    >
                    <span
                      class="flex-[1] text-left text-[0.875rem] font-[var(--font-weight-medium)] leading-relaxed [color:inherit]"
                      >{{ item.label }}</span
                    >
                    <span
                      class="material-symbols-rounded flex-shrink-0 !text-[1.125rem] [transition:transform_var(--ds-transition-fast)_ease] [/*_Accessibility_*/@media(prefers-reduced-motion:reduce)]:transition-none"
                      :class="[isGroupExpanded(item.id) ? 'rotate-180' : '']"
                    >
                      {{
                        isGroupExpanded(item.id)
                          ? "keyboard_arrow_up"
                          : "keyboard_arrow_down"
                      }}
                    </span>
                  </button>

                  <!-- Submenu -->
                  <div v-if="isGroupExpanded(item.id)" class="ml-9 mt-1">
                    <ul class="[list-style:none] m-0 p-0">
                      <li
                        v-for="subItem in item.children"
                        :key="subItem.id"
                        class="my-[2px]"
                      >
                        <button
                          type="button"
                          class="group flex items-center w-full min-h-[35px] px-[0.5625rem] py-[0.4375rem] bg-transparent cursor-pointer rounded-[var(--ds-radius-sm)] [transition:all_var(--ds-transition-fast)_ease] gap-2 [font-family:inherit] box-border bg-clip-padding border-[2px] border-transparent text-[var(--cui-text-muted)] focus:outline-[none] focus-visible:outline-[2px_solid_var(--cui-border-focus)] focus-visible:outline-offset-[2px]"
                          :class="[
                            !subItem.disabled && activeItemId !== subItem.id
                              ? 'hover:[box-shadow:inset_0_0_0_1px_var(--cui-border-neutral),_inset_0_0_0_999px_var(--cui-surface-default-hover)] hover:bg-transparent hover:border-transparent'
                              : '',
                            activeItemId === subItem.id
                              ? '[box-shadow:inset_0_0_0_1px_var(--cui-surface-navigation),_inset_0_0_0_999px_var(--cui-surface-navigation-light)] bg-transparent font-[var(--font-weight-semibold)]'
                              : '',
                            subItem.disabled
                              ? 'opacity-50 cursor-not-allowed'
                              : '',
                          ]"
                          :disabled="subItem.disabled"
                          @click="handleItemClick(subItem)"
                        >
                          <span
                            class="flex-[1] text-left text-[0.875rem] font-[var(--font-weight-light)] leading-relaxed [color:inherit]"
                            >{{ subItem.label }}</span
                          >
                          <div v-if="subItem.badge" class="flex-shrink-0">
                            <CuiBadge
                              :variant="subItem.badgeType || 'badge'"
                              :value="subItem.badge"
                              :outlined="subItem.badgeOutline || false"
                            />
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </template>
            </ul>
          </nav>
        </div>
      </div>
    </Transition>

    <!-- Bottom Navigation Bar -->
    <div
      :class="[
        COMMON_CLASSES.bgSurfaceElevated,
        COMMON_CLASSES.borderNeutral,
        'fixed bottom-0 left-0 right-0 border-t z-50 safe-area-inset-bottom',
      ]"
    >
      <div class="py-2">
        <div class="flex items-center justify-center gap-1 h-13 px-2">
          <!-- Visible menu items -->
          <template v-for="item in visibleMobileItems" :key="item.id">
            <button
              :class="getMobileItemStyle(item)"
              @click="handleMobileItemClick(item)"
            >
              <div class="relative">
                <span
                  :class="[
                    'material-symbols-rounded !text-[1.125rem] mb-1',
                    COMMON_CLASSES.flexShrink0,
                    getMobileItemTextColor(item),
                  ]"
                  >{{ item.icon }}</span
                >
                <div v-if="item.badge" class="absolute -right-5 -top-2">
                  <CuiBadge
                    :variant="item.badgeType || 'badge'"
                    :value="item.badge"
                    :outlined="item.badgeOutline || false"
                  />
                </div>
              </div>
              <span
                :class="[
                  COMMON_CLASSES.textXs,
                  getMobileItemTextColor(item),
                  'truncate max-w-full',
                ]"
              >
                {{ item.label }}
              </span>
            </button>
          </template>

          <!-- Show More button -->
          <button
            :class="[
              COMMON_CLASSES.flexCol,
              COMMON_CLASSES.flexCenter,
              COMMON_CLASSES.bgHover,
              COMMON_CLASSES.roundedLg,
              'p-2 min-w-0 flex-1 transition-colors',
            ]"
            @click="toggleMobileMenu"
          >
            <span
              :class="[
                'material-symbols-rounded !text-[1.125rem] transition-transform',
                COMMON_CLASSES.flexShrink0,
                COMMON_CLASSES.textGray,
                { 'rotate-90': mobileMenuVisible },
              ]"
              >more_horiz</span
            >
            <span :class="[COMMON_CLASSES.textXs, COMMON_CLASSES.textGray]">
              {{ mobileMenuVisible ? "Less" : "More" }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export interface MainMenuItemBase {
  id: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

export interface MainMenuItem extends MainMenuItemBase {
  type: "item";
  badge?: string;
  badgeType?: "badge" | "pill-small" | "pill-large";
  badgeOutline?: boolean;
}

export interface MenuGroup extends MainMenuItemBase {
  type: "group";
  children: MainMenuItem[];
  expanded?: boolean;
}

export type MenuEntry = MainMenuItem | MenuGroup;

/**
 * Props interface for the MainMenu component
 */
export interface CuiMainMenuProps {
  /** Array of menu entries to display in the navigation */
  items?: MenuEntry[];
  /** Whether the menu is in collapsed state (shows only icons) */
  collapsed?: boolean;
  /** ID of the currently active menu item */
  activeItemId?: string;
  /** URL or path to the logo image */
  logo?: string;
  /** Alt text for the logo image */
  logoAlt?: string;
  /** Main title displayed in the menu header */
  title?: string;
  /** Subtitle displayed below the main title */
  subtitle?: string;
  /** Text for the support/documentation link */
  supportText?: string;
  /** Whether to show demo-specific styling or behavior */
  demo?: boolean;
  /** Force mobile mode on/off (overrides auto-detection) */
  mobile?: boolean;
  /** Bottom menu items to display in the support/documentation popup */
  bottomMenu?: MainMenuItem[];
}
</script>
<script setup lang="ts">
/**
 * MainMenu
 *
 * Comprehensive navigation menu with hierarchical structure, collapsible state, nested submenus,
 * notification badges, and keyboard navigation. Integrates with CuiApp for layout coordination.
 */

import {
  ref,
  computed,
  inject,
  nextTick,
  watch,
  onMounted,
  onUnmounted,
  type Ref,
} from "vue";
import { CuiButton, CuiBadge } from "../main";

// Disable automatic attribute inheritance so we can manually apply $attrs
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CuiMainMenuProps>(), {
  items: () => [],
  collapsed: false,
  logoAlt: "Logo",
  title: "Application",
  subtitle: "",
  supportText: "Support / Documentation",
  demo: false,
  bottomMenu: () => [],
});

// Define slots with JSDoc documentation
defineSlots<{
  /**
   * Default slot for custom menu content
   * This slot is not currently used but reserved for future extensibility
   * Could be used to add custom content areas within the menu
   */
  default?: () => any;
}>();

const emit = defineEmits<{
  /**
   * Emitted when a menu item or group is clicked
   * @arg {MainMenuItem | MenuGroup} item - The clicked menu item or group
   */
  "item-click": [item: MainMenuItem | MenuGroup];

  /**
   * Emitted when the menu collapse state changes
   * @arg {boolean} collapsed - The new collapsed state
   */
  "toggle-collapse": [collapsed: boolean];

  /**
   * Emitted when a menu group is toggled
   * @arg {MenuGroup} group - The toggled menu group
   */
  "toggle-group": [group: MenuGroup];
}>();

// Constants for reusable classes (only values used multiple times)
const COMMON_CLASSES = {
  // Layout - used in multiple places
  flexCol: "flex flex-col",
  flexCenter: "flex items-center justify-center",
  flexRow: "flex items-center",
  flex1: "flex-[1]",
  flexShrink0: "flex-shrink-0",

  // Border radius - used in all buttons
  roundedSm: "rounded-[var(--ds-radius-sm)]",

  // Transitions - used in all interactive elements
  transitionAll: "[transition:all_var(--ds-transition-fast)_ease]",

  // Spacing - used in multiple buttons
  gap2: "gap-2",

  // Colors - Surface (used multiple times)
  bgSurfaceElevated: "bg-[var(--cui-background-main-menu)]",
  borderNeutral: "border-[var(--cui-border-neutral)]",

  // Colors - Text (used multiple times)
  textHeaderBody: "text-[var(--cui-text-header-body)]",
  textMuted: "text-[var(--cui-text-subtitle-caption)]",
  textGray: "text-gray-600 dark:text-gray-300",

  // Typography (used multiple times)
  textXs: "text-xs",
  textSm: "text-[0.875rem]",
  fontSemibold: "font-[var(--font-weight-semibold)]",
  fontMedium: "font-[var(--font-weight-medium)]",
  leadingRelaxed: "leading-relaxed",

  // Mobile menu specific (used multiple times)
  textAmber: "text-amber-700 dark:text-amber-300",
  bgAmber: "bg-amber-100 dark:bg-amber-900/50",
  outlineAmber: "outline outline-amber-300 dark:outline-amber-700",
  roundedLg: "rounded-lg",
  bgHover: "hover:bg-gray-100 dark:hover:bg-gray-800",
} as const;

const STYLE_PROPS = {
  transform: "transform",
  opacity: "opacity",
  transition: "transition",
} as const;

const TRANSITIONS = {
  mobileOut: "transform 300ms ease-out, opacity 300ms ease-out",
  mobileIn: "transform 300ms ease-in, opacity 300ms ease-in",
} as const;

const MOBILE_TRANSFORMS = {
  slideUp: "translateY(100%)",
  slideDown: "translateY(0)",
} as const;

// Inject isMobile from App component (can be overridden by mobile prop)
const injectedIsMobile = inject<Ref<boolean>>("isMobile", ref(false));

// Computed property that uses mobile prop if provided, otherwise uses injected value
const isMobile = computed(() => {
  return props.mobile !== undefined ? props.mobile : injectedIsMobile.value;
});

// Mobile menu state
const mobileMenuVisible = ref(false);
const maxMobileIcons = 4;
const menuContainerRef = ref<HTMLElement | null>(null);
const mobileMenuRef = ref<HTMLElement | null>(null);

const isCollapsed = ref(props.collapsed);
const expandedGroups = ref<Set<string>>(new Set());
const showSupportMenu = ref(false);
const supportButtonRef = ref<HTMLElement | null>(null);
const supportMenuRef = ref<HTMLElement | null>(null);
const supportMenuPosition = ref({ top: 0, left: 0, width: 0 });

// Initialize expanded groups
if (props.items && Array.isArray(props.items)) {
  props.items.forEach((item) => {
    if (item.type === "group" && item.expanded) {
      expandedGroups.value.add(item.id);
    }
  });
}

const menuClasses = computed(() => ({}));

// Get flat list of all items (including items from groups)
const flatItems = computed(() => {
  const result: MainMenuItem[] = [];
  props.items.forEach((item) => {
    if (item.type === "item") {
      result.push(item);
    } else if (item.type === "group") {
      result.push(...item.children);
    }
  });
  return result;
});

const visibleMobileItems = computed(() => {
  return flatItems.value
    .filter((item) => !item.disabled)
    .slice(0, maxMobileIcons);
});

// Function to determine if a menu item is selected
function isMainMenuItemSelected(item: MainMenuItem): boolean {
  return props.activeItemId === item.id;
}

// Function to get mobile menu item styling
function getMobileItemStyle(item: MainMenuItem): string {
  const baseStyle = `${COMMON_CLASSES.flexCol} ${COMMON_CLASSES.flexCenter} p-1 ${COMMON_CLASSES.roundedLg} transition-colors min-w-0 flex-1`;

  if (isMainMenuItemSelected(item)) {
    return `${baseStyle} ${COMMON_CLASSES.bgAmber} ${COMMON_CLASSES.outlineAmber}`;
  }

  return `${baseStyle} ${COMMON_CLASSES.bgHover}`;
}

// Function to get mobile menu item icon/text color
function getMobileItemTextColor(item: MainMenuItem): string {
  return isMainMenuItemSelected(item)
    ? COMMON_CLASSES.textAmber
    : COMMON_CLASSES.textGray;
}

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

// Handle mobile menu item click
const handleMobileItemClick = (item: MainMenuItem) => {
  emit("item-click", item);
};

// Watch for mobile menu opening and focus last item
watch(mobileMenuVisible, async (newValue) => {
  if (newValue && mobileMenuRef.value) {
    await nextTick();

    // Find all focusable buttons in the mobile menu popup
    const buttons = mobileMenuRef.value.querySelectorAll("button");
    if (buttons.length > 0) {
      // Focus the last button (last menu item)
      const lastButton = buttons[buttons.length - 1] as HTMLButtonElement;
      lastButton?.focus();
    }
  }
});

// Helper function to set element styles
function setElementStyles(
  element: HTMLElement,
  styles: Record<string, string>,
) {
  Object.entries(styles).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
}

// Helper function to reset element styles
function resetElementStyles(element: HTMLElement, properties: string[]) {
  properties.forEach((property) => {
    element.style.removeProperty(property);
  });
}

// Mobile menu animation hooks
const mobileBeforeEnter = (el: Element) => {
  const element = el as HTMLElement;
  setElementStyles(element, {
    [STYLE_PROPS.transform]: MOBILE_TRANSFORMS.slideUp,
    [STYLE_PROPS.opacity]: "0",
  });
};

const mobileEnter = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  element.style.transition = TRANSITIONS.mobileOut;
  // Force repaint by accessing offsetHeight
  if (element.offsetHeight >= 0) {
    setElementStyles(element, {
      [STYLE_PROPS.transform]: MOBILE_TRANSFORMS.slideDown,
      [STYLE_PROPS.opacity]: "1",
    });
  }

  element.addEventListener("transitionend", function onEnd() {
    element.removeEventListener("transitionend", onEnd);
    done();
  });
};

const mobileAfterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.removeProperty(STYLE_PROPS.transition);
};

const mobileBeforeLeave = (el: Element) => {
  const element = el as HTMLElement;
  setElementStyles(element, {
    [STYLE_PROPS.transform]: MOBILE_TRANSFORMS.slideDown,
    [STYLE_PROPS.opacity]: "1",
  });
};

const mobileLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  element.style.transition = TRANSITIONS.mobileIn;
  // Force repaint by accessing offsetHeight
  if (element.offsetHeight >= 0) {
    setElementStyles(element, {
      [STYLE_PROPS.transform]: MOBILE_TRANSFORMS.slideUp,
      [STYLE_PROPS.opacity]: "0",
    });
  }

  element.addEventListener("transitionend", function onEnd() {
    element.removeEventListener("transitionend", onEnd);
    done();
  });
};

const mobileAfterLeave = (el: Element) => {
  const element = el as HTMLElement;
  resetElementStyles(element, [
    STYLE_PROPS.transform,
    STYLE_PROPS.opacity,
    STYLE_PROPS.transition,
  ]);
};

const handleItemClick = (
  item: MainMenuItem | MenuGroup,
  closeSupport = false,
) => {
  // When collapsed, don't handle item clicks - let the menu expand instead
  if (isCollapsed.value) return;

  if (item.disabled) return;

  if (item.type === "group") {
    // Groups can only be toggled, not selected
    toggleGroup(item);
    return;
  }

  // Close support menu if this item is from the bottom menu
  if (closeSupport) {
    showSupportMenu.value = false;
  }

  // Only emit item-click for selectable items (not groups)
  emit("item-click", item);
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit("toggle-collapse", isCollapsed.value);
};

const toggleGroup = (group: MenuGroup) => {
  if (expandedGroups.value.has(group.id)) {
    expandedGroups.value.delete(group.id);
  } else {
    expandedGroups.value.add(group.id);
  }
  emit("toggle-group", group);
};

const toggleSupportMenu = () => {
  if (
    !showSupportMenu.value &&
    supportButtonRef.value &&
    menuContainerRef.value
  ) {
    // Calculate position before showing - use menu container for exact width and alignment
    const menuRect = menuContainerRef.value.getBoundingClientRect();
    const buttonRect = supportButtonRef.value.getBoundingClientRect();
    supportMenuPosition.value = {
      top: buttonRect.top,
      left: menuRect.left, // Align with menu's left edge
      width: menuRect.width, // Match menu's exact width
    };
  }
  showSupportMenu.value = !showSupportMenu.value;
};

// Handle click outside to close support menu
const handleClickOutside = (event: MouseEvent) => {
  if (!showSupportMenu.value) return;

  const target = event.target as Node;

  // Check if click is outside both the menu and the button
  if (
    supportMenuRef.value &&
    !supportMenuRef.value.contains(target) &&
    supportButtonRef.value &&
    !supportButtonRef.value.contains(target)
  ) {
    showSupportMenu.value = false;
  }
};

// Set up click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const isGroupExpanded = (groupId: string) => {
  return expandedGroups.value.has(groupId);
};

const isGroupActive = (group: MenuGroup) => {
  // Group is active only in collapsed mode when any of its children are active
  return (
    isCollapsed.value &&
    group.children.some((child) => child.id === props.activeItemId)
  );
};

const handleMenuClick = () => {
  if (isCollapsed.value) {
    isCollapsed.value = false;
    emit("toggle-collapse", false);
  }
};
</script>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Ensure mobile menu doesn't interfere with scrolling */
@media (max-width: 600px) {
  body {
    padding-bottom: 4rem; /* Space for bottom nav */
  }
}
</style>
