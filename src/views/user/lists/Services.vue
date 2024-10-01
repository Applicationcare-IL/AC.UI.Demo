<template>
  <WMListSubHeader
    entity="service"
    :total-records="totalRecords"
    @new="toggleSidebarVisibility"
    @refresh-table="
      loadLazyData();
      clearSelectedServices();
    "
    @export="handleExportServices"
  >
    <template #top-left>
      <WMStateToggle entity="service" />
    </template>
  </WMListSubHeader>

  <WMServicePreviewSidebar v-model:visible="isDetailsVisible" :service="serviceDetail" />

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
    <WMServicesTableTemp
      ref="servicesTable"
      v-model:selection="selectedServices"
      :columns="columns"
      :row-class="rowClass"
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
const utilsStore = useUtilsStore();
const { selectedRowsPerPage, getPriorityClasses } = useListUtils();
const { setSelectedContacts, resetSelectedContacts } = useContacts();
const { getServicesFromApi, mapContactsFromServices, exportServices } = useServices();

// PROPS, EMITS

// REFS
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");

const services = ref();

const isVisible = ref(false);

const isDetailsVisible = ref(false);
const serviceDetail = ref(null);
const selectedServices = ref([]);

const columns = [
  {
    name: "service_number",
    type: "link",
    field: "render_service_number",
    header: "service-number",
    routeName: "serviceDetail",
  },
  {
    name: "contact",
    type: "link",
    field: "render_contact",
    header: "contact",
    routeName: "contactDetail",
  },
  {
    name: "start_date",
    type: "date",
    field: "render_start_date",
    header: "start-date",
  },
  {
    name: "due_date",
    type: "date",
    field: "render_due_date",
    header: "start-date",
  },
  {
    name: "service_area",
    type: "option-set",
    field: "render_service_area",
    header: "service-area",
  },
  {
    name: "service_type",
    type: "option-set",
    field: "render_service_type",
    header: "service-type",
  },
  {
    name: "request_1",
    type: "option-set",
    field: "render_request_1",
    header: "request-1",
  },
  {
    name: "duration",
    type: "text",
    field: "render_duration",
    header: "duracion",
  },
  {
    name: "owner",
    type: "text",
    field: "render_owner",
    header: "owner",
  },
  {
    name: "team",
    type: "text",
    field: "render_team",
    header: "team",
  },
  {
    name: "sla",
    type: "sla",
    field: "render_sla",
    header: "sla",
  },
  {
    name: "priority",
    type: "centered-number",
    field: "render_priority",
    header: "priority",
  },
  {
    name: "recurring",
    type: "text",
    field: "render_recurring",
    header: "recurring",
    class: "capitalize",
  },
  {
    name: "urgency",
    type: "option-set",
    field: "render_urgency",
    header: "urgency",
  },
  {
    name: "last_change",
    type: "text",
    field: "render_last_change",
    header: "last_change",
  },
  {
    name: "closed_at",
    type: "date",
    field: "render_closed_at",
    header: "closed_at",
  },
  {
    name: "stage",
    type: "text",
    field: "render_stage",
    header: "stage",
  },
  {
    name: "status",
    type: "option-set",
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
  title: "Services",
});

const clearSelectedServices = () => {
  selectedServices.value = [];
  onSelectionChanged();
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
    filters: utilsStore.filters["service"],
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
