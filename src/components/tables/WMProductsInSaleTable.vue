<template>
  <div class="flex flex-column w-full">
    <h2 class="h2">
      <slot name="title" />
    </h2>
    <div class="flex flex-column gap-3 mb-3">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row gap-2">
          <WMSelectSaleProducts :sale="sale" @sale-products-added="handleSaleProductsAdded" />
        </div>
      </div>
      <!-- <div class="flex flex-row justify-content-between">
        <div class="flex flex-row">
          <WMSearchBox v-model="searchValue" entity="contact" />
        </div>
      </div> -->
    </div>
    <!-- <pre> {{ saleProducts }}</pre> -->
    <DataTable
      v-model:editingRows="editingRows"
      v-model:selection="selectedSaleProducts"
      lazy
      :value="saleProducts"
      data-key="id"
      edit-mode="row"
      scrollable
      paginator
      :rows="10"
      :total-records="totalRecords"
      class="w-full"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
      @row-edit-save="onRowEditSave"
    >
      <!-- <Column v-if="selectable" style="width: 40px" selection-mode="multiple" /> -->
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
      <Column
        v-if="!props.readOnly"
        :row-editor="true"
        style="width: 10px"
        class="p-1 extended-column"
        :header="$t('actions')"
      />
      <Column style="width: 100%">
        <template #body="{ data }">
          <WMRemoveButton
            v-if="data.mode !== 'create'"
            class="p-0"
            @click="handleRemoveSaleProduct(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getSaleProducts } = useSales();

const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  sale: {
    type: Object,
    required: false,
  },
  preview: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  urlParams: {
    type: Array,
    required: false,
  },
  addUsersFunction: {
    type: Function,
    required: false,
  },
  removeUsersFunction: {
    type: Function,
    required: false,
  },
});

const emit = defineEmits(["update:selection"]);

// REFS
const editingRows = ref([]);

const selectedSaleProducts = ref([]);
const totalRecords = ref(0);
const saleProducts = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const isPreviewVisible = ref([]);

const columns = ref([
  {
    name: "product-image",
    type: "attachment-image",
    field: "product_image_url",
    header: "photo",
    class: "p-0 filled-td",
    editable: false,
  },
  {
    name: "product-name",
    type: "link",
    field: "link_detail",
    header: "product.name",
    routeName: "productDetail",
    editable: false,
  },
  {
    name: "product-relationship-type",
    type: "product-relationship-type",
    field: "relationship",
    header: "product.relationship-type",
    editable: true,
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
    field: "base_price",
    header: "product.base-price",
    editable: false,
  },
  {
    name: "type",
    type: "option-set",
    field: "type",
    header: "product.type",
    editable: false,
  },
  {
    name: "family",
    type: "option-set",
    field: "family",
    header: "product.family",
    editable: false,
  },
  {
    name: "department",
    type: "option-set",
    field: "department",
    header: "product.department",
    editable: false,
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "State",
    width: "100px",
    class: "p-0 filled-td",
    editable: false,
  },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["related-products"];
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

  if (props.urlParams) {
    props.urlParams.forEach((urlParam) => {
      params.append(urlParam.key, urlParam.value);
    });
  }

  let response = await getSaleProducts(props.sale.id, params);
  saleProducts.value = response.data;
  totalRecords.value = response.totalRecords;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedSaleProducts.value);
};

// const onRowEditSave = async (event) => {
//   let { newData: rowData, index } = event;

//   console.log("onRowEditSave rowData", rowData);

//   updateRelatedProduct(props.sale.id, rowData.id, { type: rowData.relationship.id })
//     .then(() => {
//       saleProducts.value[index] = rowData;

//       toast.info({
//         title: "Related product updated successfully",
//       });
//     })
//     .catch(() => {
//       toast.error({
//         title: "Error updating related product",
//       });
//     });
// };

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// const handleRemoveSaleProduct = (relatedProduct) => {
//   deleteRelatedProduct(props.sale.id, relatedProduct.id, { type: relatedProduct.type.id })
//     .then(() => {
//       saleProducts.value = saleProducts.value.filter((product) => product.id !== relatedProduct.id);

//       toast.info({
//         title: "Related product removed successfully",
//       });
//     })
//     .catch(() => {
//       toast.error({
//         title: "Error removing related product",
//       });
//     });
// };

const handleSaleProductsAdded = () => {
  console.log("entro");
  loadLazyData();
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  loadLazyData();
});
</script>
