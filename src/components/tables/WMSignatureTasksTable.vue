<template>
  <WMSidebar
    :visible="isVisible"
    name="newTask"
    :data="{ relatedEntity: relatedEntity, relatedEntityId: relatedEntityId }"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <template #default="slotProps">
      <WMNewTaskForm
        :is-sidebar="true"
        :related-entity="slotProps.props.data.relatedEntity"
        :related-entity-id="slotProps.props.data.relatedEntityId"
        @new-task-created="loadLazyData"
      />
    </template>
  </WMSidebar>

  <h2 v-if="!hideTitle" class="h2">{{ $t("task.tasks") }}</h2>
  <div v-if="showHeaderOptions" class="flex flex-column gap-3 mb-3">
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
      </div>
      <div v-if="showFilters" class="flex flex-row align-items-center gap-3">
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
          name="filterTask"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
        >
          <WMFilterForm entity="task" filter-form-name="task" />
        </WMSidebar>
        <WMOwnerToggle entity="task" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="task" />
    </div>
  </div>
  <DataTable
    v-model:selection="selectedTasks"
    lazy
    :row-class="rowClass"
    :value="tasks"
    data-key="task_number"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="props.rows"
    :first="0"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple" />
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`task.${column.name}`)"
      :class="column.class"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'link'">
          <router-link
            :to="{
              name: 'taskDetail',
              params: { id: slotProps.data.task_id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.task_id }}</router-link
          >
        </template>
        <template v-if="column.type === 'detail'">
          <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
        </template>
        <template v-if="column.type === 'sla'">
          <WMSLATag
            v-if="slotProps.data.sla"
            :sla="slotProps.data.sla.sla"
            :days-for-closing="slotProps.data.days_for_closing"
            :state="slotProps.data.state"
          />
        </template>
        <template v-if="column.type === 'translate'">
          {{ $t(column.prefix + "." + slotProps.data[column.name]) }}
        </template>
        <template v-if="column.type === 'optionset'">
          <WMOptionSetValue :option-set="slotProps.data[column.name]" />
        </template>
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.name] }}
        </template>
        <template v-if="column.type === 'sign_button'">
          <WMSignTaskButton
            :signature-id="slotProps.data.id"
            @task-signed="loadLazyData"
          />
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

const { t } = useI18n();

const selectedTasks = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);

const tasks = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");

const utilsStore = useUtilsStore();

const props = defineProps({
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

const { getSignatureTaskFromApi } = useTasks();

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

  params.append("entity_type", props.relatedEntity);
  params.append("entity_id", props.relatedEntityId);

  getSignatureTaskFromApi(params).then((result) => {
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

const clearSelectedTasks = () => {
  selectedTasks.value = [];
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
