<template>
  <WMListSubHeader
    entity="team"
    :total-records="0"
    :show-search-bar="false"
    :show-filter-button="false"
    :has-action-builder="false"
    @new="toggleSidebarVisibility"
  >
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newTeam" @close-sidebar="closeSidebar">
    <template v-if="can('teams.create')">
      <WMNewEntityFormHeader entity="team" name="newTeam" />
      <WMNewTeamForm :is-sidebar="true" @close-sidebar="closeSidebar" />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminTeamsTable />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const isVisible = ref(false);

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

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "team";
});
</script>

<style scoped lang="scss"></style>
