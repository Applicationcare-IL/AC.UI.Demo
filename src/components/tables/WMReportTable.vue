<template>
  <DataTable
    ref="dt"
    lazy
    :value="reportData"
    paginator
    :rows="rows"
    :first="0"
    :total-records="totalRecords"
    @page="handleOnPage"
  >
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="$t(column.header)"
    />
  </DataTable>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  reportData: Array,
  columns: Array,
  totalRecords: Number,
});

const emit = defineEmits(["update:page"]);

// REFS
const rows = ref(10);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleOnPage = (event) => {
  emit("update:page", event);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
