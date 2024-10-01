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
    <template #top-left>
      <WMOwnerToggle entity="contact" />
    </template>
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
    <WMContactsTable
      ref="contactsTable"
      v-model:selection="selectedContacts"
      :columns="columns"
      preview
      selectable
      @update:selection="onSelectionChanged"
    />
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

const columns = [
  {
    name: "contact",
    type: "link",
    field: "render_contact",
    header: "contact.contact",
    routeName: "contactDetail",
  },
  {
    name: "customer",
    type: "link",
    field: "render_customer",
    header: "customer.customer",
    routeName: "customerDetail",
  },
  {
    name: "telephone",
    type: "text",
    field: "render_phone",
    header: "telephone",
  },
  {
    name: "landline",
    type: "text",
    field: "render_landline",
    header: "contact.landline",
  },
  {
    name: "email",
    type: "text",
    field: "render_email",
    header: "email",
  },
  {
    name: "address",
    type: "text",
    field: "render_address",
    header: "contact.address",
  },
  {
    name: "open_services",
    type: "centered-number",
    field: "render_open_services",
    header: "contact.open-services",
  },
  {
    name: "breached_services",
    type: "breached-number",
    field: "render_breached_services",
    header: "contact.breached-services",
  },
  {
    name: "open_tasks",
    type: "centered-number",
    field: "render_open_tasks",
    header: "contact.open-tasks",
  },
  {
    name: "breached_tasks",
    type: "breached-number",
    field: "render_breached_tasks",
    header: "contact.breached-tasks",
  },
  {
    name: "system_id",
    type: "text",
    field: "render_system_id",
    header: "contact.system-id",
  },
  {
    name: "owner",
    type: "text",
    field: "render_owner",
    header: "owner",
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

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const openSidebar = () => {
  isVisible.value = true;
};

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
