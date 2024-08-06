<template>
  <WMButton
      :text="'Activate'"
      type="type-5"
      :is-disabled="isDisabled"
      :disabled="isDisabled"
      @click="handleActivateTeams"
  >
    <template #customIcon>
      <div class="flex" v-html="ActivateTeamIcon" />
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import {computed} from "vue";

import ActivateTeamIcon from "/icons/activate_user.svg?raw";
import useAdminTeams from "@/composables/useAdminTeams";

// DEPENDENCIES
const { activateTeams } = useAdminTeams();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedTeams: Array,
});

const emit = defineEmits(["activateTeam"]);

// REFS

// COMPUTED
const inactiveTeams = computed(() => {
  if (props.selectedTeams) {
    return props.selectedTeams.filter((team) => team.active === 0);
  }

  return [];
});

const isDisabled = computed(() => {
  if (props.selectedTeams.length === 0) {
    return true;
  }

  if (inactiveTeams.value.length > 0) {
    return false;
  }

  return true;
});

// COMPONENT METHODS AND LOGIC
const handleActivateTeams = () => {
  const inactiveTeams = props.selectedTeams.filter((team) => team.active === 0);
  const selectedTeamsIds = inactiveTeams.map((team) => team.id);
  activateTeams(selectedTeamsIds).then(() => {
    emit("activateTeam");
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
