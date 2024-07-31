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
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
// const { getReportData, getReportTableColumns } = useReports();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS
const report = ref();
const reportData = ref();
const totalRecords = ref(0);
const columns = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  report.value = await getAdminReport(route.params.id);
  // team.value = await getTeam(route.params.id);
  // utilsStore.selectedElements["team"] = [team.value];
};

loadLazyData();

formUtilsStore.formEntity = "report";
utilsStore.entity = "report";

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
