<template>
  <Skeleton v-if="loading" height="600px"></Skeleton>
  <DataTable
    v-else
    v-model:selection="selectedProducts"
    lazy
    :value="products"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :loading="loading"
    :total-records="totalRecords"
    class="w-full"
    :first="datatableOffset"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
    @update:first="datatableOffset = $event"
  >
    <Column v-if="selectable" style="width: 40px" selection-mode="multiple" />
    <Column v-if="preview" style="width: 40px">
      <template #body="{ data }">
        <img src="/icons/eye.svg" class="vertical-align-middle" @click="openSidebar(data.id)" />
        <WMProductPreviewSidebar
          v-model:visible="isPreviewVisible[data.id]"
          :product-id="data.id"
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
import { ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(["update:selection", "update:page"]);

// REFS
const selectedProducts = ref([]);
const isPreviewVisible = ref([]);
const datatableOffset = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const onPage = (event) => {
  emit("update:page", event.page);
};

const onSelectionChanged = () => {
  emit("update:selection", selectedProducts.value);
};

const cleanSelectedProducts = () => {
  selectedProducts.value = [];
  onSelectionChanged();
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// PROVIDE, EXPOSE
defineExpose({
  cleanSelectedProducts,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
