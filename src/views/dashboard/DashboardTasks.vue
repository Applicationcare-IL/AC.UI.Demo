<template>
  <div class="dashboard-column card-container">
    <!-- Tasks -->
    <div class="h1 mb-5">{{ $t("dashboard.my-tasks") }}</div>
    <div class="flex flex-column gap-5 card-container">
      <!-- <Card>
          <template #content>
            <div class="flex flex-row gap-5 justify-content-center">
              <div
                class="flex flex-row gap-3 px-5 py-1 counter counter-green align-items-center"
              >
                <div class="small-text">
                  משימות<br />
                  פתוחים
                </div>
                <div class="big-text green">145</div>
              </div>
              <div
                class="flex flex-row gap-3 px-5 py-1 counter counter-red align-items-center"
              >
                <div class="small-text">
                  משימות <br />
                  חורגים
                </div>
                <div class="big-text red">45</div>
              </div>
            </div>
          </template>
        </Card> -->
      <div class="flex flex-row gap-5">
        <div style="width: 65%">
          <Card class="h-full">
            <template #title>
              <div
                class="w-full flex align-items-center justify-content-between"
              >
                <span>
                  {{ $t("dashboard.tasks-distribution-by-sla") }}
                </span>
                <!-- <i class="pi pi-ellipsis-v"></i> -->
              </div>
            </template>
            <template #content>
              <SLAChart v-if="tasksSLAData" :data="tasksSLAData" />
            </template>
          </Card>
        </div>
        <div style="width: 35%">
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
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const { can } = usePermissions();

const { getTaskColumns } = useListUtils();

const { getTasksSLADistribution } = useTasks();

const taskColumns = ref(getTaskColumns());

const { getTopTaskFamilies } = useTasks();

const topTaskFamilies = ref([]);
const tasksSLAData = ref(null);

onMounted(async () => {
  topTaskFamilies.value = await getTopTaskFamilies();
  tasksSLAData.value = await getTasksSLADistribution();
});
</script>

<style scoped></style>
