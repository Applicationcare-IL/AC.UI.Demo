<template>
  <DashboardTeamBar v-if="can('global.is_team_manager')" @update:selected-teams="onSelectedTeams" />
  <div v-if="width > 768" class="dashboard-content">
    <DashboardServices
      v-if="checkIfEntityIsActive('services') && can('services.read')"
      :selected-teams="selectedTeams"
    />
    <DashboardTasks
      v-if="checkIfEntityIsActive('tasks') && can('tasks.read')"
      :selected-teams="selectedTeams"
    />
  </div>
  <div v-else>
    <DashboardMobile />
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import { ref } from "vue";

import DashboardMobile from "./DashboardMobile.vue";
import DashboardServices from "./DashboardServices.vue";
import DashboardTasks from "./DashboardTasks.vue";
import DashboardTeamBar from "./DashboardTeamBar.vue";

const selectedTeams = ref([]);

const { can } = usePermissions();

const { checkIfEntityIsActive } = useLicensing();

const { width } = useWindowSize();

const onSelectedTeams = (value) => {
  selectedTeams.value = value;
};
</script>

<style scoped lang="scss">
:deep(.graphs-min-height) {
  min-height: 21rem;
}

:deep(.p-card .p-card-content) {
  padding: 0;
}
</style>
