<template>
  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newService"
  >
    <WMNewEntityFormHeader entity="service" name="newService" />
    <WMNewTaskForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>
  <h2 class="h2">{{ $t("service.services") }}</h2>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
          >{{ t("new") }}</WMButton
        >
        <WMAssignOwnerButton entity="service" />
        <WMButton class="m-1 col-6" name="export-white" icon="export"
          >ייצוא נתונים</WMButton
        >
        <Divider layout="vertical" />
        <WMButtonMenu class="m-1" mode="light" :menuItems="menuItems"
          >הודעה</WMButtonMenu
        >
        <WMButton class="m-1 col-6" name="phone-white" icon="phone"
          >הקצה</WMButton
        >
        <WMButton class="m-1 col-6" name="mail-white" icon="mail"
          >הקצה</WMButton
        >
      </div>
      <div class="flex flex-row align-items-center gap-3">
        <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          @click="openFilterSidebar"
          >{{ t("filter") }}
        </WMButton>
        <WMSidebar
          :visible="isFilterVisible"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
          name="filterService"
        >
          <WMFilterForm entity="service" filterFormName="service" />
        </WMSidebar>
        <SelectButton
          v-model="selectedOption"
          :options="options"
          optionLabel="name"
          class="flex flex-nowrap"
        />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="service" />
    </div>
  </div>
  <DataTable
    lazy
    v-model:selection="selectedServices"
    :rowClass="rowClass"
    :value="services"
    dataKey="service_number"
    tableStyle="min-width: 50rem"
    scrollable
    paginator
    :rows="props.rows"
    @page="onPage($event)"
    :totalRecords="totalRecords"
    @update:selection="onSelectionChanged"
  >
    <Column
      v-if="multiselect"
      style="width: 40px"
      selectionMode="multiple"
    ></Column>
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`service.${column.name}`)"
      :class="column.class"
    >
      <template v-if="column.type === 'detail'" #body="slotProps">
        <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
      </template>
      <template v-if="column.type === 'link'" #body="slotProps">
        <router-link
          :to="{
            name: 'serviceDetail',
            params: { id: slotProps.data.service_number },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data.service_number }}</router-link
        >
      </template>
      <template v-if="column.type === 'sla'" #body="slotProps">
        <WMSLATag
          v-if="slotProps.data.sla"
          :sla="slotProps.data.sla"
          :daysForClosing="slotProps.data.days_for_closing"
          :state="slotProps.data.state"
        >
        </WMSLATag>
      </template>
      <template v-if="column.type === 'priority'" #body="slotProps">
        <div
          :class="priorityClass(slotProps.data)"
          v-if="slotProps.data.status == 'open'"
        >
          {{ slotProps.data.priority }}
        </div>
      </template>
      <template v-if="column.type === 'translate'" #body="slotProps">
        {{ $t(slotProps.data[column.name]) }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

const { t, locale } = useI18n();
const i18n = useI18n();

const services = ref([]);
const selectedServices = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const searchValue = ref("");
const lazyParams = ref({});
const totalRecords = ref(0);

const utilsStore = useUtilsStore();

const props = defineProps({
  // services: Array,
  rows: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array,
    required: true,
  },
  multiselect: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    default: null,
  },
  relatedEntityId: {
    type: String,
    default: null,
  },
});

onMounted(() => {
  loadLazyData();
});

const { getServicesFromApi } = useServices();

const loadLazyData = async () => {
  const filters = utilsStore.filters["service"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = props.rows;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  if (props.relatedEntity == "customer") {
    params.append("customer_id", props.relatedEntityId);
  }
  if (props.relatedEntity == "contact") {
    params.append("contact_id", props.relatedEntityId);
  }

  getServicesFromApi(params).then((result) => {
    services.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const { getSelectFilterButtonValues, getPriorityConditionalStyle } =
  useListUtils();

const options = ref();
options.value = getSelectFilterButtonValues("service.services", i18n);

watch(locale, () => {
  options.value = getSelectFilterButtonValues("service.services", i18n);
});

const rowClass = (data) => {
  return [{ inactive_row: !data.is_active }];
};

const priorityClass = (data) => {
  return getPriorityConditionalStyle(data);
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["service"] = selectedServices.value;
};

// first sidebar
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

const menuItems = [
  { label: "Whatsapp", value: "option1" },
  { label: "SMS", value: "option2" },
];

const isFilterVisible = ref(false);

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}
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
