<template>
  <!-- <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row gap-3 align-items-center">
        <div class="label h5">בחירaaaת צוותים:</div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="searchValue"
            class="input-search"
            placeholder="Search"
          />
        </span>
        <WMButton class="m-1 col-6 small" name="basic-primary"
          >בחר הכל
        </WMButton>
        <WMButton class="m-1 col-6 small" name="basic-secondary">{{
          $t("buttons.clear-all")
        }}</WMButton>
      </div>
      <div class="flex flex-row gap-3">
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">מוקד 106</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">אגף רישוי ופיקוח (הנדסה)</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">GIS</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
        <Tag>
          <div class="flex align-items-center gap-2">
            <span class="">גביה</span>
            <i class="pi pi-times"></i>
          </div>
        </Tag>
      </div>
    </div>
  </div> -->

  <div v-if="width > 768" class="dashboard-content">
    <div
      v-if="checkIfEntityIsActive('services') && can('services.read')"
      class="dashboard-column"
    >
      <div class="h1 mb-5">{{ $t("dashboard.my-services") }}</div>

      <!-- Charts -->
      <div class="flex flex-column gap-5 card-container">
        <Card>
          <template #content> test </template>
        </Card>
      </div>
    </div>

    <!-- Tables -->
    <div
      v-if="checkIfEntityIsActive('services') && can('services.read')"
      class="dashboard-column"
    >
      <!-- Services -->

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
    <div
      v-if="checkIfEntityIsActive('tasks') && can('tasks.read')"
      class="dashboard-column card-container"
    >
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
                    {{ $t("dashboard.services-distribution-by-sla") }}
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
              <template #title>
                {{ $t("dashboard.top-task-families") }}</template
              >
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
  </div>
  <div v-else>
    <div v-if="loadingBadges" class="w-full flex justify-content-center mt-5">
      <ProgressSpinner />
    </div>
    <div v-else class="flex flex-column gap-2 m-3 mt-4">
      <div class="open-tasks-mobile">
        <router-link :to="{ name: 'myOpenTasksMobile' }">
          <Button
            :label="$t('navigation.my-open-tasks')"
            size="large"
            class="w-full p-5"
          />
        </router-link>
        <div class="open-tasks-mobile__badges flex gap-2">
          <Badge :value="numberOfTasksWithNoBreachSLA" severity="success" />
          <Badge :value="numberOfTasksWithNearBreachedSLA" severity="warning" />
          <Badge :value="numberOfTasksWithBreachedSLA" severity="danger" />
        </div>
      </div>
      <router-link :to="{ name: 'myClosedTasksMobile' }">
        <Button
          :label="$t('navigation.my-closed-tasks')"
          size="large"
          class="w-full p-5"
        />
      </router-link>
      <router-link :to="{ name: 'newServiceMobile' }">
        <Button
          :label="$t('navigation.new-service')"
          size="large"
          class="w-full p-5"
          severity="success"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import { onMounted, ref } from "vue";

import { useAuthStore } from "@/stores/auth";

const { can } = usePermissions();

const authStore = useAuthStore();

const { getTaskColumns, getServiceColumns } = useListUtils();
const { checkIfEntityIsActive } = useLicensing();
const { getTasksFromApi, getTasksSLADistribution } = useTasks();

const taskColumns = ref(getTaskColumns());
const serviceColumns = ref(getServiceColumns());

const { getServicesTrendingAreas, getServicesSLADistribution } = useServices();
const { getTopTaskFamilies } = useTasks();

const { width } = useWindowSize();

const tasks = ref([]);
const numberOfTasksWithBreachedSLA = ref(0);
const numberOfTasksWithNearBreachedSLA = ref(0);
const numberOfTasksWithNoBreachSLA = ref(0);

const servicesTrendingAreas = ref([]);
const servicesSLAData = ref(null);

const topTaskFamilies = ref([]);
const tasksSLAData = ref(null);

const loadingBadges = ref(true);

const fetchTasks = () => {
  const params = {
    employee: authStore.user.id,
    per_page: 9999,
  };

  getTasksFromApi(params).then(({ data }) => {
    tasks.value = data;
    loadingBadges.value = false;

    numberOfTasksWithBreachedSLA.value = data.filter(
      (task) => task.sla.sla === "breached"
    ).length;

    numberOfTasksWithNearBreachedSLA.value = data.filter(
      (task) => task.sla.sla === "near_breach"
    ).length;

    numberOfTasksWithNoBreachSLA.value = data.filter(
      (task) => task.sla.sla === "no_breach"
    ).length;
  });
};

fetchTasks();

// OLD CODE
// const customers = ref();
// const selectedCustomers = ref([]);

// const isAnyRowSelected = computed(() => {
//   return selectedCustomers?.value.length > 0;
// });

onMounted(async () => {
  servicesTrendingAreas.value = await getServicesTrendingAreas();
  servicesSLAData.value = await getServicesSLADistribution();

  topTaskFamilies.value = await getTopTaskFamilies();
  tasksSLAData.value = await getTasksSLADistribution();
});
</script>

<style scoped lang="scss">
.open-tasks-mobile {
  position: relative;

  &__badges {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
