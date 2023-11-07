<template>
  <WMListSubHeader
    :activeButtons="isAnyRowSelected"
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    entity="task"
    @new="toggleSidebarVisibility"
  />

  <WMSidebar :visible="isVisible" @close-sidebar="closeSidebar">
    <WMNewTaskForm :isSidebar="true" />
  </WMSidebar>

  <!-- <pre>{{ tasks }}</pre> -->
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
      :rows="rows"
      :first="0"
      ref="dt"
      :totalRecords="totalRecords"
      :loading="loading"
      @page="onPage($event)"
    >
      <Column style="width: 40px" selectionMode="multiple"></Column>
      <!-- Task number -->
      <Column field="task_number" :header="$t('task.number')">
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
      <Column field="process_number" :header="$t('task.service_number')">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'serviceDetail',
              params: { id: slotProps.data.process_number },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.process_number }}
          </router-link>
        </template>
      </Column>
      <!-- Task type -->
      <Column field="task_type" :header="$t('task.type')"></Column>
      <!-- Task family -->
      <Column field="family" :header="$t('task.family')"></Column>
      <!-- Task contact -->
      <Column field="contact" :header="$t('contact.contact')">
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
          <div :class="slaClass(slotProps.data)">
            {{ slotProps.data.SLA }}
          </div>
        </template>
      </Column>
      <!-- Owner -->
      <Column field="owner" :header="$t('task.owner')"> </Column>
      <!-- Customer -->
      <Column field="customer" :header="$t('task.customer')">
        <template #body="slotProps">
          <router-link to="/foo" class="vertical-align-middle">{{
            slotProps.data.customer
          }}</router-link>
        </template>
      </Column>
      <!-- Read -->
      <Column field="call" :header="$t('task.call')"></Column>
      <!-- Date opened -->
      <Column field="open_date" :header="$t('task.open_date')"></Column>
      <!-- Date closed -->
      <Column field="close_date" :header="$t('task.close_date')"></Column>
      <!-- Last changed -->
      <Column field="last_change" :header="$t('modified_at')"></Column>
      <!-- Notes -->
      <Column field="remarks" :header="$t('task.notes')"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { TasksService } from "@/service/TasksService";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useListUtilsStore } from "@/stores/listUtils";

import WMSidebar from "@/components/WMSidebar.vue";
import WMNewTaskForm from "@/components/forms/WMNewTaskForm.vue";

import WMListSubHeader from "@/components/layout/WMListSubHeader.vue";

const listUtilsStore = useListUtilsStore();

onMounted(() => {
  loading.value = true;
  loadLazyData();
});

const loadLazyData = () => {
  TasksService.getTasksFromApi({
    page: lazyParams.value.page + 1,
    per_page: 15,
  }).then((data) => {
    console.log(data);
    tasks.value = data.tasks;
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
  page: 1,
});

const tasks = ref();
const selectedTasks = ref([]);

const isAnyRowSelected = computed(() => {
  return selectedTasks?.value.length > 0;
});

// first sidebar
const isVisible = ref(false);

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

//Number of rows per page
const rows = computed(() => {
  return listUtilsStore.rows;
});

const metaKey = ref(true);

const value = ref(null);
const options = ref([
  { name: "כל אנשי הקשר", value: 2 },
  { name: "אנשי הקשר שלי", value: 1 },
]);

const formUtilsStore = useFormUtilsStore();

const displayNewForm = () => {
  formUtilsStore.expandSidebar = "newTask";
};

const searchValue = ref("");

const rowClass = (data) => {
  console.log(data.is_open);
  return [{ inactive_row: !data.is_open }];
};

const slaClass = (data) => {
  return [
    {
      "bg-teal-200 text-teal-900": data.SLA === "10 ימים",
      "bg-yellow-100 text-gray-900": data.SLA === "2 ימים",
      "bg-red-100 text-red-600 ": data.SLA === "3 ימים",
      "text-teal-900": data.SLA === "עמד ביעד",
      "text-red-600": data.SLA === "הסתיים בחריגה",
    },
  ];
};

const menuItems = [
  { label: "Whatsapp", value: "option1" },
  { label: "SMS", value: "option2" },
];

const filterLabels = [
  { name: "כל המשימות", value: 2 },
  { name: "המשימות שלי", value: 1 },
];
</script>

<style scoped lang="scss"></style>
