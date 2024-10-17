<template>
  <div class="flex flex-column">
    <h2 class="h2">
      <slot name="title" />
    </h2>
    <div class="flex flex-column gap-3 mb-3">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row">
          <WMSelectSaleProducts :sale="sale" @sale-products-added="handleSaleProductsAdded" />
          <Divider layout="vertical" />
          <WMOrderProductsInSale
            :sale="sale"
            :state="!isSomeProductInOfferedStatus"
            @sale-products-ordered="handleSaleProductsOrdered"
          />
        </div>
      </div>
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row">
          <WMSearchBox entity="product-in-sale" @update:search="handleUpdateSearchValue($event)" />
        </div>
      </div>
    </div>
    <Skeleton v-if="loading" height="74px"></Skeleton>
    <DataTable
      v-else
      v-model:editingRows="editingRows"
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
      @row-edit-save="onRowEditSave"
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
      <Column
        v-if="!props.readOnly"
        :row-editor="true"
        style="width: 100%"
        class="p-1"
        :header="$t('actions')"
      />
    </DataTable>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getSaleProducts, updateOfferedProduct, parseOfferedProduct } = useSales();

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

// REFS
const loading = ref(false);
const editingRows = ref([]);

const totalRecords = ref(0);
const saleProducts = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

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
    name: "product-status",
    type: "product-in-sale-status",
    field: "status",
    header: "product.status",
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
    field: "product_original_price",
    header: "product.base-price",
    editable: false,
  },
  // {
  //   name: "bulk-discount",
  //   type: "currency",
  //   field: "product_original_price",
  //   header: "product.base-price",
  //   editable: true,
  // },
  {
    name: "salesman-discount",
    type: "currency",
    field: "salesman_discount",
    header: "product.salesman-discount",
    editable: true,
  },
  {
    name: "product-price-in-sale",
    type: "currency",
    field: "price_in_sale",
    header: "product.products-price-in-sale",
    editable: false,
  },
  {
    name: "units",
    type: "number",
    field: "quantity",
    header: "product.units",
    editable: true,
  },
  {
    name: "deal-price",
    type: "currency",
    field: "deal_price",
    header: "product.deal-price",
    editable: false,
  },
]);

// COMPUTED
const isSomeProductInOfferedStatus = computed(() => {
  return saleProducts.value.some((product) => product.status.value === "offered");
});

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  loading.value = true;
  const filters = utilsStore.filters["sale-products"];
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

  loading.value = false;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onRowEditSave = async (event) => {
  let { newData: rowData, index } = event;

  console.log("onRowEditSave rowData", rowData);

  updateOfferedProduct(props.sale.id, rowData.id, parseOfferedProduct(rowData))
    .then(() => {
      saleProducts.value[index] = rowData;

      toast.info({
        title: "Product in sale updated successfully",
      });
    })
    .catch(() => {
      toast.error({
        title: "Error updating product",
      });
    });
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

const handleSaleProductsAdded = () => {
  loadLazyData();
};

const handleSaleProductsOrdered = () => {
  loadLazyData();
};

const handleUpdateSearchValue = (value) => {
  searchValue.value = value;
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
