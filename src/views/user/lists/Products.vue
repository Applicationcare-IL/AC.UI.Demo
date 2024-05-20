<template>
  <!-- Encabezado de la lista con botones de acción -->
  <WMListSubHeader
    entity="product"
    @new="toggleSidebarVisibility"
    @refresh-table="
      loadLazyData();
      clearSelectedProducts();
    "
    @export="handleExportProducts"
  />

  <!-- Barra lateral para mostrar el detalle de un producto -->
  <WMProductPreviewSidebar
    v-model:visible="isDetailsVisible"
    :product="productDetail"
  />

  <!-- Barra lateral para crear un nuevo producto -->
  <WMSidebar
    :visible="isVisible"
    name="newProduct"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewEntityFormHeader entity="product" name="newProduct" />
    <WMNewProductForm :is-sidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <!-- Contenedor de la tabla de productos -->
  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      ref="dt"
      v-model:selection="selectedProducts"
      lazy
      :value="products"
      data-key="id"
      table-style="min-width: 50rem"
      class="p-datatable-sm"
      scrollable
      scroll-height="flex"
      paginator
      :rows="selectedRowsPerPage"
      :first="0"
      :total-records="totalRecords"
      :loading="loading"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <!-- Columna para mostrar el botón de detalles -->
      <Column style="width: 35px">
        <template #body="slotProps">
          <img
            src="/icons/eye.svg"
            alt=""
            class="vertical-align-middle"
            @click="displayDetails(slotProps.data)"
          />
        </template>
      </Column>

      <!-- Columna para la selección múltiple -->
      <Column style="width: 40px" selection-mode="multiple"></Column>

      <!-- Columna para el número de producto -->
      <Column
        field="id"
        :header="$t('id')"
        class="link-col"
      >
        <template #body="slotProps">
          <router-link
            :to="{ name: 'productDetail', params: { id: slotProps.data.id } }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.id }}
          </router-link>
        </template>
        </Column>
  
<Column field="name" :header="$t('name')"></Column>

<Column field="price" :header="$t('price')"></Column>

<Column field="crm" :header="$t('crm')"></Column>

<Column field="erp" :header="$t('erp')"></Column>

<Column field="purchase" :header="$t('purchase')"></Column>

<Column field="income" :header="$t('income')"></Column>

<Column field="technical_manager" :header="$t('technical_manager')"></Column>

<Column field="marketing_manager" :header="$t('marketing_manager')"></Column>

<Column field="promoted" :header="$t('promoted')"></Column>

<Column field="info_page" :header="$t('info_page')"></Column>   

<Column field="manufacturer_type" :header="$t('manufacturer_type')"></Column>

<Column field="manufacturer" :header="$t('manufacturer')"></Column>

<Column field="product_type" :header="$t('product_type')"></Column>

<Column field="product_family" :header="$t('product_family')"></Column>

<Column field="product_group" :header="$t('product_group')"></Column>

<Column field="product_department" :header="$t('product_department')"></Column>

<Column field="discount_number" :header="$t('discount_number')"></Column>

<Column field="discount_percentage" :header="$t('discount_percentage')"></Column>

<Column field="volume_discount" :header="$t('volume_discount')"></Column>

<Column field="billing_type" :header="$t('billing_type')"></Column>

<Column field="commitment" :header="$t('commitment')"></Column>

<Column field="commitment_units" :header="$t('commitment_units')"></Column>

<Column field="commitment_period" :header="$t('commitment_period')"></Column>

<Column field="warranty" :header="$t('warranty')"></Column>

<Column field="warranty_units" :header="$t('warranty_units')"></Column>

<Column field="warranty_period" :header="$t('warranty_period')"></Column>

<Column field="renewal_type" :header="$t('renewal_type')"></Column>

<Column field="cancellation_type" :header="$t('cancellation_type')"></Column>

<Column field="licensing_required" :header="$t('licensing_required')"></Column>

<Column field="installation_required" :header="$t('installation_required')"></Column>

<Column field="installation_type" :header="$t('installation_type')"></Column>

<Column field="maintenance_required" :header="$t('maintenance_required')"></Column>

<Column field="maintenance_price" :header="$t('maintenance_price')"></Column>

<Column field="maintenance_period" :header="$t('maintenance_period')"></Column>

<Column field="maintenance_payment_cycle" :header="$t('maintenance_payment_cycle')"></Column>

<Column field="end_of_life" :header="$t('end_of_life')"></Column>

<Column field="end_of_service" :header="$t('end_of_service')"></Column>

<Column field="from" :header="$t('from')"></Column>

<Column field="description" :header="$t('description')"></Column>

<Column field="min_price" :header="$t('min_price')"></Column>

<Column field="version" :header="$t('version')"></Column>

<Column field="marketing_info" :header="$t('marketing_info')"></Column>

<Column field="technical_info" :header="$t('technical_info')"></Column>

<Column field="units" :header="$t('units')"></Column>

<Column field="provisioning_required" :header="$t('provisioning_required')"></Column>

<Column field="provisioning_type" :header="$t('provisioning_type')"></Column>

  
      </DataTable>
    </div>
  </template>
<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

useHead({
  title: "Customers",
});

const { setSelectedContacts, resetSelectedContacts, getContactsFromApi } =
  useContacts();
const { optionLabelWithLang } = useLanguages();
const { formatAddress } = useUtils();

onMounted(() => {
  utilsStore.entity = "customer";

  loadLazyData();
  resetSelectedContacts();
});

const utilsStore = useUtilsStore();

const { selectedRowsPerPage, highlightStatusClass } = useListUtils();

const totalRecords = ref(0);
const lazyParams = ref({});
const customers = ref();
const loading = ref(false);
const dt = ref();
const searchValue = ref("");

const { getCustomersFromApi, exportCustomers } = useCustomers();

const loadLazyData = () => {
  loading.value = true;

  const filters = utilsStore.filters["customer"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = selectedRowsPerPage.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  getCustomersFromApi(params).then((result) => {
    customers.value = result.data;
    totalRecords.value = result.totalRecords;
    loading.value = false;
  });
};

const { handleExport } = useExports();

const handleExportCustomers = async () => {
  handleExport({
    filters: utilsStore.filters["customer"],
    searchValue: searchValue.value,
    exportFunction: exportCustomers,
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const isVisible = ref(false);

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

const clearSelectedCustomers = () => {
  selectedCustomers.value = [];
  onSelectionChanged();
};

// Display sidebars
const customerDetail = ref(null);
const displayDetails = (data) => {
  customerDetail.value = data;
  isDetailsVisible.value = true;
};

const isDetailsVisible = ref(false);

const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

// Manage selected rows
const selectedCustomers = ref([]);
utilsStore.resetElements();

const onSelectionChanged = () => {
  setSelectedContacsFromCustomers(selectedCustomers.value);
  utilsStore.selectedElements["customer"] = selectedCustomers.value;
};

/**
 * This function is used to set the selected contacts from the selected customers in the table
 *
 * It's used for SMS and Email communications
 * @param {*} selectedCustomers
 */
const setSelectedContacsFromCustomers = async (selectedCustomers) => {
  const selectedCustomersIds = selectedCustomers
    .map((customer) => customer.id)
    .join(",");

  if (!selectedCustomersIds) {
    setSelectedContacts([]);
    return;
  }

  let params = {
    per_page: 99999,
    customer_id: selectedCustomersIds,
  };

  const selectedContacts = await getContactsFromApi(params);

  // filter duplicated selected contacts based on ids and check if they are not null
  const uniqueSelectedContacts = selectedContacts.data.filter(
    (contact, index, self) =>
      contact && index === self.findIndex((t) => t.id === contact.id)
  );

  if (uniqueSelectedContacts.length > 0) {
    setSelectedContacts(uniqueSelectedContacts);
  }
};

watch(
  () => utilsStore.searchString["customer"],
  () => {
    searchValue.value = utilsStore.searchString["customer"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

// used to load data when filters are changed
watchEffect(() => {
  loadLazyData();
});
</script>

<style scoped lang="scss"></style>
