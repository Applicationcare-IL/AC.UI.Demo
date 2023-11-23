<template>
  <WMListSubHeader
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    entity="project"
    @new="displayNewForm"
  >
  </WMListSubHeader>
  <Sidebar
    v-model:visible="isDetailsVisible"
    class="details-sidebar w-6"
    :showCloseIcon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <h2>{{ projectDetail.name }}</h2>
    <Divider />
    <!-- <WMCustomersTable :contact="projectDetail" :columns="customerColumns" :showControls="false" :rows="5" /> -->
  </Sidebar>
  <WMNewEntitySidebar name="newProject" entity="project" />
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      lazy
      v-model:selection="selectedProjects"
      :value="projects"
      dataKey="project_id"
      v-model:expandedRows="expandedRows"
      tableStyle="min-width: 50rem"
      class="p-datatable-sm projects-table"
      paginator
      scrollable
      scrollHeight="flex"
      :rows="rows"
      :first="0"
      ref="dt"
      :totalRecords="totalRecords"
      :loading="loading"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <Column expander style="width: 45px" />
      <Column style="width: 40px" selectionMode="multiple"></Column>
      <Column
        field="project_number"
        :header="$t('project.project_number')"
        class="link-col"
      >
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'projectDetail',
              params: { id: slotProps.data.project_id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.project_number }}</router-link
          >
        </template>
      </Column>
      <Column field="project_name" :header="$t('project.project_name')" />
      <Column field="city_data" :header="$t('project.city_data')" />
      <Column field="address" :header="$t('project.address')" />
      <Column field="project_type" :header="$t('project.project_type')" />
      <Column field="project_area" :header="$t('project.project_area')" />
      <Column field="project_detail" :header="$t('project.project_detail')" />
      <Column field="open_tasks" :header="$t('project.open_tasks')" />
      <Column field="breached_tasks" :header="$t('project.breached_tasks')" />
      <Column field="stage" :header="$t('project.stage')" />
      <Column field="status" :header="$t('project.status')">
        <template #body="slotProps">
          <div
            :class="statusClass(slotProps.data.status)"
            class="status-label w-full"
          >
            {{ slotProps.data.status }}
          </div>
        </template>
      </Column>

      <template #expansion="slotProps">
        <DataTable :value="slotProps.data.subProjects" class="subtable">
          <Column style="width: 45px"></Column>
          <Column style="width: 40px" selectionMode="multiple"></Column>
          <Column field="project_number" class="link-col">
            <template #body="slotProps">
              <router-link
                :to="{
                  name: 'projectDetail',
                  params: { id: slotProps.data.project_id },
                }"
                class="vertical-align-middle"
                >{{ slotProps.data.project_number }}</router-link
              >
            </template>
          </Column>
          <Column field="project_name" />
          <Column field="city_data" />
          <Column field="address" />
          <Column field="project_type" />
          <Column field="project_area" />
          <Column field="project_detail" />
          <Column field="open_tasks" />
          <Column field="breached_tasks" />
          <Column field="stage" />
          <Column field="status">
            <template #body="slotProps">
              <div
                :class="statusClass(slotProps.data.status)"
                class="status-label w-full"
              >
                {{ slotProps.data.status }}
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";

import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";

import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();
const { getProjectsFromApi } = useProjects();

onMounted(() => {
  utilsStore.entity = "project";

  loadLazyData();
});

const formUtilsStore = useFormUtilsStore();

const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const projects = ref();
const subProjects = ref();
const expandedRows = ref([]);
const loading = ref(false);
const dt = ref();

const { defaultRowsPerPage, getStatusConditionalStyle } = useListUtils();

const loadLazyData = () => {
  loading.value = true;

  getProjectsFromApi({
    page: lazyParams.value.page + 1,
    per_page: defaultRowsPerPage,
    // search: searchValue.value,
  }).then((data) => {
    console.log("projects", data);
    projects.value = data.data;
    totalRecords.value = data.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

//Display sidebars
// const customerColumns = ref(getCustomerDetailColumns);
// const contactDetail = ref(null);
// const displayDetails = (data) => {
//     contactDetail.value = data;
//     isDetailsVisible.value = true;
// }

// const isDetailsVisible = ref(false);
// const displayNewForm = () => {
//     formUtilsStore.expandSidebar = 'newContact';
// }

//Move to Store
// const highlightCellClass = (data) => {
//     return [{ 'bg-red-100 text-red-600': data > 0 }];
// };

const filterLabels = [
  { name: "כל הלקוחות", value: 2 },
  { name: "הלקוחות שלי", value: 1 },
];

//Manage selected rows
const selectedProjects = ref([]);
utilsStore.resetElements();
const onSelectionChanged = () => {
  utilsStore.selectedElements["contact"] = selectedProjects.value;
};

//Number of rows per page
const rows = computed(() => {
  return defaultRowsPerPage;
});

watch(
  () => defaultRowsPerPage,
  () => {
    loadLazyData();
  }
);

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};
</script>

<style scoped lang="scss">
.projects-table :deep(td) {
  background: var(--gray-100);
}

.subtable {
  :deep(.p-datatable-thead th) {
    padding: 0 0.5rem !important;
    .p-column-header-content {
      overflow: hidden;
      height: 0;
      margin: 0;
      padding: 0;
    }
  }

  :deep(td) {
    background: var(--gray-50);
  }
}
</style>
