<template>
  <!-- <WMListSubHeader
    :total-records="totalRecords"
    entity="project"
    :show-header="false"
    @refresh-table="loadLazyData()"
  /> -->
  <!-- <pre>{{ reportData }}</pre>
  <pre>{{ columns }}</pre> -->
  <!-- <pre style="height: 500px">{{ reportData }}</pre> -->

  <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto mt-5">
    <div class="flex flex-column gap-2">
      <label class="wm-form-label" for="entity">Select an entity:</label>
      <Dropdown
        name="entity"
        v-model="selectedEntity"
        :options="entities"
        optionLabel="name"
        placeholder="Select an entity"
        class="w-full md:w-14rem"
        @change="onEntityChange($event.value)"
      />
    </div>

    <template v-if="selectedEntity">
      <WMInputSearch
        label="Fields to include"
        name="fields"
        placeholder="Select fields"
        :multiple="true"
        size="full"
        class="mt-5"
        :options="schemaFields"
        :model-value="selectedFields"
        @update:model-value="selectedFields = $event"
      />

      <div class="mt-4 flex gap-3">
        <WMInputSearch
          label="Order by"
          name="orderByField"
          placeholder="Select field"
          :multiple="false"
          size="sm"
          :options="schemaFields"
          :model-value="orderByField"
          @update:model-value="orderByField = $event"
        />

        <WMInput
          name="orderDir"
          type="input-select-button"
          :highlighted="true"
          label="Order dir"
          :options="orderDirOptions"
          :value="orderDir"
          @update:selected-item="onOrderDirChange($event)"
        />
      </div>

      <div class="flex mt-4 gap-2">
        <label class="wm-form-label" for="entity">Group</label>
        <Checkbox v-model="groupBy" name="group_by" :binary="true" />
      </div>

      <WMButton class="mt-3" text="Generate report" type="primary" @click="handleGenerateReport" />
    </template>

    <template v-if="reportData">
      <Divider class="mt-5 mb-6" />

      <DataTable
        ref="dt"
        lazy
        :value="reportData"
        paginator
        scrollable
        scroll-height="flex"
        :rows="rows"
        :first="0"
        :total-records="totalRecords"
      >
        <Column
          v-for="column in columns"
          :key="column.field"
          :field="column.field"
          :header="$t(column.header)"
        />
      </DataTable>

      <div class="card mt-5 flex justify-content-center" v-if="showGraph">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
      </div>
    </template>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getEasymazeEntitiesList } = useAdminSystem();
const { getSchemaFields } = useSchema();
const { getReport } = useReports();

// INJECT

// PROPS, EMITS

// REFS
const entities = ref([]);
const selectedEntity = ref();
const schemaFields = ref();
const selectedFields = ref([]);
const groupBy = ref(false);
const orderByField = ref();
const orderDirOptions = ref([
  { name: "ASC", id: "ASC" },
  { name: "DESC", id: "DESC" },
]);
const orderDir = ref(orderDirOptions.value[0]);
const reportData = ref();

const totalRecords = ref(0);
const rows = ref(10);
const columns = ref([]);

const showGraph = ref(false);
// COMPUTED

// COMPONENT METHODS AND LOGIC
const fetchEntities = () => {
  getEasymazeEntitiesList().then((result) => {
    entities.value = result.data;
  });
};

fetchEntities();

const onEntityChange = (entity) => {
  getSchemaFields(entity.name, true).then((result) => {
    schemaFields.value = result.map((item) => ({ name: item, id: item }));
    selectedFields.value = [];
  });
};

const handleGenerateReport = () => {
  if (!selectedEntity.value) return;
  if (!selectedFields.value.length) {
    alert("Please select fields to include in the report");
    return;
  }

  let params = {
    entity_type: selectedEntity.value.name,
    fields: selectedFields.value.map((item) => item.id).join(","),
    group_by: groupBy.value ? "1" : "0",
  };

  if (orderByField.value) {
    params.order_by = orderByField.value.name;
    params.order_dir = orderDir.value.id;
  }

  getReport(params).then((result) => {
    columns.value = getColumns();
    showGraph.value = groupBy.value ? true : false;
    reportData.value = result.data;
    totalRecords.value = result.meta.total;

    // graph
    if (showGraph.value) {
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    }
  });
};

const onOrderDirChange = (orderDir) => {
  orderDir.value = orderDir;
};

const getColumns = () => {
  if (!selectedFields.value) return [];

  let columns = selectedFields.value.map((item) => ({
    field: item.id,
    header: selectedEntity.value.name + "." + item.name,
  }));

  if (groupBy.value) {
    columns.unshift({
      field: "total",
      header: "Count",
    });
  }

  return columns;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)

// CHARTS DEMO
const chartData = ref();
const chartOptions = ref();

const getGraphLabels = () => {
  if (!reportData.value) return [];

  let key = Object.keys(reportData.value[0])[0];
  return reportData.value.map((item) => item[key]);
};

const getGraphData = () => {
  if (!reportData.value) return [];

  let key = Object.keys(reportData.value[0])[1];
  return reportData.value.map((item) => item[key]);
};

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: getGraphLabels(),
    datasets: [
      {
        data: getGraphData(),
        backgroundColor: [
          documentStyle.getPropertyValue("--cyan-500"),
          documentStyle.getPropertyValue("--orange-500"),
          documentStyle.getPropertyValue("--gray-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--cyan-400"),
          documentStyle.getPropertyValue("--orange-400"),
          documentStyle.getPropertyValue("--gray-400"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
};
</script>

<style scoped lang="scss"></style>
