<template>
  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newTask"
    :data="{ relatedEntity: relatedEntity, relatedEntityId: relatedEntityId }"
  >
    <template v-slot:default="slotProps">
      <WMNewTaskForm
        :isSidebar="true"
        @close-sidebar="closeSidebar"
        :relatedEntity="slotProps.props.data.relatedEntity"
        :relatedEntityId="slotProps.props.data.relatedEntityId"
      />
    </template>
  </WMSidebar>

  <h2 v-if="!hideTitle" class="h2">{{ $t("task.tasks") }}</h2>
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
        <WMAssignOwnerButton entity="task" />
        <WMCompleteTasksButton entity="task" @taskCompleted="loadLazyData" />
      </div>
      <div class="flex flex-row align-items-center gap-3" v-if="showFilters">
        <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          @click="openFilterSidebar"
          >{{ t("filter") }}
        </WMButton>
        <WMSidebar
          :visible="isFilterVisible"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
          name="filterTask"
        >
          <WMFilterForm entity="task" filterFormName="task" />
        </WMSidebar>
        <WMOwnerToggle entity="task" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="task" />
    </div>
  </div>
  <DataTable
    lazyParams
    v-model:selection="selectedTasks"
    :rowClass="rowClass"
    :value="tasks"
    dataKey="task_number"
    tableStyle="min-width: 50rem"
    scrollable
    paginator
    :rows="props.rows"
    @page="onPage($event)"
    :totalRecords="totalRecords"
    @update:selection="onSelectionChanged"
    :class="`p-datatable-${tableClass}`"
  >
    <Column
      v-if="multiselect"
      style="width: 40px"
      selectionMode="multiple"
    ></Column>
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`task.${column.name}`)"
      :class="column.class"
    >
      <template v-if="column.type === 'link'" #body="slotProps">
        <router-link
          :to="{
            name: 'taskDetail',
            params: { id: slotProps.data.task_number },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data.task_number }}</router-link
        >
      </template>
      <template v-if="column.type === 'detail'">
        <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
      </template>
      <template v-if="column.type === 'sla'" #body="slotProps"> sla </template>
      <template v-if="column.type === 'translate'" #body="slotProps">
        {{ $t(column.prefix + "." + slotProps.data[column.name]) }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";
import WMOwnerToggle from "../forms/shared/WMOwnerToggle.vue";

const { t, locale } = useI18n();

const selectedTasks = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const tasks = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");

const utilsStore = useUtilsStore();
const i18n = useI18n();

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

const { getTasksFromApi } = useTasks();

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
    params.append("contact_id", props.relatedEntityId);
  }
  if (props.relatedEntity == "customer") {
    params.append("customer_id", props.relatedEntityId);
  } else {
    params.append("entity_type", props.relatedEntity);
    params.append("entity_id", props.relatedEntityId);
  }

  getTasksFromApi(params).then((result) => {
    tasks.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const rowClass = (data) => {
  return [{ inactive_row: !data.is_open }];
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["task"] = selectedTasks.value;
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
