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
      <WMOwnerToggle entity="customer"/>
    </template>
  </WMListSubHeader>

  <WMCustomerPreviewSidebar v-model:visible="isDetailsVisible" :customer="customerDetail" />

  <WMSidebar
    :visible="isVisible"
    name="newCustomer"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewEntityFormHeader entity="customer" name="newCustomer" />
    <WMNewCustomerForm :is-sidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      ref="dt"
      v-model:selection="selectedCustomers"
      lazy
      :value="customers"
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
      <Column style="width: 40px" selection-mode="multiple"></Column>

      <Column field="id" :header="$t('customer.number-abbreviation')" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{ name: 'customerDetail', params: { id: slotProps.data.id } }"
            class="vertical-align-middle"
            >{{ slotProps.data.id }}</router-link
          >
        </template>
      </Column>

      <Column field="name" :header="$t('customer-name')"></Column>
      <Column field="type" :header="$t('customer.type')">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.type)">
            <WMOptionSetValue :option-set="slotProps.data.type" />
          </div>
        </template>
      </Column>
      <Column field="main_contact" :header="$t('customer.main-contact')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.main_contact?.id != null"
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.main_contact?.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.main_contact.name }}
          </router-link>
        </template>
      </Column>
      <Column field="address" :header="$t('address.address')">
        <template #body="slotProps">
          {{ formatAddress(slotProps.data.location) }}
        </template>
      </Column>
      <Column field="open_services" :header="$t('customer.open-services')" class="numeric"></Column>
      <Column field="breached_services" :header="$t('customer.breached-services')" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_services)">
            {{ slotProps.data.breached_services }}
          </div>
        </template>
      </Column>
      <Column field="open_tasks" :header="$t('customer.open-tasks')" class="numeric"></Column>
      <Column field="breached_tasks" :header="$t('customer.breached-tasks')" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_tasks)">
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>
      <Column field="rating" :header="$t('customer.rating')">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.rating)">
            {{ slotProps.data.rating ? slotProps.data.rating[optionLabelWithLang] : "" }}
          </div>
        </template>
      </Column>
      <Column field="service_areas" :header="$t('customer.areas')">
        <template #body="slotProps">
          <div
            :class="highlightCellClass(slotProps.data.area)"
            class="flex flex-row gap-2 overflow-x-auto max-w-15rem"
          >
            <Chip
              v-for="(area, index) in slotProps.data.service_areas"
              :key="index"
              :label="area[optionLabelWithLang]"
            ></Chip>
          </div>
        </template>
      </Column>
      <Column field="number" :header="$t('customer.number')"></Column>
      <Column field="owner.name" :header="$t('owner')"></Column>
      <Column field="status" :header="$t('status')" class="numeric">
        <template #body="slotProps">
          <div :class="highlightStatusClass(slotProps.data.status.value.toLowerCase())">
            {{ $t("statuses." + slotProps.data.status.value.toLowerCase()) }}
          </div>
        </template>
      </Column>
      <Column field="state" class="filled-td" :header="$t('state.state')">
        <template #body="slotProps">
          <WMStateField :state="slotProps.data.state" />
        </template>
      </Column>
    </DataTable>
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
const {selectedRowsPerPage, highlightStatusClass} = useListUtils();
const {getCustomersFromApi, exportCustomers} = useCustomers();

const utilsStore = useUtilsStore();

const {handleExport} = useExports();

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
