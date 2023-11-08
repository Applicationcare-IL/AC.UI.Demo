<template>
  <WMListSubHeader
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    entity="contact"
    @new="displayNewForm"
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
  <WMNewEntitySidebar name="newContact" entity="contact" />
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      lazy
      v-model:selection="selectedContacts"
      :value="contacts"
      dataKey="contact_id"
      tableStyle="min-width: 50rem"
      class="p-datatable-sm"
      paginator
      scrollable
      scrollHeight="flex"
      :rows="rows"
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
            :to="{
              name: 'customerDetail',
              params: { id: slotProps.data.customer_id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.customer }}</router-link
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
      <Column
        field="open_tasks"
        header="תהליכים בחריגה"
        class="numeric"
      ></Column>
      <Column field="breached_tasks" header="משימות בחריגה" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_tasks)">
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>
      <Column field="contact_id" header="מזהה"></Column>
      <Column field="status" header="סטטוס"></Column>
      <Column field="owner" header="אחראי"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { ContactsService } from "@/service/ContactsService";
import { ServicesService } from "@/service/ServicesService";
import { TasksService } from "@/service/TasksService";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useListUtilsStore } from "@/stores/listUtils";
import WMCustomersTable from "@/components/tables/WMCustomersTable.vue";
import WMListSubHeader from "@/components/layout/WMListSubHeader.vue";
import WMNewEntitySidebar from "@/components/layout/WMNewEntitySidebar.vue";
import { useLayout } from "@/layout/composables/layout";
const { layoutConfig } = useLayout();

onMounted(() => {
  utilsStore.entity = "contact";

  loadLazyData();

  ServicesService.getServicesMini().then((data) => (services.value = data));
  TasksService.getTasksMini().then((data) => (tasks.value = data));
});

const formUtilsStore = useFormUtilsStore();
const listUtilsStore = useListUtilsStore();
const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const contacts = ref();
const services = ref();
const tasks = ref();
const loading = ref(false);
const dt = ref();

const loadLazyData = () => {
  loading.value = true;

  ContactsService.getContactsFromApi({
    page: lazyParams.value.page + 1,
    per_page: listUtilsStore.rows,
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
const customerColumns = ref(listUtilsStore.getCustomerDetailColumns);
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

//Number of rows per page
const rows = computed(() => {
  return listUtilsStore.rows;
});

watch(
  () => listUtilsStore.rows,
  () => {
    loadLazyData();
  }
);
</script>

<style scoped lang="scss"></style>
