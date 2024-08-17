<template>
  <WMListSubHeader
    entity="product"
    :show-communications="false"
    :has-action-builder="false"
    @new="redirectToNewProductPage"
  >
    <template #top-left>
      <WMOwnerToggle entity="product" />
    </template>
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

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminUserDetail",
  },
  {
    name: "username",
    type: "text",
    field: "username",
    header: "employee.username",
  },
  {
    name: "manager",
    type: "text",
    field: "manager_fullname",
    header: "manager",
  },
  {
    name: "phone",
    type: "text",
    field: "phone",
    header: "mobilephone",
  },
  {
    name: "email",
    type: "text",
    field: "email",
    header: "email",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "state.state",
    width: "100px",
    class: "p-0 filled-td",
  },
  {
    name: "roles",
    type: "chips",
    field: "roles",
    header: "roles",
  },
  {
    name: "teams",
    type: "chips",
    field: "teams",
    header: "teams",
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
