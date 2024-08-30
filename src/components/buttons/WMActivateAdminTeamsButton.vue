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
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedTeams: {
    type: Array,
    default: () => [],
  },

});

const emit = defineEmits(["activateTeam"]);

// REFS

// COMPUTED
const inactiveTeams = computed(() => {
  if (props.selectedTeams) {
    return props.selectedTeams.filter((team) => team.state.value === 'not_active');
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
  const selectedTeamIds = inactiveTeams.value.map((team) => team.id);
  activateTeams(selectedTeamIds).then(() => {
    emit("activateTeam");
    toast.success({title: "Team activated", message: "Team activated successfully", group: "bl"});
  }).catch((error) => {
    console.error(error);
    toast.error("error");
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
