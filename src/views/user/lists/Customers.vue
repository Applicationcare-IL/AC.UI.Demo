<template>
  <WMListSubHeader
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    entity="customer"
    @new="toggleSidebarVisibility"
  >
  </WMListSubHeader>

  <Sidebar
    v-model:visible="isDetailsVisible"
    class="details-sidebar w-6"
    :showCloseIcon="false"
  >
    <h2>{{ customerDetail.name }}</h2>
    <Divider />
    <WMContactsTable
      :customer="customerDetail"
      :columns="contactColumns"
      :showControls="false"
      :rows="5"
    />
  </Sidebar>

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

      <Column field="id" header="מס’ לקוח" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{ name: 'customerDetail', params: { id: slotProps.data.id } }"
            class="vertical-align-middle"
            >{{ slotProps.data.id }}</router-link
          >
        </template>
      </Column>

      <Column field="name" header="שם לקוח"></Column>
      <Column field="type" header="סוג">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.type)">
            {{ $t("option-set.customer_type." + slotProps.data.type.value) }}
          </div>
        </template>
      </Column>
      <Column field="main_contact" header="איש קשר ראשי" class="link-col">
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
      <Column field="status" header="סטטוס">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.status)">
            {{ $t("statuses." + slotProps.data.status.toLowerCase()) }}
          </div>
        </template>
      </Column>
      <Column field="address" header="כתובת"></Column>
      <Column
        field="open_services"
        header="תהליכים פתוחים"
        class="numeric"
      ></Column>
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
      <Column field="rating" header="דירוג">
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
      <Column field="service_areas" header="תחום">
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
      <Column field="number" header="מזהה"></Column>
      <Column field="owner.name" header="אחראי"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { CustomerService } from "@/service/CustomerService";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useListUtilsStore } from "@/stores/listUtils";

const { getTasksMini } = useTasks();
const { getServicesMini } = useServices();

onMounted(() => {
  utilsStore.entity = "customer";

  loadLazyData();

  getServicesMini().then((data) => (services.value = data));
  getTasksMini().then((data) => (tasks.value = data));
});

const formUtilsStore = useFormUtilsStore();
const listUtilsStore = useListUtilsStore();
const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const customers = ref();
const services = ref();
const tasks = ref();
const loading = ref(false);
const dt = ref();
const searchValue = ref("");

const loadLazyData = () => {
  loading.value = true;

  CustomerService.getCustomersFromApi({
    page: lazyParams.value.page + 1,
    per_page: listUtilsStore.rows,
    search: searchValue.value,
  }).then((result) => {
    console.log(result);
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
const contactColumns = ref(listUtilsStore.getContactDetailColumns);
const customerDetail = ref(null);
const displayDetails = (data) => {
  customerDetail.value = data;
  isDetailsVisible.value = true;
};

const isDetailsVisible = ref(false);

const displayNewForm = () => {
  formUtilsStore.expandSidebar = "newCustomer";
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
const selectedCustomers = ref([]);
utilsStore.resetElements();
const onSelectionChanged = () => {
  utilsStore.selectedElements["customer"] = selectedCustomers.value;
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

watch(
  () => utilsStore.searchString["customer"],
  () => {
    searchValue.value = utilsStore.searchString["customer"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);
</script>

<style scoped lang="scss"></style>
