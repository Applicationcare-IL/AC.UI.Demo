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
import { computed, onMounted, ref, toRef } from "vue";

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
  { label: "All", value: "all" },
  { label: "User", value: "user" },
  { label: "Team", value: "team" },
]);

const selectedOption = ref(options.value[0]);

// COMPUTED
const isDisabled = computed(() => {
  return (
    permissionsRef.value.all.disabled &&
    permissionsRef.value.my_team.disabled &&
    permissionsRef.value.my.disabled
  );
});

// COMPONENT METHODS AND LOGIC
const handleChangeSelection = ({ value }) => {
  let option = value.value;

  if (option === "all") {
    permissionsRef.value.all.value = true;
    permissionsRef.value.my_team.value = true;
    permissionsRef.value.my.value = true;
  } else if (option === "team") {
    permissionsRef.value.all.value = false;
    permissionsRef.value.my_team.value = true;
    permissionsRef.value.my.value = false;
  } else if (option === "user") {
    permissionsRef.value.all.value = false;
    permissionsRef.value.my_team.value = false;
    permissionsRef.value.my.value = true;
  }
};

const setSelectedOptionBasedOnPermissions = () => {
  if (permissionsRef.value.all.value) {
    selectedOption.value = options.value[0];
  } else if (permissionsRef.value.my_team.value) {
    selectedOption.value = options.value[2];
  } else if (permissionsRef.value.my.value) {
    selectedOption.value = options.value[1];
  } else {
    selectedOption.value = options.value[1]; // by default select "User"
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  setSelectedOptionBasedOnPermissions();
});
</script>

<style scoped></style>
