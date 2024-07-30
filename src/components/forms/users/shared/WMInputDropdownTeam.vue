<template>
  <WMInput
      v-if="teamList.length > 0"
      :value="selectedOption"
      name="default-team"
      type="input-select"
      :highlighted="true"
      :label="$t('default-team') + ':'"
      :options="teamList"
      :size="size"
      required
  />
</template>

<script setup>
// IMPORTS

// DEPENDENCIES
import useAdminTeams from "@/composables/useAdminTeams";

const { getTeams } = useAdminTeams();

// INJECT

// PROPS, EMITS
import {onMounted, ref} from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "md",
  },
  selectedTeam: {
    type: Object,
    default: null,
  },
});

// REFS
const teamList = ref([]);
const selectedOption = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadTeams = async () => {
  let response = await getTeams({ per_page: 999999999 });
  teamList.value = response.data.map((team) => {
    return {
      id: team.id,
      label: team.name,
    };
  });
};

const loadSelectedOption = async () => {
  if (props.selectedTeam) {
    selectedOption.value = teamList.value.find((team) => {
      return team.id === props.selectedTeam.id;
    });
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadTeams();
  await loadSelectedOption();
});
</script>

<style scoped></style>
