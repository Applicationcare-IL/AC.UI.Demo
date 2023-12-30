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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { useI18n } from "vue-i18n";

const { getLicensing } = useLicensing();
const i18n = useI18n();

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
      .getPermissions()
      .then(() => (loadingPermissions.value = false));
  } else {
    loadingPermissions.value = false;
  }
});
</script>

<style scoped></style>
