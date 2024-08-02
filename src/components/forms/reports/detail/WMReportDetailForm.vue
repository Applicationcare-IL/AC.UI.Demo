<template>
  <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap w-full mt-5">
        <WMReportTable
          class="w-full"
          :report-data="reportData"
          :columns="columns"
          :total-records="totalRecords"
        />
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div v-if="showGraph" class="card mt-5 flex justify-content-center">
          <WMReportGraphPieChart :data="reportData" />
        </div>
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
const { getReportData, getReport, getReportTableColumns, exportReport } = useReports();
const { handleExport } = useExports();

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
const params = ref({});

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let response = await getReport(route.params.id);
  report.value = response.data;
  utilsStore.selectedElements["report"] = [report.value];

  params.value = {
    entity_type: report.value.easymaze_entity.name,
    fields: report.value.fields.join(","),
    group_by: report.value.group_by,
    order_by: report.value.fields_order_by,
    order_dir: report.value.order_dir,
  };

  getReportData(params.value).then((result) => {
    columns.value = getReportTableColumns(
      report.value.fields,
      report.value.easymaze_entity,
      report.value.group_by
    );

    reportData.value = result.data;
    totalRecords.value = result.meta.total;

    showGraph.value = report.value.group_by === 1 ? true : false;
  });
};

loadLazyData();

formUtilsStore.formEntity = "report";
utilsStore.entity = "report";

const exportReportFunction = () => {
  return exportReport(route.params.id, params.value);
};

const handleExportReport = () => {
  handleExport({ exportFunction: exportReportFunction });
};

// PROVIDE, EXPOSE
defineExpose({
  handleExportReport,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
