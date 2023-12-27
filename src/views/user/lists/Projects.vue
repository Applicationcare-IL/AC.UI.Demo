<template>
  <WMListSubHeader entity="project" @new="toggleSidebarVisibility" />

  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newTask"
  >
    <WMNewEntityFormHeader entity="project" name="newProject" />
    <WMNewProjectForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      lazy
      v-model:selection="selectedProjects"
      :value="projects"
      dataKey="project_id"
      v-model:expandedRows="expandedRows"
      :rowClass="showExpander"
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
      <Column expander style="width: 45px"> </Column>
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
            {{ slotProps.data.project_id }}
          </router-link>
        </template>
      </Column>
      <Column field="project_name" :header="$t('project.project_name')" />
      <Column field="city_data" :header="$t('project.city_data')" />
      <Column field="address" :header="$t('project.address')" />
      <Column field="project_type" :header="$t('project.project_type')">
        <template #body="slotProps">
          <WMOptionSetValue :optionSet="slotProps.data.project_type" />
        </template>
      </Column>
      <Column field="project_area" :header="$t('project.project_area')">
        <template #body="slotProps">
          <WMOptionSetValue :optionSet="slotProps.data.project_area" />
        </template>
      </Column>
      <Column field="project_detail" :header="$t('project.project_detail')">
        <template #body="slotProps">
          <WMOptionSetValue :optionSet="slotProps.data.project_detail" />
        </template>
      </Column>
      <Column
        field="open_tasks"
        :header="$t('project.open_tasks')"
        class="numeric"
      >
        <div :class="highlightCellClass(slotProps.data.open_tasks)">
          {{ slotProps.data.open_tasks }}
        </div>
      </Column>
      <Column
        field="breached_tasks"
        :header="$t('project.breached_tasks')"
        class="numeric"
      >
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_tasks)">
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
            :class="statusClass(slotProps.data.status.value)"
            class="status-label h-full w-full"
          >
            <WMOptionSetValue :optionSet="slotProps.data.status" />
          </div>
        </template>
      </Column>

      <template #expansion="slotProps">
        <DataTable
          :value="slotProps.data.subprojects"
          v-model:selection="selectedProjects"
          @update:selection="onSelectionChanged"
          class="subtable"
        >
          <Column style="width: 45px"></Column>
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
                {{ slotProps.data.project_id }}
              </router-link>
            </template>
          </Column>
          <Column field="project_name" :header="$t('project.project_name')" />
          <Column field="city_data" :header="$t('project.city_data')" />
          <Column field="address" :header="$t('project.address')" />
          <Column field="project_type" :header="$t('project.project_type')">
            <template #body="slotProps">
              <WMOptionSetValue :optionSet="slotProps.data.project_type" />
            </template>
          </Column>
          <Column field="project_area" :header="$t('project.project_area')">
            <template #body="slotProps">
              <WMOptionSetValue :optionSet="slotProps.data.project_area" />
            </template>
          </Column>
          <Column field="project_detail" :header="$t('project.project_detail')">
            <template #body="slotProps">
              <WMOptionSetValue :optionSet="slotProps.data.project_detail" />
            </template>
          </Column>
          <Column field="open_tasks" :header="$t('project.open_tasks')" />
          <Column
            field="breached_tasks"
            :header="$t('project.breached_tasks')"
            class="numeric"
          >
            <template #body="slotProps">
              <div :class="highlightCellClass(slotProps.data.breached_tasks)">
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
                :class="statusClass(slotProps.data.status.value)"
                class="status-label h-full w-full"
              >
                <WMOptionSetValue :optionSet="slotProps.data.status" />
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

import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";

useHead({
  title: "Projects",
});

const { getProjectsFromApi } = useProjects();
const { setSelectedContacts, resetSelectedContacts } = useContacts();

onMounted(() => {
  utilsStore.entity = "project";

  loadLazyData();
  resetSelectedContacts();
});

const formUtilsStore = useFormUtilsStore();

const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const projects = ref();
const subprojects = ref();
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
    projects.value = data.projects;
    totalRecords.value = data.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
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

function showExpander(data) {
  return data.subprojects && data.subprojects.length ? "" : "no-expander";
}

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
