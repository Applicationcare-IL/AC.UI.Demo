<template>
  <WMListSubHeader
    entity="admin-report"
    :show-filter-button="false"
    :show-search-bar="false"
    :show-communications="false"
    :has-action-builder="false"
    @new="toggleSidebarVisibility"
  />

  <WMSidebar :visible="isVisible" name="newAdminReport" @close-sidebar="closeSidebar">
    <template v-if="can('admin-reports.create')">
      <WMNewEntityFormHeader entity="admin-report" name="newAdminReport" />
      <WMNewAdminReportForm
        :is-sidebar="true"
        @close-sidebar="closeSidebar"
        @new-report-created="handleNewReportCreated"
      />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminReportsTable ref="adminReportsTable" @update:selection="onSelectionChanged" />
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const isVisible = ref(false);
const adminReportsTable = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Reports",
});

utilsStore.entity = "admin-report";

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const handleNewReportCreated = () => {
  console.log("handleNewReportCreated");
  adminReportsTable.value.loadLazyData();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
