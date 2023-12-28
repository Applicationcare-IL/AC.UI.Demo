<template>
  <WMListSubHeader entity="customer" @new="toggleSidebarVisibility">
  </WMListSubHeader>

  <WMCustomerPreviewSidebar
    :customer="customerDetail"
    v-model:visible="isDetailsVisible"
  />

  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newCustomer"
  >
    <WMNewEntityFormHeader entity="customer" name="newCustomer" />
    <WMNewCustomerForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      lazy
      v-model:selection="selectedCustomers"
      :value="customers"
      dataKey="id"
      tableStyle="min-width: 50rem"
      class="p-datatable-sm"
      scrollable
      scrollHeight="flex"
      paginator
      :rows="selectedRowsPerPage"
      :first="0"
      ref="dt"
      :totalRecords="totalRecords"
      :loading="loading"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <Column style="width: 35px">
        <template #body="slotProps">
          <img
            @click="displayDetails(slotProps.data)"
            src="/icons/eye.svg"
            alt=""
            class="vertical-align-middle"
          />
        </template>
      </Column>
      <Column style="width: 40px" selectionMode="multiple"></Column>

      <Column
        field="id"
        :header="$t('customer.number-abbreviation')"
        class="link-col"
      >
        <template #body="slotProps">
          <router-link
            :to="{ name: 'customerDetail', params: { id: slotProps.data.id } }"
            class="vertical-align-middle"
            >{{ slotProps.data.id }}</router-link
          >
        </template>
      </Column>

      <Column field="name" :header="$t('customer_name')"></Column>
      <Column field="type" :header="$t('customer.type')">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.type)">
            {{ $t("option-set.customer_type." + slotProps.data.type.value) }}
          </div>
        </template>
      </Column>
      <Column
        field="main_contact"
        :header="$t('customer.main-contact')"
        class="link-col"
      >
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.main_contact?.id != null"
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.main_contact?.id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.main_contact.name }}</router-link
          >
        </template>
      </Column>
      <Column field="status" :header="$t('status')">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.status)">
            {{ $t("statuses." + slotProps.data.status.toLowerCase()) }}
          </div>
        </template>
      </Column>
      <Column field="address" :header="$t('address.address')"></Column>
      <Column
        field="open_services"
        :header="$t('customer.open-services')"
        class="numeric"
      ></Column>
      <Column
        field="breached_services"
        :header="$t('customer.breached-services')"
        class="numeric"
      >
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_services)">
            {{ slotProps.data.breached_services }}
          </div>
        </template>
      </Column>
      <Column
        field="open_tasks"
        :header="$t('customer.open-tasks')"
        class="numeric"
      ></Column>
      <Column
        field="breached_tasks"
        :header="$t('customer.breached-tasks')"
        class="numeric"
      >
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_tasks)">
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>
      <Column field="rating" :header="$t('customer.rating')">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.rating)">
            {{
              slotProps.data.rating
                ? $t("customer-rating." + slotProps.data.rating.value)
                : ""
            }}
          </div>
        </template>
      </Column>
      <Column field="service_areas" :header="$t('customer.areas')">
        <template #body="slotProps">
          <div
            :class="highlightCellClass(slotProps.data.area)"
            class="flex flex-row gap-2"
          >
            <Chip
              v-for="area in slotProps.data.service_areas"
              :label="area.value"
            ></Chip>
          </div>
        </template>
      </Column>
      <Column field="number" :header="$t('customer.number')" frozen></Column>
      <Column field="owner.name" :header="$t('owner')"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, watchEffect } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useLayout } from "@/layout/composables/layout";

useHead({
  title: "Customers",
});

const { getTasksMini } = useTasks();
const { getServicesMini } = useServices();
const { setSelectedContacts, resetSelectedContacts } = useContacts();

onMounted(() => {
  utilsStore.entity = "customer";

  loadLazyData();
  resetSelectedContacts();

  getServicesMini().then((data) => (services.value = data));
  getTasksMini().then((data) => (tasks.value = data));
});

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const { layoutConfig } = useLayout();

const { selectedRowsPerPage, getContactDetailColumns } = useListUtils();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const customers = ref();
const services = ref();
const tasks = ref();
const loading = ref(false);
const dt = ref();
const searchValue = ref("");

const { getCustomersFromApi } = useCustomers();

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

//Display sidebars
const contactColumns = ref(getContactDetailColumns());
const customerDetail = ref(null);
const displayDetails = (data) => {
  customerDetail.value = data;
  isDetailsVisible.value = true;
};

const isDetailsVisible = ref(false);

const displayNewForm = () => {
  formUtilsStore.expandSidebar = "newCustomer";
};

// TODO:Move to Store
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
const setSelectedContacsFromCustomers = (selectedCustomers) => {
  const selectedContacts = selectedCustomers.map((customer) => {
    return customer.main_contact;
  });

  // filter duplicated selected contacts based on ids
  const uniqueSelectedContacts = selectedContacts.filter(
    (contact, index, self) =>
      index === self.findIndex((t) => t.id === contact.id)
  );

  setSelectedContacts(uniqueSelectedContacts);
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

watchEffect(() => {
  loadLazyData();
});
</script>

<style scoped lang="scss"></style>
