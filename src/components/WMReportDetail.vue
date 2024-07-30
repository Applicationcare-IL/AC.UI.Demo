<template>
  <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <WMReportTable :report-data="reportData" :columns="columns" :total-records="totalRecords" />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES
// const { getReportData, getReportTableColumns } = useReports();

// INJECT

// PROPS, EMITS

// REFS
const reportData = ref();
const totalRecords = ref(0);
const columns = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
// getReportData(params).then((result) => {
//     columns.value = getColumns();
//     reportData.value = result.data;
//     totalRecords.value = result.meta.total;

//   });

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
