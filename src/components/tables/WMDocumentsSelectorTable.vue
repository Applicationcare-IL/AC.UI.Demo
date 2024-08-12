<template>
  <h2 class="h2">
    {{ $t("scripts.attach-documents") }}
  </h2>

  <DataTable
    v-model:selection="selectedDocuments"
    lazy
    selection-mode="multiple"
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
import { onMounted, ref, watchEffect } from "vue";

// DEPENDENCIES
const { getDocumentsFromApi } = useDocuments();

// INJECT

// PROPS, EMITS
const props = defineProps({
  relatedEntity: {
    type: String,
  },
  relatedEntityId: {
    type: Number,
  },
});

const emit = defineEmits(["update:selection"]);

// REFS
const totalRecords = ref(0);
const selectedDocuments = ref();
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
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = rows.value;

  const params = new URLSearchParams({
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
    project_id: props.relatedEntity === "project" ? props.relatedEntityId : null,
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
  emit("update:selection", selectedDocuments.value);
};

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
