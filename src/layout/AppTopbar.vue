<template>
  <div
    class="layout-topbar flex justify-content-between flex-wrap md:flex-nowrap"
  >
    <div
      class="flex justify-content-between align-items-center mx-3 w-full md:w-auto"
    >
      <router-link :to="logoRedirectLink">
        <!-- <img :src="logoUrl" alt="logo" /> -->
        <img src="@/assets/images/logo.png" alt="EasyMaze small logo" />
      </router-link>

      <img
        v-if="orgLogo"
        :src="orgLogo"
        alt="Client logo"
        class="client-logo md:hidden"
      />
    </div>
    <WMTopTaskSummary></WMTopTaskSummary>
    <WMGlobalSearchBox v-model="searchValue" />

    <div class="hidden md:flex mx-6">
      <div class="layout-topbar-menu" :class="topbarMenuClasses">
        <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
                                <i class="pi pi-bars"></i>
                            </button> -->
        <li
          class="topbar-item notifications ml-2"
          :class="{
            'active-topmenuitem': activeTopbarItem === 'notifications',
          }"
        >
          <a href="#" @click="onTopbarItemClick($event, 'notifications')">
            <Button type="button" class="border-none bg-white">
              <img
                alt="logo"
                src="/icons/notifications_bell.svg"
                class="h-2rem"
              />
              <!-- <Badge value="1" class="topbar-badge notifications-badge p-badge-warning"></Badge> -->
            </Button>
          </a>

          <ul class="notifications-dropdown fadeInDown p-4">
            <li
              class="layout-submenu-header flex flex-row justify-content-between"
            >
              <h6 class="header-text">There are no notifications</h6>
              <!-- <span class="p-badge">3</span> -->
            </li>
            <!-- <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <h6>Notification 1</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <h6>Notification 2</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <h6>Notification 3</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <div class="notifications-item">
                                        <h6>Notification 4</h6>
                                    </div>
                                </div>
                            </a>
                        </li> -->
          </ul>
        </li>

        <li
          class="topbar-item profile"
          :class="{ 'active-topmenuitem': activeTopbarItem === 'profile' }"
        >
          <a
            href="#"
            class="flex flex-row flex align-items-center gap-2"
            @click="onTopbarItemClick($event, 'profile')"
          >
            {{ authStore.user?.name }} {{ authStore.user?.surname }}
            <img alt="logo" src="/icons/user.svg" class="" />
          </a>

          <ul class="profile-dropdown fadeInDown p-4">
            <!-- <li class="layou ft-submenu-header flex flex-row justify-content-between">
                            <h6 class="header-text">Settings</h6>
                            <span class="p-badge"></span>
                        </li> -->
            <!-- <li role="menuitem">
              <a href="#" @click="onTopbarSubItemClick($event)">
                <div>
                  <h6>Settings</h6>
                </div>
              </a>
            </li> -->
            <li role="menuitem">
              <a href="#" @click="authStore.logout">
                <div class="notifications-item">
                  <h6 class="mb-0">Logout</h6>
                </div>
              </a>
            </li>
          </ul>
        </li>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";

const orgLogo =
  import.meta.env.VITE_ADMIN_URL + "/storage/logos/login.png?cache=false";

const authStore = useAuthStore();

const emit = defineEmits(["topbar-item-click"]);

const { layoutConfig, onMenuToggle, contextPath } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const searchValue = ref("");

defineProps({
  activeTopbarItem: String,
});

const { width } = useWindowSize();

const logoRedirectLink = computed(() => {
  if (width.value < 768) {
    return "/dashboard";
  } else {
    return "/";
  }
});

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const logoUrl = computed(() => {
  return `${contextPath}Logo.svg`;
});

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};

const onTopbarItemClick = (event, item) => {
  emit("topbar-item-click", { originalEvent: event, item: item });
  event.preventDefault();
};

const onTopbarSubItemClick = (event) => {
  emit("topbar-subitem-click", { originalEvent: event, item: item });
  event.preventDefault();
};

const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
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
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
</script>

<style lang="scss" scoped>
.client-logo {
  max-width: 130px;
  height: auto;
}
</style>
