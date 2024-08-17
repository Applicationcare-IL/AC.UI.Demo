<template>
  <WMListSubHeader
    entity="product"
    :show-communications="false"
    :has-action-builder="false"
    @new="redirectToNewProductPage"
  />

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMProductsTable
      ref="productsTable"
      :columns="columns"
      preview
      selectable
      @update:selection="onSelectionChanged"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const router = useRouter();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS

const columns = [
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
  //  {
  //   name: "base-price",
  //   type: "text",
  //   field: "id",
  //   header: "id",
  // },
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
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Products",
});

const redirectToNewProductPage = () => {
  router.push({
    name: "newProduct",
    force: true,
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "product";
});
</script>

<style scoped></style>
