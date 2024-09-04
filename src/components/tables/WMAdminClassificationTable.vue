<template>
  <DataTable
      v-model:selection="selectedClassifications"
      lazy
      :value="classifications"
      data-key="id"
      scrollable
      paginator
      :rows="10"
      :total-records="totalRecords"
      class="w-full"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
  >
    <Column
        v-for="column in columns"
        :key="column.name"
        :field="column.name"
        :header="$t(column.header)"
        :class="column.class"
        :style="column.width ? { width: column.width } : {}"
    >
      <template #body="{ data }">
        <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column"/>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import {ref, watch, watchEffect} from "vue";

import useAdminClassifications from "@/composables/useAdminClassifications";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const {getClassifications} = useAdminClassifications();

// INJECT

// PROPS, EMITS
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  preview: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:selection"]);

// REFS
const selectedClassifications = ref([]);
const totalRecords = ref(0);
const classifications = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["classification"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  const serviceClassification = [{
    id: 1,
    state: {
      "id": 292,
      "value": "not_active",
      "value_en": "Not Active",
      "value_he": "לא פעיל",
      "attributes": []
    },
    service_area: "service area data",
    service_detail: "service detail",
    request_1: "request 1",
    request_2: "request 2",
    request_3: "request 3",
  }];

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  // let response = await getClassifications(params);
  // classifications.value = response.data;
  classifications.value = serviceClassification;

  // totalRecords.value = response.totalRecords;
  // totalRecords.value = 1;

};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedClassifications.value);
};

const cleanSelectedClassifications = () => {
  selectedClassifications.value = [];
  onSelectionChanged();
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedClassifications,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
    () => utilsStore.searchString["classification"],
    () => {
      searchValue.value = utilsStore.searchString["classification"];
      utilsStore.debounceAction(() => {
        loadLazyData();
      });
    },
    {deep: true}
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
