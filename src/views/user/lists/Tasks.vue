<template>
  <WMListSubHeader
    :activeButtons="isAnyRowSelected"
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    entity="task"
    @new="toggleSidebarVisibility"
  />

  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newTask"
  >
    <WMNewEntityFormHeader entity="task" name="newTask" />
    <WMNewTaskForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      lazy
      v-model:selection="selectedTasks"
      :rowClass="rowClass"
      :value="tasks"
      dataKey="task_number"
      tableStyle="min-width: 50rem"
      class="p-datatable-sm"
      scrollable
      scrollHeight="flex"
      paginator
      :rows="selectedRowsPerPage"
      :first="0"
      ref="dt"
      :totalRecords="totalRecords"
      :loading="loading"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <Column style="width: 40px" selectionMode="multiple"></Column>
      <!-- Task number -->
      <Column field="task_number" :header="$t('task.number')" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'taskDetail',
              params: { id: slotProps.data.task_number },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.task_number }}</router-link
          >
        </template>
      </Column>
      <!-- Service number -->
      <Column
        field="process_number"
        :header="$t('task.service_number')"
        class="link-col"
      >
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.service_number"
            :to="{
              name: 'serviceDetail',
              params: { id: slotProps.data.service_number },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.service_number }}
          </router-link>
        </template>
      </Column>
      <!-- Task type -->
      <Column field="task_type" :header="$t('task.type')"></Column>
      <!-- Task family -->
      <Column field="task_family " :header="$t('task.family')">
        <template #body="slotProps">
          {{ slotProps.data.task_family }}
        </template>
      </Column>
      <!-- Task contact -->
      <Column field="contact" :header="$t('contact.contact')" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.contact_id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.contact }}
          </router-link>
        </template>
      </Column>
      <!-- Task status -->
      <Column field="status" :header="$t('task.status')"></Column>
      <!-- Goal date -->
      <Column field="due_date" :header="$t('task.due_date')"></Column>
      <!-- SLA -->
      <Column field="SLA" header="SLA" class="sla">
        <template #body="slotProps">
          <WMSLATag :sla="slotProps.data.sla">
            {{ slotProps.data.days_for_closing }} ימים
          </WMSLATag>
        </template>
      </Column>
      <!-- Owner -->
      <Column field="owner" :header="$t('task.owner')"> </Column>
      <!-- Customer -->
      <Column field="customer" :header="$t('task.customer')" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'customerDetail',
              params: { id: slotProps.data.customer_id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.customer }}
          </router-link>
        </template>
      </Column>
      <!-- Read -->
      <Column field="call" :header="$t('task.call')" class="is-mocked"></Column>
      <!-- Date opened -->
      <Column field="open_date" :header="$t('task.open_date')"></Column>
      <!-- Date closed -->
      <Column field="close_date" :header="$t('task.close_date')"></Column>
      <!-- Last changed -->
      <Column field="last_change" :header="$t('modified_at')"></Column>
      <!-- Notes -->
      <Column field="notes" :header="$t('task.notes')"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

const { getTasksFromApi } = useTasks();

const utilsStore = useUtilsStore();
const searchValue = ref("");

onMounted(() => {
  utilsStore.entity = "task";

  loading.value = true;
  loadLazyData();
});

const { selectedRowsPerPage } = useListUtils();

const loadLazyData = () => {
  getTasksFromApi({
    page: lazyParams.value.page + 1,
    per_page: selectedRowsPerPage.value,
    search: searchValue.value,
  }).then((data) => {
    tasks.value = data.data;
    totalRecords.value = data.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);

const lazyParams = ref({
  page: 0,
});

const tasks = ref();
const selectedTasks = ref([]);

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

utilsStore.resetElements();

const onSelectionChanged = () => {
  console.log(selectedTasks.value);
  utilsStore.selectedElements["task"] = selectedTasks.value;
};

const isAnyRowSelected = computed(() => {
  return selectedTasks?.value.length > 0;
});

watchEffect(() => {
  loadLazyData();
});

const rowClass = (data) => {
  return [{ inactive_row: !data.is_open }];
};

watch(
  () => utilsStore.searchString["task"],
  () => {
    searchValue.value = utilsStore.searchString["task"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

const filterLabels = [
  { name: "כל המשימות", value: 2 },
  { name: "המשימות שלי", value: 1 },
];
</script>

<style scoped lang="scss"></style>
