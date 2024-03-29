<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { usePermissionsStore } from "@/stores/permissionsStore";

import AppMenuItem from "./AppMenuItem.vue";

const { t } = useI18n();
const { checkIfEntityIsActive } = useLicensing();
const permissionsStore = usePermissionsStore();
const { can } = usePermissions();

function getImageUrl(path) {
  return new URL(path, import.meta.url).href;
}

const model = ref([
  {
    // User Panel
    visible: true,
    section: "user",
    items: [
      {
        label: computed(() => t("navigation.dashboard")),
        to: "/dashboard",
        image: new URL("/icons/nav/dashboard.svg", import.meta.url).href,
        visibility: true,
      },
      {
        label: computed(() => t("navigation.customers")),
        to: "/customers",
        image: new URL("/icons/nav/customers.svg", import.meta.url).href,
        visibility: checkIfEntityIsActive("customers") && can("customers.read"),
      },
      {
        label: computed(() => t("navigation.contacts")),
        to: "/contacts",
        image: new URL("/icons/nav/contacts.svg", import.meta.url).href,
        visibility: checkIfEntityIsActive("contacts") && can("contacts.read"),
      },
      {
        label: computed(() => t("navigation.services")),
        to: "/services",
        image: new URL("/icons/nav/services.svg", import.meta.url).href,
        visibility: checkIfEntityIsActive("services") && can("services.read"),
      },
      {
        label: computed(() => t("navigation.tasks")),
        to: "/tasks",
        image: new URL("/icons/nav/tasks.svg", import.meta.url).href,
        visibility: checkIfEntityIsActive("tasks") && can("tasks.read"),
      },
      {
        label: computed(() => t("navigation.sales")),
        to: "/projects",
        image: new URL("/icons/nav/sales.svg", import.meta.url).href,
        visibility: false,
      },
      {
        label: computed(() => t("navigation.projects")),
        to: "/projects",
        image: new URL("/icons/nav/projects.svg", import.meta.url).href,
        visibility: checkIfEntityIsActive("projects") && can("projects.read"),
      },
      {
        label: computed(() => t("navigation.assets")),
        to: "/assets_list",
        image: new URL("/icons/nav/assets.svg", import.meta.url).href,
        visibility: checkIfEntityIsActive("assets") && can("assets.read"),
      },
    ],
  },
  {
    //Admin Panel
    visible: false,
    section: "admin",
    items: [
      {
        label: "Headers",
        to: "/Headers",
        image: "/icons/add_customer_active.svg",
      },
      {
        label: "Buttons",
        to: "/Buttons",
        image: "/icons/add_customer_active.svg",
      },
      {
        label: "Tables",
        to: "/Tables",
        image: "/icons/add_customer_active.svg",
      },
    ],
  },
]);
</script>

<style lang="scss" scoped></style>
