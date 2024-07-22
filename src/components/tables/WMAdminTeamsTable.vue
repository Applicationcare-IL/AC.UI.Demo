<template>

  <pre>{{ teams }}</pre>

</template>

<script setup>
// IMPORTS
import {ref} from "vue";

import useAdminTeams from "@/composables/useAdminTeams";

// DEPENDENCIES
const { getTeams } = useAdminTeams();

// INJECT

// PROPS, EMITS

// REFS
const teams = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const nextPage = lazyParams.value.page + 1;

  const params = {
    page: nextPage,
    per_page: 10,
  };

  let response = await getTeams(params);
  teams.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>