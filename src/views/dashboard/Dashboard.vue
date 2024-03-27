<template>
  <DashboardTeamBar v-if="false" />
  <div v-if="width > 768" class="dashboard-content">
    <DashboardServices
      v-if="checkIfEntityIsActive('services') && can('services.read')"
    />
    <DashboardTasks
      v-if="checkIfEntityIsActive('tasks') && can('tasks.read')"
    />
  </div>
  <div v-else>
    <DashboardMobile />
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";

import DashboardMobile from "./DashboardMobile.vue";
import DashboardServices from "./DashboardServices.vue";
import DashboardTasks from "./DashboardTasks.vue";
import DashboardTeamBar from "./DashboardTeamBar.vue";

const { can } = usePermissions();

const { checkIfEntityIsActive } = useLicensing();

const { width } = useWindowSize();
</script>
