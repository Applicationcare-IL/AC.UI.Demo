<template>
  <div class="dashboard-column">
    <div class="h1 mb-5">{{ $t("dashboard.my-services") }}</div>

    <div class="flex flex-column gap-5 card-container">
      <Card v-if="false">
        <template #content>
          <div class="flex flex-row gap-5 justify-content-between">
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
            <div class="flex flex-column flex-1 gap-2 px-4 py-2">
              <div class="time-info w-full flex p-2 justify-content-between">
                <div class="flex gap-2">
                  <span> זמן ממוצע שלי </span>
                  <span class="font-bold text-lg">00:10:46</span>
                </div>
                <TrendingMarker :increment="4" />
              </div>
              <div class="time-info w-full flex p-2 justify-content-between">
                <div class="flex gap-2">
                  <span> זמן ממוצע שלי </span>
                  <span class="font-bold text-lg">00:10:46</span>
                </div>
                <TrendingMarker :increment="-2" />
              </div>
            </div>
          </div>
        </template>
      </Card>

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
