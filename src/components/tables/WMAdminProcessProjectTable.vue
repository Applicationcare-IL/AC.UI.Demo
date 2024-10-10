<template>
  <DataTable
    v-model:selection="selectedProcesses"
    lazy
    :value="processes"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column style="width: 40px">
      <template #body="{ data }">
        <img src="/icons/arrow_sort_down.svg" alt="arrow-down icon" class="vertical-align-middle" />
        <!--- desplegable tabla detalle -->
      </template>
    </Column>
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
const { getProcesses } = useAdminProcess();

// INJECT

// PROPS, EMITS
const props = defineProps({
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
const selectedProcesses = ref([]);
const totalRecords = ref(0);
const processes = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const isEditSidebarVisible = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["process"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
    entity_type: "project",
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  let response = await getProcesses(params);
  processes.value = response.data;
  totalRecords.value = response.totalRecords;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedProcesses.value);
};

const cleanSelectedProcesses = () => {
  selectedProcesses.value = [];
  onSelectionChanged();
};

const openSidebar = (data) => {
  isEditSidebarVisible.value[data] = true;
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedProcesses,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["process"],
  () => {
    searchValue.value = utilsStore.searchString["process"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  },
  { deep: true }
);

watch(
  () => props.entityType,
  () => {
    loadLazyData();
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
