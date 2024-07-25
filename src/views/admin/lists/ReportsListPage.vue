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
        @new-user-created="handleNewUserCreated"
      />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminReportsTable ref="adminUserTable" @update:selection="onSelectionChanged" />
  </div>

  <!-- <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      :value="scripts"
      lazy
      paginator
      scrollable
      scroll-height="flex"
      :rows="selectedRowsPerPage"
      :first="0"
      :total-records="totalRecords"
      :loading="loading"
      @page="onPage($event)"
    >
      <Column field="id" :header="$t('scripts.id')">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'scriptDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.id }}
          </router-link>
        </template>
      </Column>
      <Column field="name" :header="$t('scripts.name')" />
      <Column field="hash" :header="$t('scripts.hash')" />
      <Column field="is_active" :header="$t('scripts.is-active')" />
      <Column field="flowmaze_id" :header="$t('scripts.flowmaze-id')" />
    </DataTable>
  </div> -->
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { selectedRowsPerPage } = useListUtils();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const reports = ref([]);

const isVisible = ref(false);

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

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
