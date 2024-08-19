<template>
  <WMInput
    v-if="employeeList.length > 0"
    :value="selectedOption"
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
import { onMounted, ref } from "vue";

// DEPENDENCIES
const { getUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  size: {
    type: String,
    default: "md",
  },
  selectedManager: {
    type: Object,
    default: null,
  },
});

// REFS
const employeeList = ref([]);
const selectedOption = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadEmployees = async () => {
  let response = await getUsers({
    per_page: 999999999,
    state: 291
  });

  employeeList.value = response.data.map((employee) => {
    return {
      id: employee.id,
      label: employee.username,
    };
  });
};

const loadSelectedOption = async () => {
  if ( props.selectedManager ){
    selectedOption.value = employeeList.value.find((manager) => {
      return manager.id === props.selectedManager.id;
    });
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadEmployees();
  await loadSelectedOption();
});
</script>

<style scoped></style>
