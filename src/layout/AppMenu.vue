<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <AppMenuItem :item="item" :index="i" />
    </template>
  </ul>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "../stores/utils";
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
          label: t("navigation.users"),
          to: "/admin/users",
          image: new URL("/icons/nav/person.svg", import.meta.url).href,
          visibility: true,
        },
        {
          label: t("navigation.teams"),
          to: "/admin/teams",
          image: new URL("/icons/nav/groups.svg", import.meta.url).href,
          visibility: true,
        },
        // {
        //   label: t("navigation.roles"),
        //   to: "/admin/roles",
        //   image: new URL("/icons/nav/badge.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.permissions"),
        //   to: "/admin/permissions",
        //   image: new URL("/icons/nav/clinical_notes.svg", import.meta.url).href,
        //   visibility: true,
        // },

        // {
        //   divider: true,
        // },
        // {
        //   label: t("navigation.processes"),
        //   to: "/admin/processes",
        //   image: new URL("/icons/nav/mediation.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.classifications"),
        //   to: "/admin/classifications",
        //   image: new URL("/icons/nav/category.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.sla-settings"),
        //   to: "/admin/sla-settings",
        //   image: new URL("/icons/nav/alarm.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.task-settings"),
        //   to: "/admin/task-settings",
        //   image: new URL("/icons/nav/view_list.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.quick-codes"),
        //   to: "/admin/quick-codes",
        //   image: new URL("/icons/nav/bolt.svg", import.meta.url).href,
        //   visibility: true,
        // },

        // {
        //   divider: true,
        // },
        // {
        //   label: t("navigation.messages"),
        //   to: "/admin/messages",
        //   image: new URL("/icons/nav/comment.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.option-sets"),
        //   to: "/admin/option-sets",
        //   image: new URL("/icons/nav/data_table.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.triggers"),
        //   to: "/admin/triggers",
        //   image: new URL("/icons/nav/settings_remote.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.dynamic-attributes"),
        //   to: "/admin/dynamic-attributes",
        //   image: new URL("/icons/nav/contextual_token.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.url-action-builder"),
        //   to: "/admin/url-action-builder",
        //   image: new URL("/icons/nav/build.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   divider: true,
        // },
        // {
        //   label: t("navigation.import"),
        //   to: "/admin/import",
        //   image: new URL("/icons/nav/import.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.translations"),
        //   to: "/admin/translations",
        //   image: new URL("/icons/nav/language.svg", import.meta.url).href,
        //   visibility: true,
        // },
        // {
        //   label: t("navigation.system-settings"),
        //   to: "/admin/system-settings",
        //   image: new URL("/icons/nav/settings.svg", import.meta.url).href,
        //   visibility: true,
        // },
        {
          divider: true,
        },
        {
          label: t("navigation.scripts"),
          to: "/admin/scripts",
          image: new URL("/icons/nav/reports.svg", import.meta.url).href,
          visibility: can("reports.read"),
        },
        {
          label: t("navigation.reports"),
          to: "/admin/reports",
          image: new URL("/icons/nav/reports.svg", import.meta.url).href,
          visibility: true,
        },
        {
          label: t("navigation.schema"),
          to: "/admin/schema",
          image: new URL("/icons/nav/reports.svg", import.meta.url).href,
          visibility: true,
        },
      ],
    },
  ];
});

const setCorrectMenuBasedOnUrl = () => {
  const url = window.location.pathname;
  if (url.includes("/admin")) {
    adminZone.value = true;
  } else {
    adminZone.value = false;
  }
};

onMounted(() => {
  setCorrectMenuBasedOnUrl();
});
</script>

<style lang="scss" scoped></style>
