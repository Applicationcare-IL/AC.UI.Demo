<template>
  <div class="dashboard-column">
    <div class="h1 mb-5">{{ $t("dashboard.my-services") }}</div>

    <div class="flex flex-column gap-5 card-container">
      <Card
        v-if="
          (can('global.is_support_rep') && servicesSLAData) ||
          (can('global.is_team_manager') && servicesSLAData)
        "
      >
        <template #content>
          <div class="flex flex-row gap-6 justify-content-between">
            <div
              class="flex flex-row gap-4 px-5 py-2 counter counter-green align-items-center"
            >
              <div class="small-text counter__label">
                {{ $t("dashboard.open-services") }}
              </div>
              <div class="text-5xl font-bold green">{{ openServices }}</div>
            </div>
            <div
              class="flex flex-row gap-3 px-5 py-2 counter counter-red align-items-center"
            >
              <div class="small-text counter__label">
                {{ $t("dashboard.breached-services") }}
              </div>
              <div class="text-5xl font-bold red">45</div>
            </div>
            <div class="flex flex-column gap-2 py-2 w-25rem">
              <!-- <WMTeamsAverageTimeBlock /> -->
              <WMInlineTrendingTime
                v-if="myAvgDuration"
                :text="$t('dashboard.my-average')"
                :time="myAvgDuration.actual.formated"
                :quantity="myAvgDuration.increment"
              />
              <WMInlineTrendingTime
                v-if="teamsAvgDuration"
                :text="$t('dashboard.teams-average')"
                :time="teamsAvgDuration.actual.formated"
                :quantity="teamsAvgDuration.increment"
              />
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
import { computed, onMounted, ref, watch } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { can } = usePermissions();
const optionSetsStore = useOptionSetsStore();
const { getServiceColumns } = useListUtils();
const {
  getServicesTrendingAreas,
  getServicesSLADistribution,
  getAvgDuration,
} = useServices();
const authStore = useAuthStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedTeams: Array,
});

// REFS
const dashboardServicesFilters = ref({
  order_by: "due_date",
});

const serviceColumns = ref(getServiceColumns());
const servicesTrendingAreas = ref([]);
const servicesSLAData = ref(false);
const showServicesSLADialog = ref(false);

const myAvgDuration = ref(null);
const teamsAvgDuration = ref(null);

const activeStateId = ref(null);
const completedStatusId = ref(null);

// COMPUTED
const openServices = computed(() => {
  if (!servicesSLAData.value) {
    return 0;
  }

  const nearBreach =
    servicesSLAData.value.find((item) => item.sla_status === "near_breach")?.value || 0;
  const noBreach =
    servicesSLAData.value.find((item) => item.sla_status === "no_breach")?.value || 0;
  const breached =
    servicesSLAData.value.find((item) => item.sla_status === "breached")?.value || 0;

  return nearBreach + noBreach + breached;
});

// COMPONENT METHODS AND LOGIC
const openServicesSLADialog = () => {
  showServicesSLADialog.value = true;
};

const getMyAverageDuration = () => {
  const myAverageDurationFilters = {
    service_status: completedStatusId.value,
    employee: authStore.user.id,
  };

  return getAvgDuration(myAverageDurationFilters);
};

const getTeamsAverageDuration = () => {
  const teamsAverageDurationFilters = {
    service_status: completedStatusId.value,
  };

  if (props.selectedTeams && props.selectedTeams.length) {
    teamsAverageDurationFilters.owner_id = props.selectedTeams
      .map((team) => team.id)
      .join(",");
    teamsAverageDurationFilters.owner_type = "team";
  }

  return getAvgDuration(teamsAverageDurationFilters);
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => props.selectedTeams,
  async () => {
    teamsAvgDuration.value = await getTeamsAverageDuration();
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  activeStateId.value = await optionSetsStore.getValueId("state", "active");
  completedStatusId.value = await optionSetsStore.getValueId(
    "service_status",
    "completed"
  );

  dashboardServicesFilters.value = {
    ...dashboardServicesFilters.value,
    state: activeStateId.value,
  };

  servicesTrendingAreas.value = await getServicesTrendingAreas(
    dashboardServicesFilters.value
  );
  servicesSLAData.value = await getServicesSLADistribution(
    dashboardServicesFilters.value
  );

  myAvgDuration.value = await getMyAverageDuration();
  teamsAvgDuration.value = await getTeamsAverageDuration();
});
</script>

<style scoped></style>
