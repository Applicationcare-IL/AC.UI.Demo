<template>
  <WMListSubHeader
    entity="service"
    @new="toggleSidebarVisibility"
    @refresh-table="
      loadLazyData();
      clearSelectedServices();
    "
    @export="handleExportServices"
  >
  </WMListSubHeader>

  <!-- <pre>{{ services }}</pre> -->

  <WMServicePreviewSidebar
    v-model:visible="isDetailsVisible"
    :service="serviceDetail"
  />

  <WMSidebar
    :visible="isVisible"
    name="newService"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewEntityFormHeader entity="service" name="newService" />
    <WMNewServiceForm :is-sidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      ref="dt"
      v-model:selection="selectedServices"
      lazy
      :row-class="rowClass"
      :value="services"
      data-key="service_number"
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
      <Column
        field="service_number"
        :header="$t('service.service-number')"
        class="link-col"
      >
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'serviceDetail',
              params: { id: slotProps.data.service_number },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.service_number }}
          </router-link>
        </template>
      </Column>
      <Column field="contact" :header="$t('contact.contact')" class="link-col">
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.contact_id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.contact }}
          </router-link>
        </template>
      </Column>

      <Column field="open_date" :header="$t('service.start-date')">
        <template #body="slotProps">
          <span>
            {{ formatDate(new Date(slotProps.data.open_date), "DD/MM/YY") }}
          </span>
        </template>
      </Column>
      <Column field="due_date" :header="$t('service.due-date')">
        <template #body="slotProps">
          <span>
            {{ formatDate(new Date(slotProps.data.due_date), "DD/MM/YY") }}
          </span>
        </template>
      </Column>
      <Column field="area.value" :header="$t('service.service-area')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.area" />
        </template>
      </Column>
      <Column field="type.value" :header="$t('service.service-type')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.type" />
        </template>
      </Column>
      <Column field="request1.value" :header="$t('service.request-1')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.request1" />
        </template>
      </Column>
      <Column
        field="days_from_opening_date"
        :header="$t('service.duration')"
      ></Column>
      <Column field="owner.name" :header="$t('service.owner')"></Column>
      <Column field="owner.default_team" :header="$t('service.team')"></Column>
      <Column field="SLA" header="SLA" class="sla">
        <template #body="slotProps">
          <WMSLATag
            v-if="slotProps.data.sla"
            :sla="slotProps.data.sla"
            :days-for-closing="slotProps.data.days_for_closing"
            :state="slotProps.data.state.value"
          >
          </WMSLATag>
        </template>
      </Column>
      <Column
        field="priority"
        :header="$t('service.priority')"
        class="numeric priority"
      >
        <template #body="slotProps">
          <div :class="priorityClass(slotProps.data)">
            {{ slotProps.data.is_active ? slotProps.data.priority : "-" }}
          </div>
        </template>
      </Column>
      <Column field="recurring" :header="$t('service.recurring')">
        <template #body="slotProps">
          {{ $t(slotProps.data.recurring) }}
        </template>
      </Column>
      <Column field="urgency" :header="$t('service.urgency')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.urgency" />
        </template>
      </Column>
      <Column field="last_change" :header="$t('service.last-change')"></Column>
      <Column field="closed" :header="$t('service.date-closed')"></Column>
      <Column field="stage" :header="$t('service.stage')"></Column>
      <Column field="status" :header="$t('service.status')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.status" />
        </template>
      </Column>
      <Column field="state" class="p-0 filled-td" :header="$t('state.state')">
        <template #body="slotProps">
          <WMStateField :state="slotProps.data.state" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup>
// IMPORTS
import { formatDate } from "@vueuse/core";
import { onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { selectedRowsPerPage, getPriorityClasses } = useListUtils();
const { setSelectedContacts, resetSelectedContacts } = useContacts();
const { getServicesFromApi, mapContactsFromServices, exportServices } =
  useServices();

// PROPS, EMITS

// REFS
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");

const services = ref();
const dt = ref();

const isVisible = ref(false);

const isDetailsVisible = ref(false);
const serviceDetail = ref(null);
const selectedServices = ref([]);

// COMPUTED

// COMPONENT METHODS
useHead({
  title: "Services",
});

const clearSelectedServices = () => {
  selectedServices.value = [];
  onSelectionChanged();
};

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

const loadLazyData = () => {
  loading.value = true;

  const filters = utilsStore.filters["service"];
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

  getServicesFromApi(params).then((result) => {
    services.value = result.data;
    totalRecords.value = result.totalRecords;
    loading.value = false;
  });
};

const { handleExport } = useExports();

const handleExportServices = async () => {
  handleExport({
    filters: utilsStore.filters["coservicentact"],
    searchValue: searchValue.value,
    exportFunction: exportServices,
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

// Display sidebars
const displayDetails = (data) => {
  serviceDetail.value = data;
  isDetailsVisible.value = true;
};

const rowClass = (data) => {
  return [{ inactive_row: !data.is_active }];
};

const priorityClass = (data) => {
  return getPriorityClasses(data);
};

// Manage selected rows
const onSelectionChanged = () => {
  setSelectedContacts(mapContactsFromServices(selectedServices.value));
  utilsStore.selectedElements["service"] = selectedServices.value;
};

utilsStore.resetElements();

// WATCHERS
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "service";

  loadLazyData();
  resetSelectedContacts();
});
</script>

<style scoped lang="scss"></style>
