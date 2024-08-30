<template>
  <div class="flex flex-column gap-2">
    <div class="flex align-items-center gap-2">
      <label class="wm-form-label highlighted">{{ $t("employee.default-team") + ":" }}</label>
      <div
        v-tooltip.bottom="$t('employee.default-message-help-text')"
        class="flex"
        v-html="HelpIcon"
      />
    </div>

    <WMInput
      v-if="true"
      :value="selectedOption"
      name="default_team"
      type="input-select"
      :highlighted="true"
      :placeholder="$t('employee.select-default-team')"
      :options="teams"
      custom-option-label="name"
      :size="size"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import HelpIcon from "/icons/help.svg?raw";

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
  },
});

// REFS
const selectedOption = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadSelectedOption = async () => {
  if (props.teams) {
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
