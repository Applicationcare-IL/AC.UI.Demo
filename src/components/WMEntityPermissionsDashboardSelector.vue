<template>
  <SelectButton
    v-if="options.length > 1"
    v-model="selectedOption"
    :options="options"
    option-label="label"
    class="flex flex-nowrap"
    :allow-empty="false"
    :disabled="isDisabled"
    @change="handleChangeSelection"
  />
</template>

<script setup>
// IMPORTS
import { onMounted, ref, toRef } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  permissions: {
    type: Array,
    required: true,
  },
});

// REFS
const permissionsRef = toRef(props, "permissions");

const options = ref([
  { label: "Basic", value: "basic" },
  { label: "Support", value: "support" },
  { label: "Team Leader", value: "team_leader" },
]);

const selectedOption = ref(options.value[0]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleChangeSelection = ({ value }) => {
  let option = value.value;

  if (option === "basic") {
    permissionsRef.value.is_team_manager.value = false;
    permissionsRef.value.is_support_rep.value = false;
  } else if (option === "support") {
    permissionsRef.value.is_team_manager.value = false;
    permissionsRef.value.is_support_rep.value = true;
  } else if (option === "team_leader") {
    permissionsRef.value.is_team_manager.value = true;
    permissionsRef.value.is_support_rep.value = false;
  }
};

const setSelectedOptionBasedOnPermissions = () => {
  if (permissionsRef.value.is_team_manager.value) {
    selectedOption.value = options.value[2];
    return;
  }

  if (permissionsRef.value.is_support_rep.value) {
    selectedOption.value = options.value[1];
    return;
  }

  selectedOption.value = options.value[0];
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  setSelectedOptionBasedOnPermissions();
});
</script>

<style scoped></style>
