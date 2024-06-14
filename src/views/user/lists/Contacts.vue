<template>
  <WMListSubHeader
    v-if="permissions.contacts.read"
    entity="contact"
    :total-records="totalRecords"
    @new="toggleSidebarVisibility"
    @refresh-table="
      loadLazyData();
      clearSelectedContacts();
    "
    @export="handleExportContacts"
  >
  </WMListSubHeader>

  <WMContactPreviewSidebar v-model:visible="isDetailsVisible" :contact="contactDetail" />

  <WMSidebar
    :visible="isVisible"
    name="newContact"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <template v-if="can('contacts.create')">
      <WMNewEntityFormHeader entity="contact" name="newContact" />
      <WMNewContactForm :is-sidebar="true" @close-sidebar="closeSidebar" />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      v-if="permissions.contacts.read"
      ref="dt"
      v-model:selection="selectedContacts"
      lazy
      :value="contacts"
      data-key="contact_id"
      table-style="min-width: 50rem"
      class="p-datatable-sm"
      paginator
      scrollable
      scroll-height="flex"
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
      <Column field="contact" :header="$t('contact.contact')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.contact_id"
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.contact_id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.name }}</router-link
          >
        </template>
      </Column>
      <Column field="customer" :header="$t('customer.customer')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.customers.length === 1"
            :to="{
              name: 'customerDetail',
              params: { id: slotProps.data.customers[0]?.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.first_customer_full_name }}
          </router-link>
          <span
            v-if="slotProps.data.customers.length > 1"
            class="w-full text-center font-bold block"
          >
            ...
          </span>
        </template>
      </Column>
      <Column field="telephone" :header="$t('contact.telephone')"></Column>
      <Column field="landline" :header="$t('contact.landline')"></Column>
      <Column field="email" :header="$t('contact.email')"></Column>
      <Column field="address" :header="$t('contact.address')">
        <template #body="slotProps">
          {{ formatAddress(slotProps.data.location) }}
        </template>
      </Column>
      <Column field="open_services" :header="$t('contact.open-services')" class="numeric"> </Column>
      <Column field="breached_services" :header="$t('contact.breached-services')" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_services)">
            {{ slotProps.data.breached_services }}
          </div>
        </template>
      </Column>
      <Column field="open_tasks" :header="$t('contact.open-tasks')" class="numeric"> </Column>
      <Column field="breached_tasks" :header="$t('contact.breached-tasks')" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_tasks)">
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>
      <Column field="contact_id" :header="$t('contact.system-id')"></Column>
      <Column field="owner.name" :header="$t('owner')"></Column>
      <Column field="state" class="p-0 filled-td" :header="$t('state.state')">
        <template #body="slotProps">
          <WMStateField :state="slotProps.data.state" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";

const { can } = usePermissions();

import { usePermissionsStore } from "@/stores/permissionsStore";
import { useUtilsStore } from "@/stores/utils";

useHead({
  title: "Contacts",
});

const permissionsStore = usePermissionsStore();
const permissions = permissionsStore.permissions;
const { formatAddress } = useUtils();

const { getContactsFromApi, setSelectedContacts, resetSelectedContacts, exportContacts } =
  useContacts();
const { selectedRowsPerPage } = useListUtils();

onMounted(() => {
  utilsStore.entity = "contact";

  loadLazyData();
  resetSelectedContacts();
});

const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const contacts = ref();
const loading = ref(false);
const dt = ref();
const searchValue = ref("");

const loadLazyData = () => {
  loading.value = true;

  const filters = utilsStore.filters["contact"];
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

  getContactsFromApi(params).then((result) => {
    contacts.value = result.data;
    totalRecords.value = result.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const clearSelectedContacts = () => {
  selectedContacts.value = [];
  onSelectionChanged();
};

//Display sidebars
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

const contactDetail = ref(null);
const displayDetails = (data) => {
  contactDetail.value = data;
  isDetailsVisible.value = true;
};

const isDetailsVisible = ref(false);

const { handleExport } = useExports();

const handleExportContacts = async () => {
  handleExport({
    filters: utilsStore.filters["contact"],
    searchValue: searchValue.value,
    exportFunction: exportContacts,
  });
};

//Move to Store
const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

//Manage selected rows
const selectedContacts = ref([]);
utilsStore.resetElements();

const onSelectionChanged = () => {
  setSelectedContacts(selectedContacts.value);

  utilsStore.selectedElements["contact"] = selectedContacts.value;
};

watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["contact"],
  () => {
    searchValue.value = utilsStore.searchString["contact"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);
</script>

<style scoped lang="scss"></style>
