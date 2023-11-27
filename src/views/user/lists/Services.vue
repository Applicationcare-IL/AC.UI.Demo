<template>
  <WMListSubHeader
    :filterLabels="filterLabels"
    :defaultOption="filterLabels[1]"
    @new="toggleSidebarVisibility"
    entity="service"
  >
  </WMListSubHeader>
  <Sidebar
    v-model:visible="isDetailsVisible"
    class="details-sidebar w-6"
    :showCloseIcon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <h2>{{ $t("service.service") }} {{ serviceDetail.service_number }}</h2>
    <Divider />
    <!-- <WMContactsTable :customer="serviceDetail" :columns="serviceColumns" :showControls="false" :rows="5" /> -->
  </Sidebar>

  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newService"
  >
    <WMNewEntityFormHeader entity="service" name="newService" />
    <WMNewServiceForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      v-model:selection="selectedServices"
      :rowClass="rowClass"
      :value="services"
      dataKey="service_number"
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
      <Column field="service_number" header="מס’ תהליך" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'serviceDetail',
              params: { id: slotProps.data.service_number },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.service_number }}</router-link
          >
        </template>
      </Column>
      <Column field="contact" header="איש קשר" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.contact_id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.contact }}</router-link
          >
        </template>
      </Column>

      <Column field="open_date" header="נפתח">
        <template #body="slotProps">
          <span>{{
            formatDate(new Date(slotProps.data.open_date), "DD/MM/YY")
          }}</span>
        </template>
      </Column>
      <Column field="due_date" header="תאריך יעד">
        <template #body="slotProps">
          <span>{{
            formatDate(new Date(slotProps.data.due_date), "DD/MM/YY")
          }}</span>
        </template>
      </Column>
      <Column field="area.value" header="תחום"></Column>
      <Column field="type.value" header="תת-תחום"></Column>
      <Column field="request1.value" header="מהות"></Column>
      <Column field="days_from_opening_date" header="משך"></Column>
      <Column field="owner.name" header="אחראי"></Column>
      <Column field="owner.default_team" header="צוות"></Column>
      <Column field="SLA" header="SLA" class="sla">
        <template #body="slotProps">
          <WMSLATag :sla="slotProps.data.sla">
            {{ $t("sla.days_left", [slotProps.data.days_for_closing]) }}
          </WMSLATag>
        </template>
      </Column>
      <Column field="priority" header="עדיפות" class="numeric priority">
        <template #body="slotProps">
          <div :class="priorityClass(slotProps.data)">
            {{ slotProps.data.is_active ? slotProps.data.priority : "-" }}
          </div>
        </template>
      </Column>
      <Column field="recurring" header="חוזר">
        <template #body="slotProps">
          {{ $t(slotProps.data.recurring) }}
        </template>
      </Column>
      <Column field="urgency" header="דחיפות">
        <template #body="slotProps">
          {{ $t("option-set.service_urgent." + slotProps.data.urgency) }}
        </template>
      </Column>
      <Column field="last_activity" header="שינוי אחרון"></Column>
      <Column field="closed" header="נסגר"></Column>
      <Column field="stage" header="שליחת נציג בטחון"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, watchEffect } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";

import { useLayout } from "@/layout/composables/layout";

import { formatDate } from "@vueuse/core";
import WMSLATag from "../../../components/WMSLATag.vue";

const { layoutConfig } = useLayout();
const formUtilsStore = useFormUtilsStore();

const utilsStore = useUtilsStore();

const { selectedRowsPerPage } = useListUtils();

const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});

const services = ref();
const dt = ref();

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

onMounted(() => {
  utilsStore.entity = "service";

  loadLazyData();
});

const searchValue = ref("");

const { getServicesFromApi } = useServices();

const loadLazyData = () => {
  loading.value = true;
  getServicesFromApi({
    page: lazyParams.value.page + 1,
    per_page: selectedRowsPerPage.value,
    search: searchValue.value,
  }).then((result) => {
    services.value = result.data;
    totalRecords.value = result.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const isDetailsVisible = ref(false);

//Display sidebars
const serviceDetail = ref(null);
const displayDetails = (data) => {
  serviceDetail.value = data;
  isDetailsVisible.value = true;
};

const rowClass = (data) => {
  return [{ inactive_row: !data.is_active }];
};

const priorityClass = (data) => {
  return [
    "text-blue-600",
    {
      "bg-blue-75": data.priority === 1 && data.is_active,
      "bg-blue-50": data.priority === 2 && data.is_active,
      "bg-blue-25": data.priority === 3 && data.is_active,
    },
  ];
};

const menuItems = [
  { label: "Whatsapp", value: "option1" },
  { label: "SMS", value: "option2" },
];

const filterLabels = [
  { name: "כל התהליכים", value: 2 },
  { name: "התהליכים שלי", value: 1 },
];

//Manage selected rows
const selectedServices = ref([]);
utilsStore.resetElements();
const onSelectionChanged = () => {
  console.log(selectedServices.value);
  utilsStore.selectedElements["service"] = selectedServices.value;
};

watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["service"],
  () => {
    searchValue.value = utilsStore.searchString["service"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);
</script>

<style scoped lang="scss"></style>
