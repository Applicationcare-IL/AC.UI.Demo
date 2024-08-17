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

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS

const columns = [
  {
    name: "product-name",
    type: "link",
    field: "link_detail",
    header: "product.product-name",
    routeName: "adminUserDetail",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Products",
});

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "employee";
});
</script>

<style scoped></style>
