<template>
  <h2 class="h2">
    {{ $t("documents.select-an-existing-document") }}
  </h2>

  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="existing-document" />
    </div>
  </div>
  <DataTable
    v-model:selection="selectedDocument"
    selection-mode="single"
    lazy
    :value="documents"
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
        <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getDocumentsFromApi } = useDocuments();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
defineProps({
  hideTitle: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:selection"]);

// REFS
const totalRecords = ref(0);
const selectedDocument = ref();
const rows = ref(20);
const lazyParams = ref({});
const documents = ref([]);
const searchValue = ref("");

const columns = [
  {
    name: "id",
    type: "text",
    field: "id",
    header: "documents.id",
  },
  {
    name: "document_type",
    type: "option-set",
    field: "document_type",
    header: "documents.type",
  },
  {
    name: "document_detail",
    type: "option-set",
    field: "document_detail",
    header: "documents.detail",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "documents.name",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["existing-document"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = rows.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  getDocumentsFromApi(params).then((result) => {
    documents.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedDocument.value);
};

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["existing-document"],
  () => {
    searchValue.value = utilsStore.searchString["existing-document"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
