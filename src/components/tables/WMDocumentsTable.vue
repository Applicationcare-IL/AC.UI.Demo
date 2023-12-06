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
          מסמך חדש
        </WMButton>
        <WMAssignOwnerButton entity="document" />
        <WMButton
          class="m-1 col-6"
          name="phone-white"
          icon="phone"
          :disabled="selectedElements == 0"
        >
          הקצה
        </WMButton>
        <WMButton
          class="m-1 col-6"
          name="mail-white"
          icon="mail"
          :disabled="selectedElements == 0"
        >
          הקצה
        </WMButton>
      </div>
      <div class="flex flex-row align-items-center gap-3">
        <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          >{{ t("filter") }}
        </WMButton>
        <SelectButton
          v-model="selectedOption"
          :options="options"
          optionLabel="name"
          class="flex flex-nowrap"
        />
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
    :value="documentList"
    :rowClass="rowClass"
    dataKey="id"
    tableStyle="min-width: 50rem"
    scrollable
    paginator
    :rows="rows"
    @update:selection="onSelectionChanged"
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
          :to="{
            name: 'taskDetail',
            params: { id: slotProps.data.id },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data.id }}</router-link
        >
      </template>
    </Column>

    <Column style="width: 40px" :header="'File'">
      <template #body="slotProps">
        <WMButton
          v-if="slotProps.data.has_file"
          name="edit"
          class="small"
          icon="attach"
        />
        <WMButton v-else name="new" class="small" icon="new" />
      </template>
    </Column>

    <Column>
      <template #body="slotProps">
        <WMButton
          @click="toggle"
          aria-haspopup="true"
          name="save"
          class="small"
          aria-controls="overlay_menu"
          icon="save"
          v-if="slotProps.data.mode === 'new'"
        />
        <WMButton
          @click="toggle"
          aria-haspopup="true"
          name="kebab"
          aria-controls="overlay_menu"
          icon="kebab"
          v-else
        />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
          <template #item="slotProps">
            <button
              @click="profileClick"
              class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2"
            >
              <img :src="slotProps.item.image" />
              <div class="flex flex-column align">
                {{ slotProps.item.label }}
              </div>
            </button>
          </template>
        </Menu>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, computed, toRefs, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { FilterMatchMode } from "primevue/api";

import { useUtilsStore } from "@/stores/utils";

const { t, locale } = useI18n();

const selectedDocuments = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const selectedElements = ref(0);

const utilsStore = useUtilsStore();
const i18n = useI18n();

const props = defineProps({
  documents: Array,
  rows: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array,
    required: true,
  },
  multiselect: {
    type: Boolean,
    default: true,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
});

const newDocument = ref({
  detail: "כיבוי אש",
  file_url: "https://www.google.com",
  has_file: false,
  id: 1,
  name: "",
  owner: "",
  task_id: "",
  type: "",
  uploaded_from: "שם של פרויקט",
  uploaded_on: "",
  mode: "new",
});

const newDocumentList = ref([]);

const documentList = computed(() => {
  if (!props.documents) return [];

  if (newDocumentList.value.length === 0) return props.documents;

  return [...newDocumentList.value, ...props.documents];
});

const editMode = ref([]);

const handleNewDocument = () => {
  newDocumentList.value.push(newDocument.value);
  // editMode.value[contacts.value.length - 1] = true;
};

const getColumnHeaderText = (column) => {
  if (column.header === false) return "";

  return column.header ? t(column.header) : t(`documents.${column.name}`);
};

const rowClass = (data) => {
  console.log("rowClass", data);
  return [{ "bg-new-row": data.mode === "new" }];
};

// dots menu
const menu = ref();

const toggle = (event) => {
  menu.value.toggle(event);
};

const items = ref([
  {
    label: "View",
    image: new URL("/icons/menu/view.svg", import.meta.url).href,
  },
  {
    label: "Edit",
    image: new URL("/icons/menu/rename.svg", import.meta.url).href,
  },
  {
    label: "Share",
    image: new URL("/icons/menu/share.svg", import.meta.url).href,
  },
  {
    label: "Download",
    image: new URL("/icons/menu/download.svg", import.meta.url).href,
  },
  {
    label: "Delete",
    image: new URL("/icons/menu/delete.svg", import.meta.url).href,
  },
]);

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
  console.log(selectedDocuments.value);
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

watch(
  () => utilsStore.selectedElements["document"],
  (value) => {
    selectedElements.value = value.length;
  }
);
</script>
