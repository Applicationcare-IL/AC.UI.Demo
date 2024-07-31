<template>
  <WMInput
      v-if="true"
      :value="selectedOption"
      name="default-team"
      type="input-select"
      :highlighted="true"
      :label="$t('default-team') + ':'"
      :options="teams"
      custom-option-label="name"
      :size="size"
      required
  />
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  size: {
    type: String,
    default: "md",
  },
  selectedTeam: {
    type: Object,
    default: null,
  },
  teams: {
    type: Array,
    default: null,
  }
});

// REFS
const selectedOption = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadSelectedOption = async () => {
  if (props.teams){
    selectedOption.value = props.teams.find((team) => {
      return team.id === props.selectedTeam.id;
    });
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadSelectedOption();
});
</script>

<style scoped></style>
