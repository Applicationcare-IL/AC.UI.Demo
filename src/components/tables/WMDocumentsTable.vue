<template>
  <h2 v-if="!hideTitle" class="h2">Documents</h2>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="handleNewDocument"
        >
          {{ $t("documents.new_document") }}
        </WMButton>
        <WMAssignOwnerButton entity="document" />
        <!-- <WMButton
          class="m-1 col-6"
          name="mail-white"
          icon="mail"
          :disabled="selectedElements == 0"
        >
          {{ $t("buttons.assign") }}
        </WMButton> -->
      </div>
      <div class="flex flex-row align-items-center gap-3">
        <!-- <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          >{{ t("filter") }}
        </WMButton> -->
        <!-- <SelectButton
          v-model="selectedOption"
          :options="options"
          optionLabel="name"
          optionValue="value"
          class="flex flex-nowrap"
          @change="onChangeOwnerFilter"
        /> -->
      </div>
    </div>
    <div>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText
          v-model="filters['global'].value"
          class="w-30rem"
          :placeholder="$t('search')"
        />
      </span>
    </div>
  </div>

  <DataTable
    v-model:filters="filters"
    v-model:selection="selectedDocuments"
    :value="documents"
    :row-class="rowClass"
    data-key="id"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="rows"
    sort-field="id"
    :sort-order="-1"
    :loading="loading"
    @update:selection="onSelectionChanged"
    @page="onPage($event)"
  >
    <Column
      v-if="multiselect"
      style="width: 40px"
      selection-mode="multiple"
    ></Column>

    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="getColumnHeaderText(column)"
      :class="column.class"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'link'">
          <router-link
            v-if="!createMode[slotProps.data.id]"
            :to="{
              name: 'documentDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.id }}</router-link
          >
        </template>

        <template v-if="column.type === 'task'">
          <router-link
            v-if="slotProps.data.task"
            :to="{
              name: 'taskDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.id }}
          </router-link>
        </template>

        <template v-if="column.type === 'detail'">
          <Dropdown
            v-if="editMode[slotProps.data.id]"
            v-model="slotProps.data.document_detail.id"
            :options="optionSetsStore.optionSets[column.optionSet]"
            :option-label="optionLabelWithLang"
            option-value="id"
            class="w-full p-0"
            :placeholder="$t('documents.select_detail_type')"
          >
          </Dropdown>
          <div v-else>
            <WMOptionSetValue :option-set="slotProps.data.document_detail" />
          </div>
        </template>

        <template v-if="column.type === 'type'">
          <Dropdown
            v-if="editMode[slotProps.data.id]"
            v-model="slotProps.data.document_type.id"
            :options="optionSetsStore.optionSets[column.optionSet]"
            :option-label="optionLabelWithLang"
            option-value="id"
            class="w-full p-0"
            :placeholder="$t('documents.select_type')"
          >
          </Dropdown>
          <div v-else>
            <WMOptionSetValue :option-set="slotProps.data.document_type" />
          </div>
        </template>

        <template v-if="column.type === 'name'">
          <input
            v-if="editMode[slotProps.data.id]"
            v-model="slotProps.data.name"
            class="w-full p-0"
          />
          <div v-else>
            {{ slotProps.data.name }}
          </div>
        </template>
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.name] }}
        </template>
      </template>
    </Column>

    <Column style="width: 40px" :header="$t('documents.file')">
      <template #body="slotProps">
        <WMUploadDocumentButton
          :document-id="slotProps.data.id"
          :has-file="slotProps.data.has_file"
        />
      </template>
    </Column>

    <Column>
      <template #body="slotProps">
        <Button
          v-if="editMode[slotProps.data.id]"
          class="p-button-only-icon p-teal-button"
          @click="
            updateDocumentRow(slotProps.data.id, slotProps.data);
            slotProps.data.mode = 'view';
          "
        >
          <div class="p-button-svg" v-html="SaveIcon" />
        </Button>

        <WMDocumentsTableItemOverlayMenu
          v-else
          :item-id="slotProps.data.id"
          @edit-row="handleEditRow"
          @refresh-table="refreshTable"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { FilterMatchMode } from "primevue/api";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import SaveIcon from "/icons/save_default.svg?raw";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t, locale } = useI18n();
const i18n = useI18n();

const { optionLabelWithLang } = useLanguages();
const toast = useToast();

const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();

const {
  getDocumentsFromApi,
  updateDocument,
  parseUpdateDocument,
  createDocument,
} = useDocuments();

// PROPS, EMITS
const props = defineProps({
  rows: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array,
    required: true,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    default: "project",
  },
  projectId: {
    type: Number,
    default: null,
  },
  taskId: {
    type: Number,
    default: null,
  },
  multiselect: {
    type: Boolean,
    default: true,
  },
});

// REFS
const selectedDocuments = ref([]);
const selectedElements = ref(0);
const editMode = ref([]);
const createMode = ref([]);
const loading = ref(false);
const documents = ref([]);
const lazyParams = ref({});
const totalRecords = ref(0);
const options = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});

// COMPUTED
// COMPONENT METHODS
const handleEditRow = (id) => {
  editMode.value[id] = true;
};

const handleNewDocument = () => {
  loading.value = true;

  let document = {};

  if (props.relatedEntity === "project") {
    document.project_id = props.projectId;
  }

  if (props.relatedEntity === "task") {
    document.task_id = props.taskId;
  }

  createDocument(document)
    .then(({ data }) => {
      loadLazyData();
      editMode.value[data.id] = true;
    })
    .catch((error) => {
      console.error(error);
      toast.error("Document not created");
    });
};

const getColumnHeaderText = (column) => {
  if (column.header === false) return "";

  return column.header ? t(column.header) : t(`documents.${column.name}`);
};

const rowClass = (data) => {
  return [{ "bg-new-row": data.mode === "new" }];
};

const loadLazyData = () => {
  const nextPage = lazyParams.value.page + 1;
  // const filters = utilsStore.filters["documents"];
  // const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    page: nextPage,
    per_page: props.rows,
    // search: searchValueParam,
    // ...filters,
  });

  if (props.projectId) params.append("project_id", props.projectId);
  if (props.taskId) params.append("task_id", props.taskId);

  getDocumentsFromApi(params).then((result) => {
    documents.value = result.data;
    totalRecords.value = result.totalRecords;
  });

  loading.value = false;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const getFilterOptions = () => {
  return [
    { name: i18n.t("no-file", { label: "no-file" }), value: 3 },
    { name: i18n.t("my-entities", { label: "test 2" }), value: 2 },
    { name: i18n.t("my-entities", { label: "test 2" }), value: 1 },
  ];
};

options.value = getFilterOptions();

const onSelectionChanged = () => {
  utilsStore.selectedElements["document"] = selectedDocuments.value;
};

const updateDocumentRow = (id, document) => {
  if (!document.document_detail.id) {
    toast.error("Please fill the document detail");
    return;
  }

  if (!document.document_type.id) {
    toast.error("Please fill the document type");
    return;
  }

  updateDocument(document.id, parseUpdateDocument(document))
    .then(() => {
      editMode.value[id] = false;
      loadLazyData();
      // toast.successAction("customer", "updated");
    })
    .catch((error) => {
      console.error(error);
      // toast.error("customer", "not-updated");
    });
};

const refreshTable = () => {
  setTimeout(() => loadLazyData(), 500);
};

// WATCHERS
watch(locale, () => {
  options.value = getFilterOptions();
});

watch(
  () => utilsStore.selectedElements["document"],
  (value) => {
    selectedElements.value = value.length;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
