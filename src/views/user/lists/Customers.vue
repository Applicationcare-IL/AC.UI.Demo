<template>
  <WMListSubHeader
    entity="customer"
    :total-records="totalRecords"
    @new="toggleSidebarVisibility"
    @refresh-table="
      loadLazyData();
      clearSelectedCustomers();
    "
    @export="handleExportCustomers"
  >
    <template #top-left>
      <WMOwnerToggle entity="customer" />
    </template>
  </WMListSubHeader>

  <WMCustomerPreviewSidebar v-model:visible="isDetailsVisible" :customer="customerDetail" />

  <WMSidebar
    :visible="isVisible"
    name="newCustomer"
    data-testid="new_form"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewEntityFormHeader entity="customer" name="newCustomer" />
    <WMNewCustomerForm :is-sidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMCustomersTableTemp
      ref="customersTable"
      v-model:selection="selectedCustomers"
      :columns="columns"
      preview
      selectable
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { setSelectedContacts, resetSelectedContacts, getContactsFromApi } = useContacts();
const { optionLabelWithLang } = useLanguages();
const { formatAddress } = useUtils();
const { selectedRowsPerPage, highlightStatusClass } = useListUtils();
const { getCustomersFromApi, exportCustomers } = useCustomers();

const utilsStore = useUtilsStore();

const { handleExport } = useExports();

// INJECT

// PROPS, EMITS

// REFS
const totalRecords = ref(0);
const lazyParams = ref({});
const customers = ref();
const loading = ref(false);
const dt = ref();
const searchValue = ref("");
const isVisible = ref(false);
const selectedCustomers = ref([]);
const isDetailsVisible = ref(false);
const customerDetail = ref(null);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "customerDetail",
  },
  {
    name: "customer-name",
    type: "text",
    field: "render_name",
    header: "customer.name",
  },
  {
    name: "type",
    type: "text",
    field: "render_type",
    header: "customer.type",
  },
  {
    name: "main-contact",
    type: "link",
    field: "render_main_contact",
    header: "customer.main-contact",
    routeName: "customerDetail",
  },
  {
    name: "address",
    type: "text",
    field: "render_location",
    header: "address.address",
  },
  {
    name: "open-services",
    type: "centered-number",
    field: "render_open_services",
    header: "customer.open-services",
  },
  {
    name: "breached-services",
    type: "breached-number",
    field: "render_breached_services",
    header: "customer.breached-services",
    class: "p-0 filled-td",
  },
  {
    name: "open-tasks",
    type: "centered-number",
    field: "render_open_tasks",
    header: "customer.open-tasks",
  },
  {
    name: "breached-tasks",
    type: "breached-number",
    field: "render_breached_tasks",
    header: "customer.breached-tasks",
    class: "p-0 filled-td",
  },
  {
    name: "rating",
    type: "text",
    field: "render_rating",
    header: "customer.rating",
  },
  {
    name: "service-areas",
    type: "chips",
    field: "render_service_areas",
    header: "customer.service-areas",
  },
  {
    name: "customer-number",
    type: "text",
    field: "render_number",
    header: "customer.number",
  },
  {
    name: "owner",
    type: "text",
    field: "render_owner",
    header: "customer.owner",
  },
  {
    name: "status",
    type: "status",
    field: "render_status",
    header: "status",
  },
  {
    name: "state",
    type: "state",
    field: "state",
    header: "state.state",
    width: "100px",
    class: "filled-td",
  },
];
// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Customers",
});

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

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const openSidebar = () => {
  isVisible.value = true;
};

const clearSelectedCustomers = () => {
  selectedCustomers.value = [];
  onSelectionChanged();
};

// Display sidebars
const displayDetails = (data) => {
  customerDetail.value = data;
  isDetailsVisible.value = true;
};

const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

// Manage selected rows
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
  const selectedCustomersIds = selectedCustomers.map((customer) => customer.id).join(",");

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
    (contact, index, self) => contact && index === self.findIndex((t) => t.id === contact.id)
  );

  if (uniqueSelectedContacts.length > 0) {
    setSelectedContacts(uniqueSelectedContacts);
  }
};

// PROVIDE, EXPOSE

// WATCHERS
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "customer";

  loadLazyData();
  resetSelectedContacts();

  utilsStore.resetElements();
});
</script>

<style scoped lang="scss"></style>
