<template>
  <div v-if="report" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-2 card-container top-info-card">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <!-- <pre>{{ values.fields }}</pre> -->
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
                  <!-- <pre>{{ selectedFields }}</pre>
                  <pre>{{ schemaFields[0] }}</pre> -->
                  <WMInputSearch
                    v-if="schemaFields"
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
                    <WMInputCheckbox :value="groupBy" name="group_by" :label="$t('group')" />
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
        <div v-if="reportData && showReportPreview" class="mt-5">
          <Accordion :active-index="0">
            <AccordionTab :header="$t('admin-report.report')">
              <!-- <WMFilterButton
                v-if="selectedEntity"
                :is-active="isFilterApplied || isFilterVisible"
                class="mt-2 mb-3"
                @click="openFilterSidebar"
              /> -->

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

              <WMReportTable
                :report-data="reportData"
                :columns="columns"
                :total-records="totalRecords"
                @update:page="onPage"
              />

              <div v-if="showGraph" class="card mt-5 flex justify-content-center">
                <WMReportGraphPieChart :data="reportData" />
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
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
const { getReportData, getReportTableColumns } = useReports();
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
const showReportPreview = ref(false);

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
const columns = ref([]);

const showGraph = ref(false);
const filters = ref([]);

const lazyParams = ref({});

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

  await setSelectedEntity(report.value.easymaze_entity);

  // load dropdowns
  isPrivate.value = report.value.private === 1 ? true : false;
  groupBy.value = report.value.group_by === 1 ? true : false;
  orderDir.value = orderDirOptions.value.find(
    (item) => item.id === report.value.order_dir.toUpperCase()
  );

  if (report.value.fields) {
    setSelectedFields(report.value.fields);
  }

  orderByField.value = schemaFields.value.find((item) => item.id === report.value.fields_order_by);

  utilsStore.selectedElements["admin-report"] = [report.value];
};

formUtilsStore.formEntity = "admin-report";
utilsStore.entity = "admin-report";

const setSelectedEntity = async (easymaze_entity) => {
  selectedEntity.value = entities.value.find((entity) => entity.id === easymaze_entity.id);
  selectedFields.value = [];

  await loadEntityRelatedFields(selectedEntity.value);
};

const setSelectedFields = (fields) => {
  selectedFields.value = schemaFields.value.filter((field) => fields.includes(field.id));
};

const fetchEntities = () => {
  getEasymazeEntitiesList().then((result) => {
    entities.value = result.data;
  });
};

const loadEntityRelatedFields = async (entity) => {
  await getSchemaFields(entity.name, true).then(async (result) => {
    schemaFields.value = result.map((item) => ({ name: item, id: item, value: item }));
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

  if (!values.fields.length) {
    alert("Please select fields to include in the report");
    showReportPreview.value = false;

    return;
  }

  showReportPreview.value = true;

  const nextPage = lazyParams.value.page + 1;

  let params = {
    page: nextPage ? nextPage : 1,
    per_page: 10,
    entity_type: selectedEntity.value.name,
    fields: selectedFields.value.map((item) => item.id).join(","),
    group_by: values.group_by ? "1" : "0",
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
    columns.value = getReportTableColumns(
      selectedFields.value.map((field) => field.name),
      selectedEntity.value,
      values.group_by
    );

    reportData.value = result.data;
    showGraph.value = values.group_by;
    totalRecords.value = result.meta.total;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  handleGenerateReport();
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
});
</script>
