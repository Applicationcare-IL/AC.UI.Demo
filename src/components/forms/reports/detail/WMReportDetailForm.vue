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
const { getReportData, getReportTableColumns } = useReports();
const { getAdminReport } = useAdminReports();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const route = useRoute();

// INJECT

// PROPS, EMITS

// REFS
const report = ref();
const reportData = ref();
const totalRecords = ref(0);
const columns = ref([]);

const showGraph = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let reportInfo = await getAdminReport(route.params.id);

  report.value = reportInfo;
  utilsStore.selectedElements["report"] = [report.value];

  let params = {
    entity_type: reportInfo.easymaze_entity.name,
    fields: reportInfo.fields.join(","),
    group_by: reportInfo.group_by,
    order_by: reportInfo.fields_order_by,
    order_dir: reportInfo.order_dir,
  };

  getReportData(params).then((result) => {
    columns.value = getReportTableColumns(
      reportInfo.fields,
      reportInfo.easymaze_entity,
      reportInfo.group_by
    );

    reportData.value = result.data;
    totalRecords.value = result.meta.total;

    showGraph.value = reportInfo.group_by === "1" ? true : false;

    // if (showGraph.value) {
    //   chartData.value = setChartData();
    //   chartOptions.value = setChartOptions();
    // }
  });
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
