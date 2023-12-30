<template>
  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newTask"
  >
    <WMNewProjectForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <h2 v-if="!hideTitle" class="h2">{{ $t("project.projects") }}</h2>
  <div class="flex flex-column gap-3 mb-3" v-if="showHeaderOptions">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
          >{{ t("new") }}</WMButton
        >
      </div>
      <div class="flex flex-row align-items-center gap-3" v-if="showFilters">
        <!-- <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          @click="openFilterSidebar"
          >{{ t("filter") }}
        </WMButton> -->
        <!-- <WMSidebar
          :visible="isFilterVisible"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
          name="filterTask"
        >
          <WMFilterForm entity="task" filterFormName="task" />
        </WMSidebar>
        <WMOwnerToggle entity="task" /> -->
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="task" />
    </div>
  </div>

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
    <Column style="width: 40px" selectionMode="multiple" v-if="multiselect" />
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
    <Column field="status" :header="$t('project.status')" class="p-0 filled-td">
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
        <Column
          style="width: 40px"
          selectionMode="multiple"
          v-if="multiselect"
        ></Column>
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
</template>

<script setup>
import { ref, watch, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

const { getStatusConditionalStyle } = useListUtils();

const { t, locale } = useI18n();

const selectedProjects = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const projects = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");
const loading = ref(true);

const utilsStore = useUtilsStore();

const props = defineProps({
  tasks: Array,
  rows: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array,
    required: true,
  },
  multiselect: {
    type: Boolean,
    default: true,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    default: null,
  },
  relatedEntityId: {
    type: String,
    default: null,
  },
  showHeaderOptions: {
    type: Boolean,
    default: true,
  },
  showFilters: {
    type: Boolean,
    default: true,
  },
  tableClass: {
    type: String,
    default: "",
  },
});

onMounted(() => {
  loadLazyData();
});

const { getProjectsFromApi } = useProjects();

const loadLazyData = () => {
  const filters = utilsStore.filters["task"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = props.rows;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  if (props.relatedEntity == "contact") {
    params.append("contact", props.relatedEntityId);
  } else if (props.relatedEntity == "customer") {
    params.append("customer", props.relatedEntityId);
  }
  // else {
  //   params.append("entity_type", props.relatedEntity);
  //   params.append("entity_id", props.relatedEntityId);
  // }

  getProjectsFromApi(params).then((data) => {
    projects.value = data.projects;
    totalRecords.value = data.totalRecords;
    loading.value = false;
  });
};

function showExpander(data) {
  return data.subprojects && data.subprojects.length ? "" : "no-expander";
}

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["task"] = selectedProjects.value;
};

// first sidebar
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

const isFilterVisible = ref(false);

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["task"],
  () => {
    searchValue.value = utilsStore.searchString["task"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);
</script>

<style scoped lang="scss">
// TODO: duplicated CSS in Projects.vue
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
