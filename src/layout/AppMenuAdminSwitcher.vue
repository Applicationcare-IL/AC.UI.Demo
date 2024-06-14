<template>
  <template v-for="(item, i) in items" :key="item">
    <AppMenuItem v-if="!item.separator" :item="item" :index="i"></AppMenuItem>
  </template>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "../stores/utils";
import AppMenuItem from "./AppMenuItem.vue";

const utilsStore = useUtilsStore();
const { adminZone } = storeToRefs(utilsStore);

const { t } = useI18n();

const switchAdminZone = () => {
  utilsStore.setAdminZoneState(!adminZone.value);
};

const items = ref([
  {
    visible: true,
    section: "adminSwitcher",
    items: [
      {
        label: computed(() =>
          adminZone.value ? t("navigation.user-panel") : t("navigation.admin-panel")
        ),
        to: computed(() => (adminZone.value ? "/dashboard" : "/admin")),
        type: "switcher",
        function: () => switchAdminZone(),
        image: new URL("/icons/nav/dashboard.svg", import.meta.url).href,
        visibility: true,
      },
    ],
  },
]);
</script>

<style lang="scss" scoped></style>
