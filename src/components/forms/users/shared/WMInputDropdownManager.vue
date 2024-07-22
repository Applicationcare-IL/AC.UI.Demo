<template>
  <WMInput
    v-if="employeeList.length > 0"
    v-model="selectedManager"
    name="manager"
    type="input-select"
    :highlighted="true"
    :label="$t('manager') + ':'"
    :options="employeeList"
    :size="size"
    required
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES
const { getUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS
defineProps({
  size: {
    type: String,
    default: "md",
  },
});

// REFS
const employeeList = ref([]);
const selectedManager = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadEmployees = async () => {
  let response = await getUsers();
  employeeList.value = response.data.map((employee) => {
    return {
      id: employee.id,
      label: employee.username,
    };
  });
};

loadEmployees();

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
