<template>
  <div class="dashboard-column card-container">
    <div class="h1 mb-5">{{ $t("dashboard.my-tasks") }}</div>
    <div class="flex flex-column gap-5 card-container">
      <Card
        v-if="
          (can('global.is_support_rep') && tasksSLAData) ||
          (can('global.is_team_manager') && tasksSLAData)
        "
      >
        <template #content>
          <div class="flex flex-row gap-5 justify-content-center">
            <div
              class="flex flex-2 flex-row gap-4 px-5 py-2 counter counter-green align-items-center"
            >
              <div class="small-text counter__label">
                {{ $t("dashboard.open-tasks") }}
              </div>
              <div class="text-5xl font-bold green">{{ openTasks }}</div>
            </div>
            <div
              class="flex flex-row flex-2 gap-3 px-5 py-2 counter counter-red align-items-center"
            >
              <div class="small-text counter__label">
                {{ $t("dashboard.breached-tasks") }}
              </div>
              <div class="text-5xl font-bold red">{{ breachedTasks }}</div>
            </div>
          </div>
        </template>
      </Card>
      <div class="flex flex-row gap-5 graphs-min-height">
        <div style="width: 50%">
          <Card class="h-full p-card-chart">
            <template #title>
              <div class="w-full flex align-items-center justify-content-between">
                <span>
                  {{ $t("dashboard.tasks-distribution-by-sla") }}
                </span>
                <i class="pi pi-ellipsis-v cursor-pointer" @click="openTasksSLADialog"></i>
              </div>
            </template>
            <template #content>
              <SLAChart v-if="tasksSLAData" :data="tasksSLAData" />
            </template>
          </Card>
          <DashboardTasksSLADialog v-model="showTasksSLADialog" :filters="dashboardTaskFilters" />
        </div>
        <div style="width: 50%">
          <Card class="h-full">
            <template #title> {{ $t("dashboard.top-task-families") }}</template>
            <template #content>
              <TrendingList v-if="topTaskFamilies.length" :data="topTaskFamilies" />
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
            :show-pagination-options="false"
            :team-table="can('global.is_team_manager')"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

const { can } = usePermissions();
const { getTaskColumns } = useListUtils();
const { getTasksSLADistribution } = useTasks();
const { getTopTaskFamilies } = useTasks();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedTeams: Array,
});

// REFS
const taskColumns = ref(getTaskColumns());
const topTaskFamilies = ref([]);
const tasksSLAData = ref(null);
const showTasksSLADialog = ref(false);

const activeStateId = ref(null);
const openStatusId = ref(null);

// COMPUTED
const dashboardTaskFilters = computed(() => {
  let filters = {
    order_by: "due_date",
    state: activeStateId.value,
    status: openStatusId.value,
  };

  if (props.selectedTeams.length) {
    filters.team = props.selectedTeams.map((team) => team.id).join(",");
  }

  return filters;
});

const openTasks = computed(() => {
  if (!tasksSLAData.value) {
    return 0;
  }

  const nearBreach =
    tasksSLAData.value.find((item) => item.sla_status === "near_breach")?.value || 0;
  const noBreach = tasksSLAData.value.find((item) => item.sla_status === "no_breach")?.value || 0;
  const breached = tasksSLAData.value.find((item) => item.sla_status === "breached")?.value || 0;

  return nearBreach + noBreach + breached;
});

const breachedTasks = computed(() => {
  if (!tasksSLAData.value) {
    return 0;
  }

  return tasksSLAData.value.find((item) => item.sla_status === "breached")?.value || 0;
});

// COMPONENT METHODS AND LOGIC
const openTasksSLADialog = () => {
  showTasksSLADialog.value = true;
};

const getTasksSLAData = async (filters) => {
  tasksSLAData.value = await getTasksSLADistribution(filters);
};

const loadData = async () => {
  topTaskFamilies.value = await getTopTaskFamilies(dashboardTaskFilters.value);
  getTasksSLAData(dashboardTaskFilters.value);
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => props.selectedTeams,
  async () => {
    loadData();
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  activeStateId.value = await optionSetsStore.getValueId("state", "active");
  openStatusId.value = await optionSetsStore.getValueId("task_status", "open");

  loadData();
});
</script>

<style scoped></style>
