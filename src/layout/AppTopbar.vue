<template>
  <div class="layout-topbar flex justify-content-between flex-wrap md:flex-nowrap">
    <div class="flex justify-content-between align-items-center mx-3 w-full md:w-auto">
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
    <div class="hidden md:flex ml-auto">
      <WMTopTaskSummary />
    </div>
    <WMGlobalSearchBox v-model="searchValue" class="ml-auto" />

    <div class="hidden md:block mx-6">
      <div class="layout-topbar-menu" :class="topbarMenuClasses">
        <li
          class="topbar-item notifications ml-2"
          :class="{
            'active-topmenuitem': activeTopbarItem === 'notifications',
          }"
        >
          <a href="#" @click="onTopbarItemClick($event, 'notifications')">
            <Button
              type="button"
              class="border-none bg-transparent px-1 outline-none"
              style="box-shadow: none"
            >
              <img alt="logo" src="/icons/notifications_bell.svg" style="height: 26px" />
              <!-- <Badge
                value="1"
                class="topbar-badge notifications-badge p-badge-warning"
              ></Badge> -->
            </Button>
          </a>

          <!-- <ul class="notifications-dropdown fadeInDown p-4">
            <li class="layout-submenu-header flex flex-row justify-content-between">
              <h6 class="header-text">There are no notifications</h6>
              <span class="p-badge">3</span>
            </li>
            <li role="menuitem">
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
            </li>
          </ul> -->
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
            <span class="h6 text-gray-800"
              >{{ authStore.user?.name }} {{ authStore.user?.surname }}</span
            >
            <img alt="logo" src="/icons/user.svg" class="profile-image" />
          </a>
        </li>

        <ul class="profile-dropdown" :class="{ active: activeTopbarItem === 'profile' }">
          <li role="menuitem" class="flex gap-2 align-items-center">
            <div class="flex" v-html="LanguageIcon" />
            <SelectButton
              v-model="value"
              class="flex p-selectbutton--small p-selectbutton--orange"
              :options="options"
              aria-labelledby="basic"
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
import { useI18n } from "vue-i18n";

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

  &:hover {
    background-color: var(--orange-100);
  }
}

.profile-image {
  width: 32px;
  height: 32px;
}

.profile-dropdown {
  display: none;
  flex-direction: column;
  background-color: white;
  border-radius: 0px 0px 40px 0;
  box-shadow: 1px 6px 8px 0px rgba(0, 0, 0, 0.14);
  overflow-y: auto;
  min-width: initial;
  max-width: initial;
  top: 60px !important; // topbar height
  width: 360px;
  position: fixed;
  left: 0;
  right: -3rem !important; // margin of the wrapper
  padding: 20px 48px 48px 48px;
  list-style: none;

  &.active {
    display: flex;
  }

  li a {
    color: var(--orange-500);
    text-decoration: underline;
  }
}
</style>
