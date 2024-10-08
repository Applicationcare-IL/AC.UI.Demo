<template>
  <WMListSubHeader
    entity="team"
    :total-records="0"
    :has-action-builder="false"
    :show-communications="false"
    @new="toggleSidebarVisibility"
  >
    <template #custom-buttons>
      <WMActivateAdminTeamsButton
        :selected-teams="selectedTeams"
        @activate-team="handleActivateTeam"
      />
    </template>
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newTeam" @close-sidebar="closeSidebar">
    <template v-if="can('teams.create')">
      <WMNewEntityFormHeader entity="team" name="newTeam" />
      <WMNewTeamForm
        :is-sidebar="true"
        @close-sidebar="closeSidebar"
        @new-team-created="handleNewTeamCreated"
      />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminTeamsTable ref="adminTeamTable" @update:selection="onSelectionChanged" />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import WMListSubHeader from "@/components/layout/WMListSubHeader.vue";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const isVisible = ref(false);
const adminTeamTable = ref();
const selectedTeams = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Teams",
});

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const handleNewTeamCreated = () => {
  adminTeamTable.value.loadLazyData();
};

const onSelectionChanged = (newSelectedTeams) => {
  selectedTeams.value = newSelectedTeams;
};

const handleActivateTeam = () => {
  adminTeamTable.value.loadLazyData();
  adminTeamTable.value.cleanSelectedTeams();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "team";
});
</script>

<style scoped lang="scss"></style>
