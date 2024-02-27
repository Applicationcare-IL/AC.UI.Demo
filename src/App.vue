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
  <WMIncomingCallDialog
    v-if="showIncomingCallDialog"
    v-model="showIncomingCallDialog"
    :call-data="callData"
  />
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useAuthStore } from "@/stores/auth";
import { useOptionSetsStore } from "@/stores/optionSets";
import { usePermissionsStore } from "@/stores/permissionsStore";

import WMIncomingCallDialog from "./components/dialogs/WMIncomingCallDialog.vue";

// DEPENDENCIES
const authStore = useAuthStore();
const { layoutConfig } = useLayout();
const { getLicensing } = useLicensing();
const optionSetsStore = useOptionSetsStore();
const permissionsStore = usePermissionsStore();

// INJECT

// PROPS, EMITS

// REFS
const loadingOptionSets = ref(true);
const loadingPermissions = ref(true);
const showIncomingCallDialog = ref(false);
const callData = ref(null);

// COMPUTED
const loading = computed(
  () => loadingOptionSets.value || loadingPermissions.value
);

// COMPONENT METHODS
if (window.Echo) {
  window.Echo.channel(`employee.${authStore.user?.virtual_extension}`).listen(
    ".call.incoming",
    (data) => {
      showIncomingCallDialog.value = true;
      callData.value = data;
    }
  );
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (authStore.isAuthenticated) {
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
  } else {
    loadingOptionSets.value = false;
    loadingPermissions.value = false;
  }
});
</script>

<style scoped></style>
