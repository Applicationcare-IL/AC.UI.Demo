<template>
  <Toast />
  <div
    class="layout-wrapper"
    :class="containerClass"
    @click="onDocumentClick($event)"
  >
    <AppResponsiveTopbar v-if="width <= 768" />

    <AppTopbar
      class="hidden md:flex"
      :active-topbar-item="activeTopbarItem"
      @topbar-item-click="onTopbarItemClick"
    />

    <div
      class="layout-sidebar hidden md:flex"
      :class="{ expanded: isExpanded }"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <AppSidebar />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <app-footer></app-footer>
    </div>
    <app-config></app-config>
    <div class="layout-mask"></div>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import { computed, ref, watch } from "vue";

import { useLayout } from "@/layout/composables/layout";

import AppConfig from "./AppConfig.vue";
import AppFooter from "./AppFooter.vue";
import AppResponsiveTopbar from "./AppResponsiveTopbar.vue";
import AppSidebar from "./AppSidebar.vue";
import AppTopbar from "./AppTopbar.vue";

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const { width } = useWindowSize();

const outsideClickListener = ref(null);

const activeTopbarItem = ref(null);
const topbarItemClick = ref(false);

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});

const containerClass = computed(() => {
  return {
    "layout-theme-light": layoutConfig.darkTheme.value === "light",
    "layout-theme-dark": layoutConfig.darkTheme.value === "dark",
    "layout-overlay": layoutConfig.menuMode.value === "overlay",
    "layout-static": layoutConfig.menuMode.value === "static",
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive.value &&
      layoutConfig.menuMode.value === "static",
    "layout-overlay-active": layoutState.overlayMenuActive.value,
    "layout-mobile-active": layoutState.staticMenuMobileActive.value,
    "p-input-filled": layoutConfig.inputStyle.value === "filled",
    "p-ripple-disabled": !layoutConfig.ripple.value,
    "layout-rtl": layoutConfig.isRTL.value,
  };
});
const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive.value = false;
        layoutState.staticMenuMobileActive.value = false;
        layoutState.menuHoverActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  const sidebarEl = document.querySelector(".layout-sidebar");
  const topbarEl = document.querySelector(".layout-menu-button");

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};

const onTopbarItemClick = (event) => {
  topbarItemClick.value = true;

  if (activeTopbarItem.value === event.item) {
    activeTopbarItem.value = null;
  } else {
    activeTopbarItem.value = event.item;
  }

  event.originalEvent.preventDefault();
};

const onDocumentClick = (event) => {
  if (!topbarItemClick.value) {
    activeTopbarItem.value = null;
  }

  topbarItemClick.value = false;
};

const isExpanded = ref(false);

const mouseover = () => {
  layoutConfig.isSidebarExpanded.value = true;
  isExpanded.value = true;
};

const mouseleave = () => {
  layoutConfig.isSidebarExpanded.value = false;
  isExpanded.value = false;
};
</script>

<style lang="scss" scoped></style>
