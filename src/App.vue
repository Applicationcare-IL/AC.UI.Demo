<template>
  <div
    v-if="loading"
    class="flex flex-column justify-content-center h-screen align-items-center"
  >
    <ProgressSpinner />
    <p v-if="loadingOptionSets" class="ml-2">Preloading option sets</p>
    <p v-if="loadingPermissions" class="ml-2">Preloading permissions</p>
  </div>
  <router-view v-else />
  <ConfirmDialog :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''" />
  <!-- why is this here? https://stackoverflow.com/questions/74525054/primevue-confirmdialog-opens-multiple-times -->
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";
import { usePermissionsStore } from "@/stores/permissionsStore";

const { layoutConfig } = useLayout();

const { getLicensing } = useLicensing();

const optionSetsStore = useOptionSetsStore();
const permissionsStore = usePermissionsStore();
const loadingOptionSets = ref(true);
const loadingPermissions = ref(true);

const loading = computed(
  () => loadingOptionSets.value || loadingPermissions.value
);

onMounted(() => {
  getLicensing();

  if (!optionSetsStore.isOptionSetsPreloaded) {
    optionSetsStore
      .preloadOptionSets()
      .then(() => (loadingOptionSets.value = false));
  } else {
    loadingOptionSets.value = false;
  }
  if (!permissionsStore.isPermissionsLoaded) {
    permissionsStore
      .getPermissionsFromApi()
      .then(() => (loadingPermissions.value = false));
  } else {
    loadingPermissions.value = false;
  }
});
</script>

<style scoped></style>
