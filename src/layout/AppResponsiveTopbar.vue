<template>
  <div
    class="mobile-topbar p-2 flex justify-content-between align-items-center"
  >
    <div class="lang">
      <div class="flex flex-row gap-2">
        <i-button
          @click="
            loadLocaleMessages(i18n.global, 'en');
            setI18nLanguage(i18n.global, 'en');
            layoutConfig.isRTL.value = false;
          "
        >
          <span class="flag flag-gb"></span
        ></i-button>
        <i-button
          @click="
            loadLocaleMessages(i18n.global, 'he');
            setI18nLanguage(i18n.global, 'he');
            layoutConfig.isRTL.value = true;
          "
        >
          <span class="flag flag-il"></span
        ></i-button>
      </div>
    </div>

    <Button icon="pi pi-bars" severity="secondary" @click="visible = true" />
  </div>
  <Sidebar v-model:visible="visible">
    <template #container="{ closeCallback }">
      <div class="flex flex-column h-full">
        <div
          class="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0"
        >
          <span class="inline-flex align-items-center gap-2">
            <span class="font-semibold text-2xl text-secondary">{{
              $t("mobile.menu")
            }}</span>
          </span>
          <span>
            <Button
              type="button"
              icon="pi pi-times"
              rounded
              outlined
              severity="secondary"
              class="h-2rem w-2rem"
              @click="closeCallback"
            ></Button>
          </span>
        </div>
        <div class="overflow-y-auto">
          <ul class="list-none p-3 pb-0 m-0">
            <li>
              <div
                class="p-2 flex align-items-center justify-content-between text-600 cursor-pointer p-ripple"
              >
                <span class="h5">{{ $t("navigation.tasks") }}</span>
              </div>
              <ul
                class="list-none pl-2 m-0 overflow-hidden flex flex-column gap-2"
              >
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-inbox mr-2"></i>
                    <router-link
                      :to="{ name: 'myOpenTasksMobile' }"
                      class="nav-link"
                      @click="closeCallback"
                    >
                      {{ $t("navigation.my-open-tasks") }}
                    </router-link>
                  </a>
                </li>
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-times mr-2"></i>
                    <router-link
                      :to="{ name: 'myClosedTasksMobile' }"
                      class="nav-link"
                      @click="closeCallback"
                    >
                      {{ $t("navigation.my-closed-tasks") }}
                    </router-link>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="list-none p-3 pb-0 m-0">
            <li>
              <div
                class="p-2 flex align-items-center justify-content-between text-600 cursor-pointer p-ripple"
              >
                <span class="h5">{{ $t("navigation.services") }}</span>
              </div>
              <ul
                class="list-none pl-2 m-0 overflow-hidden flex flex-column gap-2"
              >
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-plus-circle mr-2"></i>

                    <router-link
                      to="/create-new-service"
                      class="nav-link"
                      @click="closeCallback"
                    >
                      {{ $t("navigation.new-service") }}
                    </router-link>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="list-none p-3 m-0">
            <li>
              <div
                class="p-2 flex align-items-center justify-content-between text-600 cursor-pointer p-ripple"
              >
                <span class="h5"> {{ $t("navigation.user") }} </span>
              </div>
              <ul
                class="list-none pl-2 m-0 overflow-hidden flex flex-column gap-2"
              >
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-sign-out mr-2"></i>
                    <span class="font-medium" @click="authStore.logout">
                      {{ $t("navigation.logout") }}
                    </span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Sidebar>
</template>

<script setup>
import { ref } from "vue";

import { i18n, loadLocaleMessages, setI18nLanguage } from "@/i18n";
import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";

const { layoutConfig } = useLayout();

const visible = ref(false);

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
.mobile-topbar {
  background: whitesmoke;
}

span.flag {
  width: 30px;
  height: 21px;
}

.nav-link {
  color: var(--surface-700) !important;
}
</style>
