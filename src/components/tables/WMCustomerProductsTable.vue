<template>
  <div class="flex flex-column w-full">
    <h2 class="h2">
      <slot name="title" />
    </h2>
    <Skeleton v-if="loading" height="300px"></Skeleton>
    <DataTable
      v-else
      lazy
      :value="products"
      data-key="id"
      scrollable
      paginator
      :rows="10"
      :total-records="totalRecords"
      class="w-full"
      @page="onPage($event)"
    >
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
        <template #editor="{ data }">
          <WMRenderTableFieldEditor
            v-if="column.editable"
            v-model="data[column.field]"
            :column-data="column"
          />
          <WMRenderTableFieldBody v-else v-model="data[column.field]" :column-data="column" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  products: {
    type: Object,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:page"]);

// REFS
const isPreviewVisible = ref([]);

const columns = ref([
  {
    name: "product-name",
    type: "link",
    field: "link_detail",
    header: "product.name",
    routeName: "productDetail",
    editable: false,
  },
  {
    name: "id",
    type: "text",
    field: "id",
    header: "id",
    editable: false,
  },
  {
    name: "base-price",
    type: "currency",
    field: "product_original_price",
    header: "product.base-price",
    editable: false,
  },
  // {
  //   name: "manufacturer",
  //   type: "text",
  //   field: "render_text",
  //   header: "Type Text",
  // },
  {
    name: "type",
    type: "option-set",
    field: "render_type",
    header: "product.product-type",
  },
  {
    name: "family",
    type: "option-set",
    field: "render_family",
    header: "product.product-family",
  },
  {
    name: "group",
    type: "option-set",
    field: "render_group",
    header: "product.product-group",
  },
  {
    name: "department",
    type: "option-set",
    field: "render_department",
    header: "product.product-department",
  },
  // order date
  {
    name: "open-services",
    type: "centered-number",
    field: "open_services",
    header: "product.open-services",
  },
  {
    name: "state",
    type: "state",
    field: "state",
    header: "product.state",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "status",
    type: "state",
    field: "status",
    header: "product.status",
    width: "100px",
    class: "filled-td",
  },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const onPage = (event) => {
  emit("update:page", event.page);
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
