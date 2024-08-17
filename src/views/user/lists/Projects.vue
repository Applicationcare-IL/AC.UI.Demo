<template>
  <WMListSubHeader
    entity="project"
    :total-records="totalRecords"
    @new="toggleSidebarVisibility"
    @refresh-table="
      loadLazyData();
      clearSelectedProjects();
    "
    @export="handleExportProjects"
  >
    <template #top-left>
      <WMOwnerToggle entity="project" />
    </template>
  </WMListSubHeader>

  <WMSidebar
    :visible="isVisible"
    name="newProject"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewEntityFormHeader entity="project" name="newProject" />
    <WMNewProjectForm :is-sidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      ref="dt"
      v-model:selection="selectedProjects"
      v-model:expandedRows="expandedRows"
      lazy
      :value="projects"
      data-key="project_id"
      :row-class="showExpander"
      class="p-datatable-sm projects-table"
      table-style="width: 100%; table-layout: fixed;
    border-collapse: collapse;"
      paginator
      scrollable
      scroll-height="flex"
      :rows="rows"
      :first="0"
      :total-records="totalRecords"
      :loading="loading"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <Column expander style="width: 0px"> </Column>
      <Column style="width: 0px" class="th-selection" selection-mode="multiple"></Column>
      <Column
        field="project_number"
        :header="$t('project.project_number')"
        class="link-col"
        style="width: 30px"
      >
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'projectDetail',
              params: { id: slotProps.data.project_id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.project_id }}
          </router-link>
        </template>
      </Column>
      <Column field="project_name" :header="$t('project.project_name')" style="width: 60px">
        <template #body="slotProps">
          <div class="overflow-x-auto">
            {{ slotProps.data.project_name }}
          </div>
        </template>
      </Column>
      <Column field="city_data" :header="$t('project.city_data')" style="width: 30px">
        <template #body="slotProps">
          <div class="overflow-x-auto">
            {{ formatCityData(slotProps.data.location) }}
          </div>
        </template>
      </Column>
      <Column field="address" :header="$t('project.address')" style="width: 30px">
        <template #body="slotProps">
          <div class="overflow-x-auto">
            {{ formatAddress(slotProps.data.location) }}
          </div>
        </template>
      </Column>
      <Column field="project_type" :header="$t('project.project_type')" style="width: 30px">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.project_type" />
        </template>
      </Column>
      <Column field="project_area" :header="$t('project.project_area')" style="width: 30px">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.project_area" />
        </template>
      </Column>
      <Column field="project_detail" :header="$t('project.project_detail')" style="width: 30px">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.project_detail" />
        </template>
      </Column>
      <Column
        field="open_tasks"
        :header="$t('project.open_tasks')"
        class="p-0 filled-td"
        style="width: 30px"
      >
        <div
          :class="highlightCellClass(slotProps.data.open_tasks)"
          class="h-full w-full flex justify-content-center align-items-center"
        >
          {{ slotProps.data.open_tasks }}
        </div>
      </Column>
      <Column
        field="breached_tasks"
        :header="$t('project.breached_tasks')"
        class="p-0 filled-td"
        style="width: 30px"
      >
        <template #body="slotProps">
          <div
            :class="highlightCellClass(slotProps.data.breached_tasks)"
            class="h-full w-full flex justify-content-center align-items-center"
          >
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>

      <Column field="stage" :header="$t('project.stage')" style="width: 30px" />
      <Column
        field="status"
        :header="$t('project.status')"
        class="p-0 filled-td"
        style="width: 20px"
      >
        <template #body="slotProps">
          <div :class="statusClass(slotProps.data.state.value)" class="status-label h-full w-full">
            <WMOptionSetValue :option-set="slotProps.data.state" />
          </div>
        </template>
      </Column>

      <Column style="width: 20px" field="state" class="p-0 filled-td" :header="$t('state.state')">
        <template #body="slotProps">
          <WMStateField :state="slotProps.data.state" />
        </template>
      </Column>

      <template #expansion="slotProps">
        <WMProjectsSubprojectDatatable
          v-model="selectedProjects"
          :project="slotProps.data.subprojects"
        />
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

useHead({
  title: "Projects",
});

const { getProjectsFromApi, exportProjects } = useProjects();
const { setSelectedContacts, resetSelectedContacts } = useContacts();
const { formatAddress, formatCityData } = useUtils();

onMounted(() => {
  utilsStore.entity = "project";

  loadLazyData();
  resetSelectedContacts();
});

const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const projects = ref();
const expandedRows = ref([]);
const loading = ref(false);
const dt = ref();

const searchValue = ref("");

const { selectedRowsPerPage, getStatusConditionalStyle } = useListUtils();

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

const clearSelectedProjects = () => {
  selectedProjects.value = [];
  onSelectionChanged();
};

//Manage selected rows
const selectedProjects = ref([]);
utilsStore.resetElements();

const onSelectionChanged = () => {
  setSelectedContacsFromProjects(selectedProjects.value);
  utilsStore.selectedElements["project"] = selectedProjects.value;
};

//Number of rows per page
const rows = computed(() => {
  return selectedRowsPerPage;
});

// new project sidebar
const isVisible = ref(false);

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const openSidebar = () => {
  isVisible.value = true;
};

const { handleExport } = useExports();

const handleExportProjects = async () => {
  handleExport({
    filters: utilsStore.filters["project"],
    searchValue: searchValue.value,
    exportFunction: exportProjects,
  });
};

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

const showExpander = (data) => {
  return data.subprojects && data.subprojects.length ? "" : "no-expander";
};

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

/**
 * This function is used to set the selected contacts from the selected projects in the table
 * In the project case, we need to get all the team members as contacts
 *
 * It's used for SMS and Email communications
 * @param {*} selectedProjects
 */
const setSelectedContacsFromProjects = (selectedRows) => {
  const selectedProjects = selectedRows.map((selectedProject) => {
    return selectedProject;
  });

  const selectedContacts = selectedProjects.reduce((acc, project) => {
    const projectContacts = project.contacts.map((contact) => {
      return contact;
    });

    return [...acc, ...projectContacts];
  }, []);

  setSelectedContacts(selectedContacts);
};
</script>

<style scoped lang="scss">
.projects-table :deep(td) {
  background: var(--gray-100);
  overflow-x: hidden;
  height: 10px;
}

.projects-table :deep(.p-datatable-tbody > tr.p-highlight > td) {
  background: var(--blue-50);
}

:deep(.th-selection .p-column-header-content) {
  display: flex;
  justify-content: center;
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

:deep(.no-expander .p-row-toggler) {
  opacity: 0;
  pointer-events: none;
}
</style>
