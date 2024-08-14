<template>
  <SelectButton
    v-if="options.length > 1"
    v-model="selectedOption"
    :options="options"
    option-label="label"
    class="flex flex-nowrap"
    :allow-empty="false"
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
  { label: "All", value: "all" },
  { label: "User", value: "user" },
  { label: "Team", value: "team" },
]);

const selectedOption = ref(options.value[0]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleChangeSelection = ({ value }) => {
  let option = value.value;

  if (option === "all") {
    permissionsRef.value.all = true;
    permissionsRef.value.my_team = true;
    permissionsRef.value.my = true;
  } else if (option === "team") {
    permissionsRef.value.all = false;
    permissionsRef.value.my_team = true;
    permissionsRef.value.my = false;
  } else if (option === "user") {
    permissionsRef.value.all = false;
    permissionsRef.value.my_team = false;
    permissionsRef.value.my = true;
  }
};

const setSelectedOptionBasedOnPermissions = () => {
  if (permissionsRef.value.all) {
    selectedOption.value = options.value[0];
  } else if (permissionsRef.value.my_team) {
    selectedOption.value = options.value[2];
  } else if (permissionsRef.value.my) {
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
