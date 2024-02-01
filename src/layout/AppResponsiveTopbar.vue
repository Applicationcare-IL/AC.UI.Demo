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
            <span class="font-semibold text-2xl text-secondary">Menu</span>
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
                <span class="h5">TASKS</span>
              </div>
              <ul
                class="list-none pl-2 m-0 overflow-hidden flex flex-column gap-2"
              >
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-home mr-2"></i>
                    <span class="font-medium">My open tasks</span>
                  </a>
                </li>
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-bookmark mr-2"></i>
                    <span class="font-medium">My closed tasks</span>
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
                <span class="h5">SERVICES</span>
              </div>
              <ul
                class="list-none pl-2 m-0 overflow-hidden flex flex-column gap-2"
              >
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-home mr-2"></i>
                    <span class="font-medium">New service</span>
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
                <span class="h5">USER</span>
              </div>
              <ul
                class="list-none pl-2 m-0 overflow-hidden flex flex-column gap-2"
              >
                <li>
                  <a
                    class="flex align-items-center cursor-pointer p-1 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
                  >
                    <i class="pi pi-home mr-2"></i>
                    <span class="font-medium">Logout</span>
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

import { i18n } from "@/i18n";
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();

const visible = ref(false);
</script>

<style lang="scss" scoped>
.mobile-topbar {
  background: whitesmoke;
}

span.flag {
  width: 30px;
  height: 21px;
}
</style>
