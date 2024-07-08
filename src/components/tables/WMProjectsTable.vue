<template>
  <h2 v-if="!hideTitle" class="h2">{{ $t("project.projects") }}</h2>
  <div v-if="showHeaderOptions" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMNewButton :text="$t('new')" @click="toggleSidebarVisibility" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="task" />
    </div>
  </div>

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
        {{ formatCityData(slotProps.data.location) }}
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

    <Column
      field="project_detail"
      :header="$t('project.project_detail')"
      style="width: 30px"
    >
      <template #body="slotProps">
        <WMOptionSetValue :option-set="slotProps.data.project_detail" />
      </template>
    </Column>

    <Column
      field="open_tasks"
      :header="$t('project.open_tasks')"
      class="numeric"
      style="width: 30px"
    >
      <div :class="highlightCellClass(slotProps.data.open_tasks)">
        {{ slotProps.data.open_tasks }}
      </div>
    </Column>

    <Column
      field="breached_tasks"
      :header="$t('project.breached_tasks')"
      class="numeric"
      style="width: 30px"
    >
      <template #body="slotProps">
        <div :class="highlightCellClass(slotProps.data.breached_tasks)">
          {{ slotProps.data.breached_tasks }}
        </div>
      </template>
    </Column>

    <Column field="stage" :header="$t('project.stage')" style="width: 30px" />

    <Column
      field="status"
      :header="$t('project.status')"
      class="p-0 filled-td"
      style="width: 30px"
    >
      <template #body="slotProps">
        <div
          :class="statusClass(slotProps.data.state?.value)"
          class="status-label h-full w-full"
        >
          <WMOptionSetValue :option-set="slotProps.data.state" />
        </div>
      </template>
    </Column>

    <template #expansion="slotProps">
      <WMProjectsSubprojectDatatable
        v-model="selectedProjects"
        :project="slotProps.data.subprojects"
      />
    </template>
  </DataTable>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

const { getStatusConditionalStyle } = useListUtils();

const { formatAddress, formatCityData } = useUtils();

const { t } = useI18n();

const selectedProjects = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const projects = ref([]);
const expandedRows = ref([]);
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
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

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
