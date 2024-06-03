<template>
  <WMListSubHeader
    :total-records="totalRecords"
    entity="project"
    :show-header="false"
    @refresh-table="loadLazyData()"
  />
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      ref="dt"
      lazy
      :value="projects"
      data-key="project_id"
      paginator
      scrollable
      scroll-height="flex"
      :rows="rows"
      :first="0"
      :total-records="totalRecords"
      :loading="loading"
      @page="onPage($event)"
    >
      <Column>
        <template #body="slotProps">
          <img
            src="/icons/eye.svg"
            alt=""
            class="vertical-align-middle"
            @click="displayDetails(slotProps.data)"
          />
        </template>
      </Column>
      <Column field="project_name" :header="$t('project.project_name')">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'projectDetail',
              params: { id: slotProps.data.project_id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.project_name }}
          </router-link>
        </template>
      </Column>
      <Column field="project_type" :header="$t('project.project_type')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.project_type" />
        </template>
      </Column>
      <Column field="project_area" :header="$t('project.project_area')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.project_area" />
        </template>
      </Column>
      <Column field="project_detail" :header="$t('project.project_detail')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.project_detail" />
        </template>
      </Column>

      <Column field="stage" :header="$t('project.stage')" />
      <Column field="owner" :header="$t('owner')" />

      <Column field="budget.approved_ministry" :header="$t('budget.approved-ministry')">
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data.budget.approved_ministry"
            :read-only="true"
            :in-table="true"
          />
        </template>
      </Column>

      <Column field="budget.executed_payments" :header="$t('budget.executed-payments')">
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data.budget.executed_payments"
            :read-only="true"
            :in-table="true"
          />
        </template>
      </Column>

      <Column field="budget.balance" :header="$t('budget.balance')">
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data.budget.balance"
            :read-only="true"
            :in-table="true"
          />
        </template>
      </Column>

      <Column field="budget.tbr_funding" :header="$t('budget.tbr-funding')">
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data.budget.tbr_funding"
            :read-only="true"
            :in-table="true"
          />
        </template>
      </Column>

      <Column field="budget.funding_non_tbr" :header="$t('budget.non-tbr-funding')">
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data.budget.funding_non_tbr"
            :read-only="true"
            :in-table="true"
          />
        </template>
      </Column>

      <Column field="budget.total_funding" :header="$t('budget.total-funding')">
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data.budget.total_funding"
            :read-only="true"
            :in-table="true"
          />
        </template>
      </Column>

      <Column field="budget.funding_balance" :header="$t('budget.funding-balance')">
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data.budget.funding_balance"
            :read-only="true"
            :in-table="true"
          />
        </template>
      </Column>
    </DataTable>
  </div>
  <WMReportPreviewSidebar v-model:visible="isDetailsVisible" :project="projectDetail" />
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getProjectsFromApi } = useProjects();
const { resetSelectedContacts } = useContacts();

const utilsStore = useUtilsStore();
const { selectedRowsPerPage } = useListUtils();

// INJECT

// PROPS, EMITS

// REFS
const projectDetail = ref(null);
const isDetailsVisible = ref(false);

// Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const projects = ref();
const loading = ref(false);
const dt = ref();

const searchValue = ref("");

// COMPUTED
const rows = computed(() => {
  return selectedRowsPerPage;
});

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Projects",
});

const loadLazyData = () => {
  loading.value = true;

  const filters = utilsStore.filters["project"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = selectedRowsPerPage.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  getProjectsFromApi(params).then((data) => {
    projects.value = data.projects;
    totalRecords.value = data.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const displayDetails = (data) => {
  projectDetail.value = data;
  isDetailsVisible.value = true;
};

utilsStore.resetElements();

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => selectedRowsPerPage,
  () => {
    loadLazyData();
  }
);

watch(
  () => utilsStore.searchString["project"],
  () => {
    searchValue.value = utilsStore.searchString["project"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "project";

  loadLazyData();
  resetSelectedContacts();
});
</script>

<style scoped lang="scss"></style>
