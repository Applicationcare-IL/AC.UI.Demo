<template>
  <div class="wm-detail-form-container flex flex-auto flex-column overflow-auto mt-5">
    <div class="flex flex-column gap-2">
      <label class="wm-form-label" for="entity">Select an entity:</label>
      <Dropdown
        v-model="selectedEntity"
        name="entity"
        :options="entities"
        option-label="name"
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
          @update:selected-item="onOrderDirChange"
        />
      </div>

      <div class="flex mt-4 gap-2">
        <label class="wm-form-label" for="entity">Group</label>
        <Checkbox v-model="groupBy" name="group_by" :binary="true" />
      </div>

      <WMButton class="mt-3" text="Generate report" type="primary" @click="handleGenerateReport" />
    </template>

    <Divider />

    <WMFilterButton
      v-if="selectedEntity"
      :is-active="isFilterApplied || isFilterVisible"
      @click="openFilterSidebar"
    />

    <WMSidebar
      :visible="isFilterVisible"
      name="filter"
      @close-sidebar="closeFilterSidebar"
      @open-sidebar="openFilterSidebar"
    >
      <WMFilterForm
        :entity="entityNameForFilters"
        :extra-filters="extraFilters"
        :filter-form-name="entityNameForFilters"
        @filters-applied="onFiltersApplied"
      />
    </WMSidebar>

    <div v-if="reportData" class="mt-5">
      <DataTable
        ref="dt"
        lazy
        :value="reportData"
        paginator
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

      <div v-if="showGraph" class="card mt-5 flex justify-content-center">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getEasymazeEntitiesList } = useAdminSystem();
const { getSchema, getSchemaFields } = useSchema();
const { getReport } = useReports();

const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();

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
const filters = ref([]);

// used to pass the filters based on the schema to the filter form
const extraFilters = ref([]);

// COMPUTED
const entityNameForFilters = computed(() => {
  return `${selectedEntity.value?.name}Report`;
});

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Reports POC",
});

const fetchEntities = () => {
  getEasymazeEntitiesList().then((result) => {
    entities.value = result.data;
  });
};

fetchEntities();

const onEntityChange = (entity) => {
  getSchemaFields(entity.name, true).then(async (result) => {
    schemaFields.value = result.map((item) => ({ name: item, id: item, value: item }));
    selectedFields.value = [];
    filters.value = utilsStore.filters[entity.name + "Report"];

    extraFilters.value = await createFiltersBasedOnSchema(entity.name);
  });
};

const onFiltersApplied = () => {
  filters.value = utilsStore.filters[entityNameForFilters.value];
  handleGenerateReport();
};

const jsonToArray = (json) => {
  let result = [];

  for (let key in json) {
    if (json[key].length > 1) {
      let entry = `${key}:${json[key].join(",")}`;
      result.push(entry);
    } else {
      let entry = `${key}:${json[key][0]}`;
      result.push(entry);
    }
  }

  return result;
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
  }

  if (orderDir.value) {
    params.order_dir = orderDir.value.id;
  }

  if (filters.value) {
    params.filters = jsonToArray(filters.value);
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

const onOrderDirChange = (direction) => {
  orderDir.value = direction;
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

  return reportData.value.map((item) => {
    const keys = Object.keys(item).filter((key) => key !== "total");
    const values = keys.map((key) => item[key]);

    return values.join(" - ");
  });
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
          documentStyle.getPropertyValue("--blue-800"),
          documentStyle.getPropertyValue("--green-800"),
          documentStyle.getPropertyValue("--red-800"),
          documentStyle.getPropertyValue("--purple-800"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--cyan-400"),
          documentStyle.getPropertyValue("--orange-400"),
          documentStyle.getPropertyValue("--gray-400"),
          documentStyle.getPropertyValue("--blue-900"),
          documentStyle.getPropertyValue("--green-900"),
          documentStyle.getPropertyValue("--red-900"),
          documentStyle.getPropertyValue("--purple-900"),
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

// FILTERS
const isFilterVisible = ref(false);

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

function getOptionSetValueNames(schema) {
  const result = [];
  for (const key in schema) {
    if (schema[key].type === "relationship" && schema[key].entity === "option_set_value") {
      result.push(key);
    }
  }
  return result;
}

const createFiltersBasedOnSchema = async (entity) => {
  const schemaData = await getSchema(entity);
  const schema = schemaData.data.schema;
  const optionSets = getOptionSetValueNames(schema);

  let result = [];

  for (const optionSet of optionSets) {
    const name = entity + "_" + optionSet;

    const optionSetValues = await optionSetsStore.getOptionSetValuesFromApi(name);

    if (optionSetValues && optionSetValues.length > 0) {
      result.push({
        type: "autocomplete",
        name: optionSet + ".id",
        options: optionSetValues.map((item) => ({
          id: item.id,
          name: item.id,
          value: item.id,
        })),
        label: optionSet + ".id",
      });

      result.push({
        type: "autocomplete",
        name: optionSet + ".value",
        options: optionSetValues.map((item) => ({
          id: item.value,
          name: item.value,
          value: item.value,
        })),
        label: optionSet + ".value",
      });

      result.push({
        type: "autocomplete",
        name: optionSet + ".value_en",
        options: optionSetValues.map((item) => ({
          id: item.value_en,
          name: item.value_en,
          value: item.value_en,
        })),
        label: optionSet + ".value_en",
      });

      result.push({
        type: "autocomplete",
        name: optionSet + ".value_he",
        options: optionSetValues.map((item) => ({
          id: item.value_he,
          name: item.value_he,
          value: item.value_he,
        })),
        label: optionSet + ".value_he",
      });
    }
  }

  return result;
};
</script>

<style scoped lang="scss"></style>
