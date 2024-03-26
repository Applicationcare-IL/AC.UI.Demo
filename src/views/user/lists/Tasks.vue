<template>
  <WMListSubHeader
    :active-buttons="isAnyRowSelected"
    entity="task"
    @new="toggleSidebarVisibility"
    @task-completed="handleRefreshTable"
    @refresh-table="handleRefreshTable"
    @export="handleExportTasks"
  />

  <WMSidebar
    :visible="isVisible"
    name="newTask"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewEntityFormHeader
      entity="task"
      name="newTask"
      title-translation-key="task.new_task"
    />
    <WMNewTaskForm :is-sidebar="true" @new-task-created="closeSidebar" />
  </WMSidebar>

  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      ref="dt"
      v-model:selection="selectedTasks"
      lazy
      :row-class="rowClass"
      :value="tasks"
      data-key="task_number"
      table-style="min-width: 50rem"
      class="p-datatable-sm"
      scrollable
      scroll-height="flex"
      paginator
      :rows="selectedRowsPerPage"
      :first="0"
      :total-records="totalRecords"
      :loading="loading"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <Column style="width: 40px" selection-mode="multiple"></Column>

      <Column field="task_number" :header="$t('task.number')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="
              slotProps.data.task_family?.value === 'subproject' &&
              slotProps.data.project_created &&
              checkIfEntityIsActive('projects')
            "
            :to="{
              name: 'projectDetail',
              params: { id: slotProps.data.project_created.id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.task_number }}</router-link
          >

          <router-link
            v-else
            :to="{
              name: 'taskDetail',
              params: { id: slotProps.data.task_number },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.task_number }}</router-link
          >
        </template>
      </Column>
      <Column
        v-if="checkIfEntityIsActive('projects')"
        field="project_name"
        :header="$t('project.project_name')"
      >
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.related_entity?.type === 'project'"
            :to="{
              name: 'projectDetail',
              params: { id: slotProps.data.related_entity?.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.related_entity?.name }}
          </router-link>
        </template>
      </Column>

      <Column field="task_family " :header="$t('task.family')">
        <template #body="slotProps">
          <div class="flex justify-content-between align-items-center">
            <WMOptionSetValue :option-set="slotProps.data.task_family" />
            <img
              v-if="
                slotProps.data.task_family?.value === 'subproject' &&
                slotProps.data.project_created &&
                checkIfEntityIsActive('projects')
              "
              src="/icons/format_list_bulleted.svg"
              class="vertical-align-middle"
            />
          </div>
        </template>
      </Column>
      <Column field="task_type.name" :header="$t('task.type')">
        <template #body="slotProps">
          {{ slotProps.data.task_type?.name }}
        </template>
      </Column>

      <Column field="started_at" :header="$t('task.started_at')"></Column>
      <Column field="due_date" :header="$t('task.due_date')"></Column>

      <Column field="SLA" header="SLA" class="sla">
        <template #body="slotProps">
          <WMSLATag
            v-if="slotProps.data.sla"
            :sla="slotProps.data.sla.sla"
            :days-for-closing="slotProps.data.days_for_closing"
            :state="slotProps.data.state.value"
          />
        </template>
      </Column>

      <Column field="close_date" :header="$t('task.close_date')"></Column>

      <Column field="owner" :header="$t('task.owner')"> </Column>

      <Column field="last_change" :header="$t('modified_at')">
        <template #body="slotProps">
          {{ slotProps.data.last_change }}
        </template>
      </Column>
      <Column field="notes" :header="$t('task.notes')"></Column>
      <Column field="status" :header="$t('task.status')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.status" />
        </template>
      </Column>
      <Column field="state" class="p-0 filled-td" :header="$t('state.state')">
        <template #body="slotProps">
          <WMStateField :state="slotProps.data.state" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getTasksFromApi, mapContactsFromTasks, exportTasks } = useTasks();
const { checkIfEntityIsActive } = useLicensing();
const { setSelectedContacts, resetSelectedContacts } = useContacts();
const utilsStore = useUtilsStore();
const { selectedRowsPerPage } = useListUtils();

// INJECT

// PROPS, EMITS

// REFS
const searchValue = ref("");

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);

const lazyParams = ref({
  page: 0,
});

const tasks = ref();
const selectedTasks = ref([]);

const isVisible = ref(false);

// COMPUTED
const isAnyRowSelected = computed(() => {
  return selectedTasks?.value.length > 0;
});

// COMPONENT METHODS
useHead({
  title: "Tasks",
});

const handleRefreshTable = () => {
  clearSelectedTasks();
  loadLazyData();
  onSelectionChanged();
};

const loadLazyData = () => {
  loading.value = true;

  const filters = utilsStore.filters["task"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = selectedRowsPerPage.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  getTasksFromApi(params).then((data) => {
    tasks.value = data.data;
    totalRecords.value = data.totalRecords;
    loading.value = false;
  });
};

const { handleExport } = useExports();

const handleExportTasks = async () => {
  handleExport({
    filters: utilsStore.filters["task"],
    searchValue: searchValue.value,
    exportFunction: exportTasks,
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

utilsStore.resetElements();

const clearSelectedTasks = () => {
  selectedTasks.value = [];
};

const onSelectionChanged = () => {
  setSelectedContacts(mapContactsFromTasks(selectedTasks.value));
  utilsStore.selectedElements["task"] = selectedTasks.value;
};

const rowClass = (data) => {
  return [{ inactive_row: !data.is_open }];
};

// PROVIDE, EXPOSE

// WATCHERS
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "task";

  loading.value = true;
  loadLazyData();

  resetSelectedContacts();
});
</script>

<style scoped lang="scss"></style>
