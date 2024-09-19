<template>
  <div class="layout-topbar flex justify-content-between flex-wrap md:flex-nowrap">
    <div class="flex justify-content-between align-items-center mx-3 w-full md:w-auto">
      <router-link :to="logoRedirectLink">
        <img src="@/assets/images/logo.png" alt="EasyMaze small logo" />
      </router-link>

      <img v-if="orgLogo" :src="orgLogo" alt="Client logo" class="client-logo md:hidden" />
    </div>
    <div class="hidden md:flex" :class="layoutConfig.isRTL.value ? 'ml-auto' : 'mr-auto'">
      <WMTopTaskSummary />
    </div>
    <WMGlobalSearchBox
      v-model="searchValue"
      :class="layoutConfig.isRTL.value ? 'ml-auto' : 'mr-auto'"
    />

    <div class="hidden md:block mx-6">
      <div class="layout-topbar-menu gap-1" :class="topbarMenuClasses">
        <li
          class="topbar-item notifications ml-2"
          :class="{
            'active-item': activeTopbarItem === 'notifications',
          }"
        >
          <a href="#" @click="onTopbarItemClick($event, 'notifications')">
            <div v-if="unreadNotifications" class="notification-badge" />
            <Button
              type="button"
              class="border-none bg-transparent px-1 outline-none relative"
              style="box-shadow: none"
            >
              <img alt="logo" src="/icons/notifications_bell.svg" style="height: 26px" />
            </Button>
          </a>
        </li>

        <ul
          class="item-menu-dropdown"
          style="min-width: 500px"
          :class="{
            active: activeTopbarItem === 'notifications',
            'layout-rtl': layoutConfig.isRTL.value,
          }"
        >
          <h2 class="h2">Notifications</h2>
          <pre>{{ notifications }}</pre>

          <template v-for="(notification, key) in notifications" :key="key">
            <WMNotification :notification="notification" />
            <Divider v-if="key < notifications.length - 1" />
          </template>
        </ul>

        <li class="topbar-item profile" :class="{ 'active-item': activeTopbarItem === 'profile' }">
          <a
            href="#"
            class="flex flex-row flex align-items-center gap-2"
            @click="onTopbarItemClick($event, 'profile')"
          >
            <span class="h6 text-gray-800">
              {{ authStore.user?.name }} {{ authStore.user?.surname }}</span
            >
            <img alt="logo" src="/icons/user.svg" class="profile-image" />
          </a>
        </li>

        <ul
          class="item-menu-dropdown"
          :class="{
            active: activeTopbarItem === 'profile',
            'layout-rtl': layoutConfig.isRTL.value,
          }"
        >
          <li role="menuitem" class="flex gap-2 align-items-center">
            <div class="flex" v-html="LanguageIcon" />
            <SelectButton
              v-model="value"
              class="flex p-selectbutton--small p-selectbutton--orange"
              :options="options"
              aria-labelledby="basic"
              :allow-empty="false"
              @change="onLanguageChange"
            />
          </li>

          <Divider />

          <li v-if="can('global.admin_zone')" role="menuitem">
            <AppAdminSwitcher />
          </li>

          <Divider v-if="can('global.admin_zone')" />

          <li role="menuitem ">
            <a href="#" class="flex gap-2" @click="authStore.logout">
              <div class="flex" v-html="ExitIcon" />
              {{ $t("navigation.logout") }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useWindowSize } from "@vueuse/core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import ExitIcon from "/icons/exit.svg?raw";
import LanguageIcon from "/icons/language.svg?raw";
import { i18n, loadLocaleMessages, setI18nLanguage } from "@/i18n";
import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";

import AppAdminSwitcher from "./AppAdminSwitcher.vue";

// DEPENDENCIES
const orgLogo = import.meta.env.VITE_ADMIN_URL + "/storage/logos/login.png?cache=false";

const { layoutConfig } = useLayout();
const authStore = useAuthStore();
const { can } = usePermissions();
const { width } = useWindowSize();
const { getMessages } = useMessages();

// INJECT

// PROPS, EMITS
defineProps({
  activeTopbarItem: String,
});

const emit = defineEmits(["topbar-item-click"]);

// REFS
const value = ref("He");
const options = ref(["En", "He"]);
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const searchValue = ref("");

const notifications = ref([]);

// COMPUTED
const logoRedirectLink = computed(() => {
  if (width.value < 768) {
    return "/dashboard";
  } else {
    return "/";
  }
});

const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarMenuActive.value,
  };
});

const unreadNotifications = computed(() => {
  return notifications.value.some((notification) => !notification.read);
});

// COMPONENT METHODS AND LOGIC
const onTopbarItemClick = (event, item) => {
  emit("topbar-item-click", { originalEvent: event, item: item });
  event.preventDefault();
};

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

const onLanguageChange = (event) => {
  loadLocaleMessages(i18n.global, event.value.toLowerCase());
  setI18nLanguage(i18n.global, event.value.toLowerCase());
  layoutConfig.isRTL.value = event.value.toLowerCase() === "he";
};

const setCurrentLanguage = () => {
  value.value = i18n.global.locale.value === "he" ? "He" : "En";
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  bindOutsideClickListener();
  setCurrentLanguage();

  getMessages({ entity_type: "employee", entity_id: authStore.user.id }).then((response) => {
    notifications.value = response.data;
  });
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});
</script>

<style lang="scss" scoped>
.client-logo {
  max-width: 130px;
  height: auto;
  max-height: 60px;
}

.topbar-item {
  padding: 8px;
  border-radius: 8px;

  &.active-item,
  &:hover {
    background-color: var(--orange-100);
  }
}

.profile-image {
  width: 32px;
  height: 32px;
}

.item-menu-dropdown {
  display: none;
  flex-direction: column;
  background-color: white;
  box-shadow: 1px 6px 8px 0px rgba(0, 0, 0, 0.14);
  overflow-y: auto;
  min-width: initial;
  max-width: initial;
  top: 60px !important; // topbar height
  width: 360px;
  position: fixed;
  right: 0;
  padding: 20px 48px 48px 48px;
  list-style: none;

  border-radius: 0px 0px 0px 40px;

  &.layout-rtl {
    right: -3rem !important;
    left: 0;
    border-radius: 0px 0px 40px 0;
  }

  &.active {
    display: flex;
  }

  li a {
    color: var(--orange-500);
    text-decoration: underline;
  }
}

.notifications-dropdown {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.notification-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: var(--orange-500);
  width: 10px;
  height: 10px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>
