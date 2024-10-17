<template>
  <WMListSubHeader
    entity="product"
    :show-communications="false"
    :has-action-builder="false"
    @new="redirectToNewProductPage"
    @export="handleExportProducts"
  >
  </WMListSubHeader>
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMProductsTable
      :columns="columns"
      :products="products"
      :total-records="totalRecords"
      :loading="loading"
      preview
      selectable
      @update:page="currentPage = $event"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const router = useRouter();
const utilsStore = useUtilsStore();
const { getProducts, exportProducts } = useProducts();
const { handleExport } = useExports();

// INJECT

// PROPS, EMITS
const products = ref([]);
const productsLoaded = ref(false);
const searchValue = ref("");
const loading = ref(false);
const currentPage = ref(0);
const totalRecords = ref(0);

// REFS
const columns = [
  {
    name: "product-image",
    type: "attachment-image",
    field: "product_image_url",
    header: "photo",
    class: "p-0 filled-td",
  },
  {
    name: "product-name",
    type: "link",
    field: "link_detail",
    header: "product.name",
    routeName: "productDetail",
  },
  {
    name: "id",
    type: "text",
    field: "id",
    header: "id",
  },
  {
    name: "base-price",
    type: "currency",
    field: "base_price",
    header: "product.base-price",
  },
  {
    name: "manufacturer",
    type: "text",
    field: "manufacturer_name",
    header: "product.manufacturer",
  },
  {
    name: "type",
    type: "option-set",
    field: "type",
    header: "product.type",
  },
  {
    name: "family",
    type: "option-set",
    field: "family",
    header: "product.family",
  },
  {
    name: "group",
    type: "option-set",
    field: "group",
    header: "product.group",
  },
  {
    name: "department",
    type: "option-set",
    field: "department",
    header: "product.department",
  },
  {
    name: "renewal_type",
    type: "option-set",
    field: "renewal_type",
    header: "product.renewal_type",
  },
  {
    name: "cancellation_type",
    type: "option-set",
    field: "cancellation_type",
    header: "product.cancellation_type",
  },
  {
    name: "license",
    type: "checkbox",
    field: "licensing_required",
    header: "product.license",
  },
  {
    name: "commitment",
    type: "checkbox",
    field: "commitment",
    header: "product.commitment",
  },
  {
    name: "guarantee",
    type: "checkbox",
    field: "guarantee",
    header: "product.guarantee",
  },
  {
    name: "installation",
    type: "checkbox",
    field: "installation_required",
    header: "product.installation",
  },
  {
    name: "maintenance",
    type: "checkbox",
    field: "maintenance",
    header: "product.maintenance",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "State",
    width: "100px",
    class: "p-0 filled-td",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Products",
});

const loadProducts = async () => {
  loading.value = true;
  const filters = utilsStore.filters["product"];
  const nextPage = currentPage.value + 1;
  const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  let response = await getProducts(params);

  products.value = response.data;
  totalRecords.value = response.totalRecords;
  loading.value = false;
  productsLoaded.value = true;
};

const redirectToNewProductPage = () => {
  router.push({
    name: "newProduct",
    force: true,
  });
};

const handleExportProducts = async () => {
  handleExport({
    filters: utilsStore.filters["product"],
    searchValue: searchValue.value,
    exportFunction: exportProducts,
  });
};

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadProducts();
});

watch(
  () => utilsStore.searchString["product"],
  () => {
    searchValue.value = utilsStore.searchString["product"];
    utilsStore.debounceAction(() => {
      loadProducts();
    });
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "product";

  loadProducts();
});
</script>

<style scoped></style>
