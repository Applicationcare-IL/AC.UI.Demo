<template>
  <WMListSubHeader
    entity="scripts"
    :show-filter-button="false"
    :show-search-bar="false"
    :show-communications="false"
    :has-action-builder="false"
    :total-records="totalRecords"
  >
    <template #custom-buttons>
      <WMButton :text="$t('scripts.sync-scripts')" type="secondary" @click="handleSyncScripts" />
    </template>
  </WMListSubHeader>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
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
      <Column field="id" :header="$t('scripts.id')" />
      <Column field="name" :header="$t('scripts.name')" />
      <Column field="hash" :header="$t('scripts.hash')" />
      <Column field="is_active" :header="$t('scripts.is-active')" />
      <Column field="flowmaze_id" :header="$t('scripts.flowmaze-id')" />
    </DataTable>
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { selectedRowsPerPage } = useListUtils();
const { getScripts, syncScripts } = useAdminFlowmaze();

// INJECT

// PROPS, EMITS

// REFS
const scripts = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Scripts",
});

const loadLazyData = () => {
  loading.value = true;

  const nextPage = lazyParams.value.page ? lazyParams.value.page + 1 : 0;

  const params = new URLSearchParams({
    page: nextPage,
    per_page: selectedRowsPerPage.value,
  });

  getScripts(params).then((result) => {
    scripts.value = result.data;
    totalRecords.value = result.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const handleSyncScripts = () => {
  syncScripts().then(() => {
    loadLazyData();
  });
};

loadLazyData();

utilsStore.entity = "scripts";

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
