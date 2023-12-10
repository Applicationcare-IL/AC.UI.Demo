<template>
  <WMListSubHeader
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    entity="project"
    @new="toggleSidebarVisibility"
  >
  </WMListSubHeader>

  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newTask"
  >
    <WMNewEntityFormHeader entity="project" name="newProject" />
    <WMNewProjectForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

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
          >
            {{ slotProps.data.project_number }}
          </router-link>
        </template>
      </Column>
      <Column field="project_name" :header="$t('project.project_name')" />
      <Column field="city_data" :header="$t('project.city_data')" />
      <Column field="address" :header="$t('project.address')" />
      <Column field="project_type" :header="$t('project.project_type')" />
      <Column field="project_area" :header="$t('project.project_area')" />
      <Column field="project_detail" :header="$t('project.project_detail')" />
      <Column field="open_tasks" :header="$t('project.open_tasks')" />
      <Column
        field="breached_tasks"
        :header="$t('project.breached_tasks')"
        class="filled-td"
      >
        <template #body="slotProps">
          <div
            :class="
              slotProps.data.breached_tasks >= 0
                ? 'bg-red-100 text-red-900'
                : ''
            "
            class="breached-tasks h-full w-full text-center"
          >
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>

      <Column field="stage" :header="$t('project.stage')" />
      <Column
        field="status"
        :header="$t('project.status')"
        class="p-0 filled-td"
      >
        <template #body="slotProps">
          <div
            :class="statusClass(slotProps.data.status)"
            class="status-label h-full w-full"
          >
            {{ slotProps.data.status }}
          </div>
        </template>
      </Column>

      <template #expansion="slotProps">
        <DataTable
          :value="slotProps.data.subProjects"
          v-model:selection="selectedProjects"
          @update:selection="onSelectionChanged"
          class="subtable"
        >
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
import { ref, onMounted, computed, watch, watchEffect } from "vue";

import { useRouter } from "vue-router";

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

const { selectedRowsPerPage, getStatusConditionalStyle } = useListUtils();

const loadLazyData = () => {
  loading.value = true;

  const filters = utilsStore.filters["project"];
  const nextPage = lazyParams.value.page + 1;
  // const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = selectedRowsPerPage.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    // search: searchValueParam,
  });

  getProjectsFromApi(params).then((data) => {
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

const filterLabels = [
  { name: "כל הלקוחות", value: 2 },
  { name: "הלקוחות שלי", value: 1 },
];

//Manage selected rows
const selectedProjects = ref([]);
utilsStore.resetElements();
const onSelectionChanged = () => {
  console.log(selectedProjects.value);
  utilsStore.selectedElements["project"] = selectedProjects.value;
};

//Number of rows per page
const rows = computed(() => {
  return selectedRowsPerPage;
});

// new project sidebar
const isVisible = ref(false);

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

watchEffect(() => {
  loadLazyData();
});

watch(
  () => selectedRowsPerPage,
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

.breached-tasks {
  display: flex;
  width: 72px;
  height: 24px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.1rem;
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

:deep(.filled-td) {
  text-align: center !important;
  padding: 0px !important;
  line-height: 24px;
  font-weight: 700;
}
</style>
