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
        <!-- <WMAssignOwnerButton entity="document" /> -->
        <!-- <WMButton
          class="m-1 col-6"
          name="phone-white"
          icon="phone"
          :disabled="selectedElements == 0"
        >
  {{ $t("buttons.assign") }}
        </WMButton> -->
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
          class="w-30rem"
          v-model="filters['global'].value"
          :placeholder="$t('search')"
        />
      </span>
    </div>
  </div>

  <DataTable
    v-model:filters="filters"
    v-model:selection="selectedDocuments"
    :value="documents"
    :rowClass="rowClass"
    dataKey="id"
    tableStyle="min-width: 50rem"
    scrollable
    paginator
    :rows="rows"
    @update:selection="onSelectionChanged"
    sortField="id"
    :sortOrder="-1"
    :loading="loading"
    @page="onPage($event)"
  >
    <Column
      v-if="multiselect"
      style="width: 40px"
      selectionMode="multiple"
    ></Column>

    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="getColumnHeaderText(column)"
      :class="column.class"
    >
      <template v-if="column.type === 'link'" #body="slotProps">
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

      <template v-if="column.type === 'task'" #body="slotProps">
        <router-link
          v-if="slotProps.data.task"
          :to="{
            name: 'taskDetail',
            params: { id: slotProps.data.id },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data.id }}</router-link
        >
      </template>

      <template v-if="column.type === 'detail'" #body="slotProps">
        <Dropdown
          v-if="createMode[slotProps.data.id]"
          :options="optionSetsStore.optionSets[column.optionSet]"
          :optionLabel="optionLabelWithLang"
          optionValue="id"
          class="w-full p-0"
          v-model="slotProps.data.document_detail"
          :placeholder="$t('documents.select_detail_type')"
        >
        </Dropdown>
        <div v-else>
          <WMOptionSetValue :optionSet="slotProps.data.document_detail" />
        </div>
      </template>

      <template v-if="column.type === 'type'" #body="slotProps">
        <Dropdown
          v-if="createMode[slotProps.data.id]"
          :options="optionSetsStore.optionSets[column.optionSet]"
          :optionLabel="optionLabelWithLang"
          optionValue="id"
          class="w-full p-0"
          v-model="slotProps.data.document_type"
          :placeholder="$t('documents.select_type')"
        >
        </Dropdown>
        <div v-else>
          <WMOptionSetValue :optionSet="slotProps.data.document_type" />
        </div>
      </template>

      <template v-if="column.type === 'name'" #body="slotProps">
        <input
          class="w-full p-0"
          v-if="editMode[slotProps.data.id] || createMode[slotProps.data.id]"
          v-model="slotProps.data.name"
        />
        <div v-else>
          {{ slotProps.data.name }}
        </div>
      </template>
    </Column>

    <Column style="width: 40px" :header="$t('documents.file')">
      <template #body="slotProps">
        <WMUploadDocumentButton
          :document-id="slotProps.data.id"
          :has-file="slotProps.data.has_file"
          @document-uploaded="loadLazyData"
          :disabled="slotProps.data.mode === 'new'"
          v-if="editMode[slotProps.data.id]"
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

        <Button
          v-else-if="createMode[slotProps.data.id]"
          class="p-button-only-icon p-teal-button"
          @click="
            createDocumentRow(slotProps.data);
            slotProps.data.mode = 'view';
          "
        >
          <div class="p-button-svg" v-html="SaveIcon" />
        </Button>

        <WMDocumentsTableItemOverlayMenu
          v-else
          :item-id="slotProps.data.id"
          @edit-row="handleEditRow"
          @refresh-table="loadLazyData"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { FilterMatchMode } from "primevue/api";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

import SaveIcon from "/icons/save_default.svg?raw";
import WMOptionSetValue from "../WMOptionSetValue.vue";

const { t, locale } = useI18n();

const { optionLabelWithLang } = useLanguages();
const route = useRoute();

const selectedDocuments = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const selectedElements = ref(0);

const optionSetsStore = useOptionSetsStore();

const utilsStore = useUtilsStore();
const i18n = useI18n();
const {
  getDocumentsFromApi,
  updateDocument,
  parseUpdateDocument,
  createDocument,
  parseCreateDocument,
} = useDocuments();

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
});

const multiselect = ref(false);
const rows = ref(10);

const editMode = ref([]);
const createMode = ref([]);

const handleEditRow = (id) => {
  editMode.value[id] = true;
};

const randomId = () => {
  return Math.floor(Math.random() * 1000000);
};

const createNewDocument = (id) => {
  return ref({
    detail: "",
    has_file: false,
    id: id,
    name: "",
    owner: "",
    task_id: "",
    type: "",
    uploaded_from: "",
    uploaded_on: "",
    mode: "new",
  });
};

const loading = ref(false);

const handleNewDocument = () => {
  loading.value = true;

  // we need a random id to manage the new document table states
  const id = randomId();
  const newDocument = createNewDocument(id);

  documents.value.push(newDocument.value);
  createMode.value[id] = true;

  loading.value = false;
};

const getColumnHeaderText = (column) => {
  if (column.header === false) return "";

  return column.header ? t(column.header) : t(`documents.${column.name}`);
};

const rowClass = (data) => {
  return [{ "bg-new-row": data.mode === "new" }];
};

const documents = ref([]);
const lazyParams = ref({});
const totalRecords = ref(0);

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
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

onMounted(() => {
  loadLazyData();
});

const getFilterOptions = () => {
  return [
    { name: i18n.t("no-file", { label: "no-file" }), value: 3 },
    { name: i18n.t("my-entities", { label: "test 2" }), value: 2 },
    { name: i18n.t("my-entities", { label: "test 2" }), value: 1 },
  ];
};

const options = ref();
options.value = getFilterOptions();

watch(locale, () => {
  options.value = getFilterOptions();
});

const onSelectionChanged = () => {
  utilsStore.selectedElements["document"] = selectedDocuments.value;
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const updateDocumentRow = (id, document) => {
  updateDocument(document.id, parseUpdateDocument(document))
    .then((data) => {
      editMode.value[id] = false;
      // alert("document updated", id);
      // toast.successAction("customer", "updated");
    })
    .catch((error) => {
      console.error(error);
      // toast.error("customer", "not-updated");
    });
};

const toast = useToast();

const createDocumentRow = (document) => {
  console.log("document", document);

  // TODO: Temporal validation
  if (!document.name) {
    toast.error("Document name should not be empty");
    return;
  }

  if (!document.document_type) {
    toast.error("Document type should not be empty");
    return;
  }

  if (!document.document_detail) {
    toast.error("Document detail should not be empty");
    return;
  }

  if (props.relatedEntity === "project") {
    document.project_id = props.projectId;
  }

  if (props.relatedEntity === "task") {
    document.task_id = props.taskId;
  }

  createDocument(parseCreateDocument(document))
    .then((data) => {
      createMode.value[document.id] = false;
      toast.success("Document created");
      loadLazyData();
    })
    .catch((error) => {
      console.error(error);
      toast.error("Document not created");
    });
};

watch(
  () => utilsStore.selectedElements["document"],
  (value) => {
    selectedElements.value = value.length;
  }
);
</script>
