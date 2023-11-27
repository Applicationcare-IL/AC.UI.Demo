<template>
  <WMListSubHeader
    v-if="permissions.contacts.read"
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    entity="contact"
    @new="toggleSidebarVisibility"
  >
  </WMListSubHeader>
  <Sidebar
    v-model:visible="isDetailsVisible"
    class="details-sidebar w-6"
    :showCloseIcon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <h2>{{ contactDetail.name }}</h2>
    <Divider />
    <WMCustomersTable
      :contact="contactDetail"
      :columns="customerColumns"
      :showControls="false"
      :rows="5"
    />
  </Sidebar>
  <Sidebar
    v-model:visible="isDetailsVisible"
    class="details-sidebar w-6"
    :showCloseIcon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <h2>{{ contactDetail.name }}</h2>
    <Divider />
    <WMCustomersTable
      :contact="contactDetail"
      :columns="customerColumns"
      :showControls="false"
      :rows="5"
    />
  </Sidebar>

  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newContact"
  >
    <WMNewEntityFormHeader entity="contact" name="newContact" />
    <WMNewContactForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      v-if="permissions.contacts.read"
      lazy
      v-model:selection="selectedContacts"
      :value="contacts"
      dataKey="contact_id"
      tableStyle="min-width: 50rem"
      class="p-datatable-sm"
      paginator
      scrollable
      scrollHeight="flex"
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
      <Column field="contact" header="איש קשר" class="link-col">
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
      <Column field="customer" header="לקוח" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.customer?.id"
            :to="{
              name: 'customerDetail',
              params: { id: slotProps.data.customer?.id },
            }"
            class="vertical-align-middle"
            >{{
              slotProps.data.customer.name +
              " " +
              slotProps.data.customer.surname
            }}</router-link
          >
        </template>
      </Column>
      <Column field="telephone" header="טלפון נייד"></Column>
      <Column field="landline" header="טלפון נייח"></Column>
      <Column field="email" header="דוא”ל"></Column>
      <Column field="address" header="כתובת"></Column>
      <Column field="open_services" header="תהליכים פתוחים" class="numeric">
      </Column>
      <Column field="breached_services" header="תהליכים בחריגה" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_services)">
            {{ slotProps.data.breached_services }}
          </div>
        </template>
      </Column>
      <Column field="open_tasks" header="תהליכים בחריגה" class="numeric">
      </Column>
      <Column field="breached_tasks" header="משימות בחריגה" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_tasks)">
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>
      <Column field="contact_id" header="מזהה"></Column>
      <Column field="owner.name" header="אחראי"></Column>
      <Column field="status" header="סטטוס" class="numeric">
        <template #body="slotProps">
          <div :class="highlightStatusClass(slotProps.data.status)">
            {{ $t("statuses." + slotProps.data.status) }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, watchEffect } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";
import { usePermissionsStore } from "@/stores/permissionsStore";

import { useLayout } from "@/layout/composables/layout";

const { getTasksMini } = useTasks();
const { layoutConfig } = useLayout();
const { getServicesMini } = useServices();
const permissionsStore = usePermissionsStore();
const permissions = permissionsStore.permissions;

onMounted(() => {
  utilsStore.entity = "contact";

  loadLazyData();

  getServicesMini().then((data) => (services.value = data));
  getTasksMini().then((data) => (tasks.value = data));
});

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const contacts = ref();
const services = ref();
const tasks = ref();
const loading = ref(false);
const dt = ref();
const searchValue = ref("");

const { getContactsFromApi } = useContacts();
const { getCustomerDetailColumns, selectedRowsPerPage } = useListUtils();

const loadLazyData = () => {
  loading.value = true;

  getContactsFromApi({
    page: lazyParams.value.page + 1,
    per_page: selectedRowsPerPage.value,
    search: searchValue.value,
  }).then((result) => {
    console.log(result);
    contacts.value = result.data;
    totalRecords.value = result.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
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

const customerColumns = ref(getCustomerDetailColumns());
const contactDetail = ref(null);
const displayDetails = (data) => {
  contactDetail.value = data;
  isDetailsVisible.value = true;
};

const isDetailsVisible = ref(false);
const displayNewForm = () => {
  formUtilsStore.expandSidebar = "newContact";
};

//Move to Store
const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

const highlightStatusClass = (status) => {
  return [
    {
      "bg-green-200 text-green-900": status === "active",
      "bg-yellow-100 text-gray-900": status === "terminated",
    },
  ];
};

const filterLabels = [
  { name: "כל הלקוחות", value: 2 },
  { name: "הלקוחות שלי", value: 1 },
];

//Manage selected rows
const selectedContacts = ref([]);
utilsStore.resetElements();
const onSelectionChanged = () => {
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
