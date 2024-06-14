<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="i"></AppMenuItem>
      <Divider v-if="item.separator" />
    </template>
    <Divider v-if="can('global.admin_zone')" />
    <AppMenuAdminSwitcher v-if="can('global.admin_zone')" />
  </ul>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "../stores/utils";
import AppMenuAdminSwitcher from "./AppMenuAdminSwitcher.vue";
import AppMenuItem from "./AppMenuItem.vue";

const utilsStore = useUtilsStore();

const { adminZone } = storeToRefs(utilsStore);

const { t } = useI18n();
const { checkIfEntityIsActive } = useLicensing();
const { can } = usePermissions();

const model = computed(() => {
  return [
    {
      // User Panel
      visible: !adminZone.value,
      section: "user",
      items: [
        {
          label: t("navigation.dashboard"),
          to: "/dashboard",
          image: new URL("/icons/nav/dashboard.svg", import.meta.url).href,
          visibility: true,
        },
        {
          label: t("navigation.customers"),
          to: "/customers",
          image: new URL("/icons/nav/customers.svg", import.meta.url).href,
          visibility: checkIfEntityIsActive("customers") && can("customers.read"),
        },
        {
          label: t("navigation.contacts"),
          to: "/contacts",
          image: new URL("/icons/nav/contacts.svg", import.meta.url).href,
          visibility: checkIfEntityIsActive("contacts") && can("contacts.read"),
        },
        {
          label: t("navigation.services"),
          to: "/services",
          image: new URL("/icons/nav/services.svg", import.meta.url).href,
          visibility: checkIfEntityIsActive("services") && can("services.read"),
        },
        {
          label: t("navigation.tasks"),
          to: "/tasks",
          image: new URL("/icons/nav/tasks.svg", import.meta.url).href,
          visibility: checkIfEntityIsActive("tasks") && can("tasks.read"),
        },
        {
          label: t("navigation.sales"),
          to: "/projects",
          image: new URL("/icons/nav/sales.svg", import.meta.url).href,
          visibility: false,
        },
        {
          label: t("navigation.projects"),
          to: "/projects",
          image: new URL("/icons/nav/projects.svg", import.meta.url).href,
          visibility: checkIfEntityIsActive("projects") && can("projects.read"),
        },
        {
          label: t("navigation.assets"),
          to: "/assets_list",
          image: new URL("/icons/nav/assets.svg", import.meta.url).href,
          visibility: checkIfEntityIsActive("assets"),
        },
        {
          label: t("navigation.reports"),
          to: "/reports",
          image: new URL("/icons/nav/reports.svg", import.meta.url).href,
          visibility: can("reports.read"),
        },
      ],
    },
    {
      //Admin Panel
      visible: adminZone.value,
      section: "admin",
      items: [
        {
          label: t("navigation.scripts"),
          to: "/admin/scripts",
          image: new URL("/icons/nav/reports.svg", import.meta.url).href,
          visibility: can("reports.read"),
        },
      ],
    },
  ];
});
</script>

<style lang="scss" scoped></style>
