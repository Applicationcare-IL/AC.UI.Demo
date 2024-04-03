<template>
  <div class="dashboard-column card-container">
    <div class="h1 mb-5">{{ $t("dashboard.my-tasks") }}</div>
    <div class="flex flex-column gap-5 card-container">
      <Card v-if="false">
        <template #content>
          <div class="flex flex-row gap-5 justify-content-center">
            <div
              class="flex flex-2 flex-row gap-4 px-5 py-2 counter counter-green align-items-center"
            >
              <div class="small-text">
                תהליכים<br />
                פתוחים
              </div>
              <div class="text-5xl font-bold green">145</div>
            </div>
            <div
              class="flex flex-row flex-2 gap-3 px-5 py-2 counter counter-red align-items-center"
            >
              <div class="small-text">
                תהליכים <br />
                חורגים
              </div>
              <div class="text-5xl font-bold red">45</div>
            </div>
          </div>
        </template>
      </Card>
      <div class="flex flex-row gap-5 graphs-min-height">
        <div style="width: 50%">
          <Card class="h-full p-card-chart">
            <template #title>
              <div
                class="w-full flex align-items-center justify-content-between"
              >
                <span>
                  {{ $t("dashboard.tasks-distribution-by-sla") }}
                </span>
                <!-- <i
                  class="pi pi-ellipsis-v cursor-pointer"
                  @click="openTasksSLADialog"
                ></i> -->
              </div>
            </template>
            <template #content>
              <SLAChart v-if="tasksSLAData" :data="tasksSLAData" />
            </template>
          </Card>
          <DashboardTasksSLADialog
            v-model="showTasksSLADialog"
            :filters="dashboardTaskFilters"
          />
        </div>
        <div style="width: 50%">
          <Card class="h-full">
            <template #title> {{ $t("dashboard.top-task-families") }}</template>
            <template #content>
              <TrendingList
                v-if="topTaskFamilies.length"
                :data="topTaskFamilies"
              />
              <span v-else> {{ $t("data-not-available") }}</span>
            </template>
          </Card>
        </div>
      </div>
      <Card>
        <template #content>
          <WMTasksTable
            v-if="can('tasks.read')"
            :columns="taskColumns"
            multiselect
            :hide-title="true"
            :show-filter="false"
            :filters="dashboardTaskFilters"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";
import DashboardTasksSLADialog from "@/views/dashboard/DashboardTasksSLADialog.vue";
const optionSetsStore = useOptionSetsStore();

const { can } = usePermissions();

const { getTaskColumns } = useListUtils();

const { getTasksSLADistribution } = useTasks();

const taskColumns = ref(getTaskColumns());

const { getTopTaskFamilies } = useTasks();

// const openTasksSLADialog = () => {
//   showTasksSLADialog.value = true;
// };

const topTaskFamilies = ref([]);
const tasksSLAData = ref(null);
const showTasksSLADialog = ref(false);

const dashboardTaskFilters = ref({
  order_by: "due_date",
});

onMounted(async () => {
  const activeStateId = await optionSetsStore.getValueId("state", "active");

  dashboardTaskFilters.value = {
    ...dashboardTaskFilters.value,
    state: activeStateId,
  };

  topTaskFamilies.value = await getTopTaskFamilies(dashboardTaskFilters.value);

  tasksSLAData.value = await getTasksSLADistribution(
    dashboardTaskFilters.value
  );
});
</script>

<style scoped></style>
