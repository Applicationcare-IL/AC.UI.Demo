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
    <Column style="width: 40px">
      <template #body="{ data }">
        <img
          src="/icons/eye.svg"
          alt=""
          class="vertical-align-middle"
          @click="openSidebar(data.id)"
        />
        <WMClassificationEditSidebar
          v-model:visible="isEditSidebarVisible[data.id]"
          :classification="data"
        />
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
const { getClassifications } = useAdminClassifications();

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
  entityType: {
    type: String,
    default: "service",
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

const isEditSidebarVisible = ref([]);

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
    entity_type: props.entityType,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  let response = await getClassifications(params);
  classifications.value = response.data;
  totalRecords.value = response.totalRecords;
};

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

const openSidebar = (data) => {
  isEditSidebarVisible.value[data] = true;
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
