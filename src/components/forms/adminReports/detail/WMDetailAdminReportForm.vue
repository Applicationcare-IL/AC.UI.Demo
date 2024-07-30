<template>
  <div v-if="report" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-2 card-container top-info-card">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <pre>{{ selectedEntity }}</pre>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="report.id"
                  />
                </div>
                <div class="flex flex-column gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('first-name') + ':'"
                    :value="report.name"
                    required
                  />
                  <WMInput
                    id="description"
                    type="text-area"
                    :label="$t('description') + ':'"
                    name="description"
                    size="md"
                    :value="report.description"
                    required
                  />
                  <WMInputCheckbox
                    :v-model="isPrivate"
                    :value="isPrivate"
                    name="private"
                    :label="$t('private')"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("admin-report.report-configuration") }} </template>
            <template #content>
              <!-- <pre>{{ report }}</pre> -->
              <div class="flex flex-column gap-2">
                <label class="wm-form-label" for="entity">{{ $t("entity") }}:</label>
                <WMInput
                  v-if="entities.length > 0"
                  :value="selectedEntity"
                  name="entity"
                  type="input-select"
                  :highlighted="true"
                  required="true"
                  :label="$t('admin-reports.select-an-entity') + ':'"
                  :options="entities"
                  custom-option-label="name"
                  size="w-full"
                  @update:selected-item="setSelectedEntity"
                />

                <template v-if="selectedEntity && schemaFields">
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
                    <WMInputCheckbox
                      :v-model="groupBy"
                      :value="groupBy"
                      name="group_by"
                      :label="$t('group')"
                    />
                  </div>

                  <WMButton
                    class="mt-3"
                    text="Generate report"
                    type="primary"
                    @click="handleGenerateReport"
                  />
                </template>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div>
        <div v-if="reportData" class="mt-5">
          <Accordion :active-index="0">
            <AccordionTab :header="$t('admin-report.report')">
              <WMFilterButton
                v-if="selectedEntity"
                :is-active="isFilterApplied || isFilterVisible"
                class="mt-2 mb-3"
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

              <!-- <pre>{{ reportData }}</pre> -->
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
              showGraph {{ showGraph }}
              <div v-if="showGraph" class="card mt-5 flex justify-content-center">
                <Chart
                  type="pie"
                  :data="chartData"
                  :options="chartOptions"
                  class="w-full md:w-30rem"
                />
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
  <!-- 
  report DETAIL:
  <pre>{{ report }}</pre> -->
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getReportData } = useReports();
const { getAdminReport, updateReport, parseReport } = useAdminReports();
const { getEasymazeEntitiesList } = useAdminSystem();
const { getSchema, getSchemaFields } = useSchema();

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const toast = useToast();
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["reportUpdated"]);

// REFS
const report = ref(null);

const entities = ref([]);
const selectedEntity = ref();
const selectedFields = ref([]);
const schemaFields = ref();
const groupBy = ref(false);
const orderByField = ref();
const orderDirOptions = ref([
  { name: "ASC", id: "ASC" },
  { name: "DESC", id: "DESC" },
]);
const isPrivate = ref(false);
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

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, values, resetForm } = useForm({
  validationSchema: formUtilsStore.getreportUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  const updateReportData = {
    ...values,
    easymaze_entity: selectedEntity.value.id,
  };

  updateReport(route.params.id, parseReport(updateReportData))
    .then(() => {
      toast.success({ message: "Report updated successfully" });
      resetForm({ values: values });
      emit("reportUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating report");
    });
});

const loadLazyData = async () => {
  let response = await getAdminReport(route.params.id);
  report.value = response;

  setSelectedEntity(report.value.easymaze_entity);
  await reloadEntityRelatedFields(report.value.easymaze_entity.name);

  // load dropdowns
  isPrivate.value = report.value.private === 1 ? true : false;
  groupBy.value = report.value.group_by === 1 ? true : false;

  if (report.value.fields) {
    setSelectedFields(report.value.fields);
  }

  orderByField.value = schemaFields.value.find((item) => item.id === report.value.fields_order_by);

  utilsStore.selectedElements["admin-report"] = [report.value];
};

formUtilsStore.formEntity = "admin-report";
utilsStore.entity = "admin-report";

const setSelectedEntity = (easymaze_entity) => {
  selectedEntity.value = entities.value.find((entity) => entity.id === easymaze_entity.id);

  reloadEntityRelatedFields(selectedEntity.value);
};

const setSelectedFields = (fields) => {
  selectedFields.value = schemaFields.value.filter((field) => fields.includes(field.id));
};

const fetchEntities = () => {
  getEasymazeEntitiesList().then((result) => {
    entities.value = result.data;
  });
};

const reloadEntityRelatedFields = async (entity) => {
  await getSchemaFields(entity.name, true).then(async (result) => {
    schemaFields.value = result.map((item) => ({ name: item, id: item, value: item }));

    selectedFields.value = [];
    filters.value = utilsStore.filters[entity.name + "Report"];

    extraFilters.value = await createFiltersBasedOnSchema(entity.name);
  });
};

const onOrderDirChange = (direction) => {
  orderDir.value = direction;
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

  getReportData(params).then((result) => {
    columns.value = getColumns();
    reportData.value = result.data;
    showGraph.value = values.group_by;
    totalRecords.value = result.meta.total;

    // graph
    if (showGraph.value) {
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    }
  });
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

const closeFilterSidebar = () => {
  isFilterVisible.value = false;
};

const openFilterSidebar = () => {
  isFilterVisible.value = true;
};

const getOptionSetValueNames = (schema) => {
  const result = [];
  for (const key in schema) {
    if (schema[key].type === "relationship" && schema[key].entity === "option_set_value") {
      result.push(key);
    }
  }
  return result;
};

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

// PROVIDE, EXPOSE
defineExpose({
  onSave,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await fetchEntities();
  await loadLazyData();
  setTimeout(() => {
    resetForm();
  }, 500);
});
</script>
