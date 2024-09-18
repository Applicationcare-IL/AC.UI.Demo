<template>
  <h2 v-if="!hideTitle" class="h2">Documents</h2>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row gap-2">
        <WMNewButton :text="$t('documents.new-document')" @click="handleNewDocument" />
      </div>
    </div>
    <div class="flex flex-row justify-content-between align-items-center">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="filters['global'].value" class="w-30rem" :placeholder="$t('search')" />
      </span>
      <WMTablePaginator
        :total-records="totalRecords"
        :current-page="currentPage"
        :current-offset="datatableOffset"
        @update:rows="handleNumberOfRowsPerPage"
      />
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
    lazy
    :first="datatableOffset"
    :total-records="totalRecords"
    :rows="rowsPerPage"
    sort-field="id"
    :loading="loading"
    @update:selection="onSelectionChanged"
    @page="onPage($event)"
    @update:first="datatableOffset = $event"
  >
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple"></Column>

    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="getColumnHeaderText(column)"
      :class="column.class"
      :style="`width: ${column.width}`"
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
          >
            {{ slotProps.data.id }}
          </router-link>
        </template>

        <template v-if="column.type === 'task'">
          <router-link
            v-if="slotProps.data.task"
            :to="{
              name: 'taskDetail',
              params: { id: slotProps.data.task.id },
            }"
            class="vertical-align-middle"
          >
            <WMOptionSetValue :option-set="slotProps.data.task.task_family" />
          </router-link>
        </template>

        <template v-if="column.type === 'detail'">
          <Dropdown
            v-if="editMode[slotProps.data.id]"
            v-model="slotProps.data.document_detail.id"
            :options="documentDetails"
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
            :options="optionSets[column.optionSet]"
            :option-label="optionLabelWithLang"
            option-value="id"
            class="w-full p-0"
            :placeholder="$t('documents.select_type')"
            @change="updateDocumentDetailOptions(slotProps.data)"
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
        <WMUploadAttachmentButton
          entity="document"
          :related-entity="relatedEntity"
          :related-entity-id="relatedEntityId"
          :entity-id="slotProps.data.id"
          file-name="document"
          :has-file="slotProps.data.attachment"
          :download-url="slotProps.data.attachment?.download_url"
          :upload-existing-documents="true"
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
import { inject, onMounted, ref, watch } from "vue";
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

const documentDetails = ref([]);

const { getDocumentsFromApi, updateDocument, parseUpdateDocument, createDocument } = useDocuments();

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
  relatedEntityId: {
    type: Number,
    default: null,
  },
  multiselect: {
    type: Boolean,
    default: true,
  },
  projectId: {
    type: Number,
    default: null,
  },
});

const refresh = inject("refreshDocumentsTable");

watch(refresh, (value) => {
  if (value) {
    loadLazyData();
    refresh.value = false;
  }
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
const rowsPerPage = ref(props.rows);
const currentPage = ref(1);
const datatableOffset = ref(0);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});

// COMPUTED
// COMPONENT METHODS AND LOGIC
const handleEditRow = (id) => {
  editMode.value[id] = true;
};

const handleNumberOfRowsPerPage = (numberOfRowsPerPage) => {
  currentPage.value = 1;
  datatableOffset.value = 0;
  rowsPerPage.value = numberOfRowsPerPage;
  loadLazyData();
};

const handleNewDocument = () => {
  loading.value = true;

  let document = {};

  if (props.relatedEntity === "project") {
    document.project_id = props.relatedEntityId;
  }

  if (props.relatedEntity === "task") {
    document.task_id = props.relatedEntityId;
  }

  if (props.relatedEntity === "service") {
    document.service_id = props.relatedEntityId;
  }

  if (props.relatedEntity === "customer") {
    document.customer_id = props.relatedEntityId;
  }

  if (props.relatedEntity === "contact") {
    document.contact_id = props.relatedEntityId;
  }

  // we can create documents related to tasks but also to projects
  if (props.projectId) {
    document.project_id = props.projectId;
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
  currentPage.value = lazyParams.value.page ? lazyParams.value.page + 1 : 1;

  const params = new URLSearchParams({
    page: currentPage.value,
    per_page: rowsPerPage.value,
  });

  if (props.relatedEntity === "project") {
    params.append("project_id", props.relatedEntityId);
  }

  if (props.relatedEntity === "task") {
    params.append("task_id", props.relatedEntityId);
  }

  if (props.relatedEntity === "service") {
    params.append("service_id", props.relatedEntityId);
  }

  if (props.relatedEntity === "customer") {
    params.append("customer_id", props.relatedEntityId);
  }

  if (props.relatedEntity === "contact") {
    params.append("contact_id", props.relatedEntityId);
  }

  getDocumentsFromApi(params).then((result) => {
    documents.value = result.data;
    totalRecords.value = result.totalRecords;
  });

  loading.value = false;
};

const clearSelectedDocuments = () => {
  selectedDocuments.value = [];
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
  //Services don't have these columns
  if (props.relatedEntity !== "service") {
    if (!document.document_detail.id) {
      toast.error("Please fill the document detail");
      return;
    }

    if (!document.document_type.id) {
      toast.error("Please fill the document type");
      return;
    }
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

const updateDocumentDetailOptions = (document) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("document_detail", document.document_type.id)
    .then((data) => {
      documentDetails.value = data;
    });

  documents.value.filter((doc) => {
    if (doc.id === document.id) {
      doc.document_detail.id = null;
    }
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
  loadOptionSets();
  loadLazyData();
});
const optionSets = ref([]);

const loadOptionSets = async () => {
  //for each option set in columns, get the option set values
  props.columns.forEach(async (column) => {
    if (column.optionSet) {
      optionSets.value[column.optionSet] = await optionSetsStore.getOptionSetValues(
        column.optionSet
      );
    }
  });
};
</script>
