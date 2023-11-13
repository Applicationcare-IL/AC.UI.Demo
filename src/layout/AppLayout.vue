<script setup>
import { computed, watch, ref } from "vue";
import AppTopbar from "./AppTopbar.vue";
import AppFooter from "./AppFooter.vue";
import AppSidebar from "./AppSidebar.vue";
import AppConfig from "./AppConfig.vue";
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

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

<template>
  <Toast />
  <div
    class="layout-wrapper"
    :class="containerClass"
    @click="onDocumentClick($event)"
  >
    <app-topbar
      @topbar-item-click="onTopbarItemClick"
      :activeTopbarItem="activeTopbarItem"
    ></app-topbar>
    <div
      class="layout-sidebar"
      :class="{ expanded: isExpanded }"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <app-sidebar></app-sidebar>
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

<style lang="scss" scoped></style>
