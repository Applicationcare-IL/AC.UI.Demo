<template>
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
    <!-- <p v-if="loadingPermissions" class="ml-2">Loading...</p> -->
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
import { usePermissionsStore } from "@/stores/permissionsStore";

import WMIncomingCallDialog from "./components/dialogs/WMIncomingCallDialog.vue";

// DEPENDENCIES
const authStore = useAuthStore();
const { layoutConfig } = useLayout();
const { getLicensing } = useLicensing();
const permissionsStore = usePermissionsStore();

// INJECT

// PROPS, EMITS

// REFS
const loadingPermissions = ref(true);
const showIncomingCallDialog = ref(false);
const callData = ref(null);

// COMPUTED
const loading = computed(() => loadingPermissions.value);

// COMPONENT METHODS AND LOGIC
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
onMounted(async () => {
  if (authStore.isAuthenticated) {
    getLicensing();

    if (!permissionsStore.isPermissionsLoaded) {
      loadingPermissions.value = await permissionsStore.fetchPermissionsFromApi();
    } else {
      loadingPermissions.value = false;
    }
  } else {
    loadingPermissions.value = false;
  }
});
</script>

<style scoped></style>
