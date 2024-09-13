<template>
  <WMListSubHeader
    entity="product"
    :show-communications="false"
    :has-action-builder="false"
    @new="redirectToNewProductPage"
  >
  </WMListSubHeader>

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
    field: "license",
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
