<template>
  <div class="dashboard-column">
    <div class="h1 mb-5">{{ $t("dashboard.my-services") }}</div>

    <div class="flex flex-column gap-5 card-container">
      <!-- TEAM CARD -->
      <!-- <Card>
          <template #content>
            <div class="flex flex-row gap-5 justify-content-center">
              <div
                class="flex flex-row gap-3 px-5 py-1 counter counter-green align-items-center"
              >
                <div class="small-text">
                  תהליכים<br />
                  פתוחים
                </div>
                <div class="big-text green">145</div>
              </div>
              <div
                class="flex flex-row gap-3 px-5 py-1 counter counter-red align-items-center"
              >
                <div class="small-text">
                  תהליכים <br />
                  חורגים
                </div>
                <div class="big-text red">45</div>
              </div>
              <div
                class="flex flex-row gap-3 px-4 py-2 time-info justify-content-between"
              >
                <div class="flex flex-column justify-content-between align-items-start">
                  <div class="white-space-nowrap">זמן ממוצע של הצוות</div>
                  <div class="font-bold">00:08:46</div>
                </div>
                <div class="flex flex-column justify-content-between align-items-end">
                  <i class="pi pi-ellipsis-v"></i>
                  <Tag severity="success" rounded value="+4%"></Tag>
                </div>
              </div>
            </div>
          </template>
        </Card> -->
      <!-- /END TEAM CARD -->
      <div class="flex flex-row gap-5">
        <div style="width: 65%">
          <Card>
            <template #title>
              <div
                class="w-full flex align-items-center justify-content-between"
              >
                <span>
                  {{ $t("dashboard.services-distribution-by-sla") }}
                </span>
                <!-- <i class="pi pi-ellipsis-v"></i> -->
              </div>
            </template>
            <template #content>
              <SLAChart v-if="servicesSLAData" :data="servicesSLAData" />
            </template>
          </Card>
        </div>
        <div style="width: 35%">
          <Card v-if="servicesTrendingAreas" class="h-full">
            <template #title>
              {{ $t("dashboard.trending-service-areas") }}</template
            >
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
            multiselect
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const { can } = usePermissions();

const { getServiceColumns } = useListUtils();

const serviceColumns = ref(getServiceColumns());

const { getServicesTrendingAreas, getServicesSLADistribution } = useServices();

const servicesTrendingAreas = ref([]);
const servicesSLAData = ref(null);

onMounted(async () => {
  servicesTrendingAreas.value = await getServicesTrendingAreas();
  servicesSLAData.value = await getServicesSLADistribution();
});
</script>

<style scoped></style>
