<template>
  <Skeleton v-if="loading" height="600px"></Skeleton>
  <DataTable
    v-else
    v-model:selection="selectedSales"
    lazy
    :value="sales"
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
        <WMSalePreviewSidebar v-model:visible="isPreviewVisible[data.id]" :sale="data" />
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

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  sales: {
    type: Array,
    required: true,
  },
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

const emit = defineEmits(["update:selection", "update:page"]);

// REFS
const selectedSales = ref([]);
const isPreviewVisible = ref([]);
const datatableOffset = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const onPage = (event) => {
  emit("update:page", event.page);
};

const onSelectionChanged = () => {
  emit("update:selection", selectedSales.value);
};

const cleanSelectedSales = () => {
  selectedSales.value = [];
  onSelectionChanged();
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// PROVIDE, EXPOSE
defineExpose({
  cleanSelectedSales,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
