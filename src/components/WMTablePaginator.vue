<template>
  <Paginator
    :rows="10"
    :total-records="120"
    :rows-per-page-options="[10, 20, 30]"
    template="CurrentPageReport RowsPerPageDropdown"
    current-page-report-template="Showing {first}-{last} of {totalRecords}"
    @update:rows="onRowsUpdate"
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

const onRowsUpdate = (event) => {
  console.log(event);
};

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
