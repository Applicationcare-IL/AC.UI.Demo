<template>
  <div class="dashboard-column">
    <div class="h1 mb-5">{{ $t("dashboard.my-services") }}</div>

    <div class="flex flex-column gap-5 card-container">
      <Card v-if="false">
        <template #content>
          <div class="flex flex-row gap-6 justify-content-between">
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
            <div class="flex flex-column flex-1 gap-2 py-2">
              <WMTeamsAverageTimeBlock />
              <!-- <WMInlineTrendingTime text="זמן ממוצע שלי" time="00:10:46" quantity="4" />
              <WMInlineTrendingTime text="זמן ממוצע שלי" time="00:10:46" quantity="-2" /> -->
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
                  {{ $t("dashboard.services-distribution-by-sla") }}
                </span>
                <i
                  class="pi pi-ellipsis-v cursor-pointer"
                  @click="openServicesSLADialog"
                ></i>
              </div>
            </template>
            <template #content>
              <div>
                <SLAChart v-if="servicesSLAData" :data="servicesSLAData" />
              </div>
            </template>
          </Card>
          <DashboardServicesSLADialog v-model="showServicesSLADialog" />
        </div>
        <div style="width: 50%">
          <Card v-if="servicesTrendingAreas" class="h-full">
            <template #title> {{ $t("dashboard.trending-service-areas") }}</template>
            <template #content>
              <TrendingList
                v-if="servicesTrendingAreas.length"
                :data="servicesTrendingAreas"
              />
            </template>
          </Card>
        </div>
      </div>
      <Card>
        <template #content>
          <WMServicesTable
            v-if="can('services.read')"
            :columns="serviceColumns"
            :hide-title="true"
            :show-filters="false"
            multiselect
            :filters="dashboardServicesFilters"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { can } = usePermissions();
const optionSetsStore = useOptionSetsStore();
const { getServiceColumns } = useListUtils();
const { getServicesTrendingAreas, getServicesSLADistribution } = useServices();

// INJECT

// PROPS, EMITS

// REFS
const dashboardServicesFilters = ref({
  order_by: "due_date",
});
const serviceColumns = ref(getServiceColumns());
const servicesTrendingAreas = ref([]);
const servicesSLAData = ref(null);
const showServicesSLADialog = ref(false);

// COMPUTED

// COMPONENT METHODS
const openServicesSLADialog = () => {
  showServicesSLADialog.value = true;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  const activeStateId = await optionSetsStore.getValueId("state", "active");

  dashboardServicesFilters.value = {
    ...dashboardServicesFilters.value,
    state: activeStateId,
  };

  servicesTrendingAreas.value = await getServicesTrendingAreas(
    dashboardServicesFilters.value
  );
  servicesSLAData.value = await getServicesSLADistribution(
    dashboardServicesFilters.value
  );
});
</script>

<style scoped></style>
