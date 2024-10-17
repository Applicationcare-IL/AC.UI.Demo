<template>
  <WMListSubHeader
    entity="sale"
    :total-records="0"
    :has-action-builder="false"
    @new="redirectToNewSalePage"
  >
    <template #top-left>
      <div class="gap-1 flex">
        <WMStateToggle entity="sale" />
        <Divider layout="vertical" />
        <WMOwnerToggle entity="sale" />
      </div>
    </template>
  </WMListSubHeader>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMSalesTable
      ref="salesTable"
      :columns="columns"
      :sales="sales"
      :total-records="totalRecords"
      :loading="loading"
      preview
      selectable
      @update:selection="onSelectionChanged"
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
const { getSales } = useSales();

// INJECT

// PROPS, EMITS

// REFS
const sales = ref([]);
const searchValue = ref("");
const loading = ref(false);
const currentPage = ref(0);
const totalRecords = ref(0);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "saleDetail",
  },
  {
    name: "contact",
    type: "link",
    field: "render_contact",
    header: "sale.contact",
    routeName: "contactDetail",
  },
  {
    name: "customer",
    type: "link",
    field: "render_customer",
    header: "sale.customer",
    routeName: "customerDetail",
  },
  {
    name: "sale-type",
    type: "text",
    field: "render_sale_type",
    header: "sale.sale-type",
  },
  {
    name: "sale-source",
    type: "text",
    field: "render_sale_source",
    header: "sale.sale-source",
  },
  {
    name: "tender",
    type: "checkbox",
    field: "render_tender",
    header: "sale.tender",
  },
  {
    name: "initiator",
    type: "text", // link cuando sepamos a donde lleva
    field: "render_initiator",
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
    field: "render_sla",
    header: "sale.sla",
    class: "filled-td",
  },
  {
    name: "stage-in-sale",
    type: "text",
    field: "render_current_stage",
    header: "sale.stage-in-sale",
  },
  {
    name: "owner",
    type: "text",
    field: "render_owner",
    header: "owner",
  },
  {
    name: "waiting-for-customers",
    type: "checkbox",
    field: "render_waiting_customers",
    header: "sale.waiting-for-customers",
  },
  {
    name: "open-tasks",
    type: "centered-number",
    field: "render_open_tasks",
    header: "sale.open-tasks",
  },
  {
    name: "breached-tasks",
    type: "breached-number",
    field: "render_breached_tasks",
    header: "sale.breached-tasks",
    class: "filled-td",
  },
  {
    name: "deal-price-base",
    type: "currency",
    field: "render_price_base",
    header: "sale.deal-price-base",
  },
  {
    name: "total-discount",
    type: "currency",
    field: "render_discount",
    header: "sale.total-discount",
  },
  {
    name: "deal-price-final",
    type: "currency",
    field: "render_price_final",
    header: "sale.deal-price-final",
  },
  {
    name: "budget",
    type: "currency",
    field: "render_budget",
    header: "sale.budget",
  },
  {
    name: "last-change",
    type: "date",
    field: "last_change_date",
    header: "sale.last-change",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "State",
    width: "100px",
    class: "py-0 filled-td",
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

const loadSales = async () => {
  loading.value = true;
  const filters = utilsStore.filters["sale"];
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

  let response = await getSales(params);

  sales.value = response.data;
  totalRecords.value = response.totalRecords;
  loading.value = false;
};

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadSales();
});

watch(
  () => utilsStore.searchString["sale"],
  () => {
    searchValue.value = utilsStore.searchString["sale"];
    utilsStore.debounceAction(() => {
      loadSales();
    });
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "sale";

  loadSales();
});
</script>

<style scoped lang="scss"></style>
