<template>
  <Skeleton v-if="!customersLoaded" height="600px"></Skeleton>
  <DataTable
    v-else
    v-model:selection="selectedCustomers"
    lazy
    :value="customers"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :loading="loading"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column v-if="selectable" style="width: 40px" selection-mode="multiple" />
    <Column v-if="preview" style="width: 40px">
      <template #body="{ data }">
        <img src="/icons/eye.svg" class="vertical-align-middle" @click="openSidebar(data.id)" />
        <WMCustomerPreviewSidebar v-model:visible="isPreviewVisible[data.id]" :customer="data" />
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
const { getCustomersFromApi } = useCustomers();

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
  relatedEntity: {
    type: String,
    required: true,
  },
  relatedEntityId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:selection"]);

// REFS
const selectedCustomers = ref([]);
const totalRecords = ref(0);
const customers = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");
const loading = ref(false);
const customersLoaded = ref(true);

const isPreviewVisible = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  loading.value = true;
  const filters = utilsStore.filters["customer"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  if (props.relatedEntity && props.relatedEntityId) {
    params.append(props.relatedEntity, props.relatedEntityId);
  }

  let response = await getCustomersFromApi(params);
  customers.value = response.data;
  totalRecords.value = response.totalRecords;

  loading.value = false;
  customersLoaded.value = true;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedCustomers.value);
};

const cleanSelectedCustomers = () => {
  selectedCustomers.value = [];
  onSelectionChanged();
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedCustomers,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["customer"],
  () => {
    searchValue.value = utilsStore.searchString["customer"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
