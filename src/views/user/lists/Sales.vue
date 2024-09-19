<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <WMListSubHeader
    entity="sale"
    :total-records="0"
    :has-action-builder="false"
    @new="redirectToNewSalePage"
  >
    <template #top-left> </template>
  </WMListSubHeader>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMSalesTable
      ref="salesTable"
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
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminSaleDetail",
  },
  {
    name: "contact",
    type: "link",
    field: "",
    header: "sale.contact",
    routeName: "",
  },
  {
    name: "customer",
    type: "link",
    field: "",
    header: "sale.customer",
    routeName: "",
  },
  {
    name: "sale-type",
    type: "text",
    field: "",
    header: "sale.sale-type",
  },
  {
    name: "sale-source",
    type: "text",
    field: "",
    header: "sale.sale-source",
  },
  {
    name: "tender",
    type: "checkbox",
    field: "",
    header: "sale.tender",
  },
  {
    name: "initiator",
    type: "link",
    field: "",
    header: "sale.initiator",
    routeName: "",
  },
  {
    name: "start-date",
    type: "date",
    field: "start_date",
    header: "start-date",
  },
  {
    name: "end-date",
    type: "date",
    field: "end_date",
    header: "end-date",
  },
  {
    name: "sla",
    type: "sla",
    field: "",
    header: "sale.sla",
  },
  {
    name: "stage-in-sale",
    type: "text",
    field: "",
    header: "sale.stage-in-sale",
  },
  {
    name: "owner",
    type: "text",
    field: "",
    header: "sale.owner",
  },
  {
    name: "waiting-for-customers",
    type: "checkbox",
    field: "",
    header: "sale.waiting-for-customers",
  },
  {
    name: "open-tasks",
    type: "tasks",
    field: "",
    header: "sale.open-tasks",
  },
  {
    name: "breached-tasks",
    type: "tasks",
    field: "",
    header: "sale.breached-tasks",
  },
  {
    name: "deal-price-base",
    type: "currency",
    field: "",
    header: "sale.deal-price-base",
  },
  {
    name: "total-discount",
    type: "currency",
    field: "",
    header: "sale.total-discount",
  },
  {
    name: "deal-price-final",
    type: "currency",
    field: "",
    header: "sale.deal-price-final",
  },
  {
    name: "budget",
    type: "currency",
    field: "",
    header: "sale.budget",
  },
  {
    name: "last-change",
    type: "date",
    field: "last_change_date",
    header: "sale.last-change",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Sales",
});

const redirectToNewSalePage = () => {
  router.push({
    name: "newSale",
    force: true,
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "sale";
});
</script>

<style scoped lang="scss"></style>
