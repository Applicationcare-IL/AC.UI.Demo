<template>
  <a class="cursor-pointer flex gap-2" @click="handleClick()">
    <div class="flex" v-html="UnionIcon" />
    {{ label }}
  </a>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import UnionIcon from "/icons/union.svg?raw";

import { useUtilsStore } from "../stores/utils";

const router = useRouter();

const utilsStore = useUtilsStore();
const { adminZone } = storeToRefs(utilsStore);

const { t } = useI18n();

const switchAdminZone = () => {
  utilsStore.setAdminZoneState(!adminZone.value);
};

const label = computed(() =>
  adminZone.value ? t("navigation.user-panel") : t("navigation.admin-panel")
);

const to = computed(() => (adminZone.value ? "/dashboard" : "/admin"));

const handleClick = () => {
  router.push(to.value);
  switchAdminZone();
};
</script>

<style lang="scss" scoped></style>
