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
        <WMAssignButton entity="service" />
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
          >{{ t("filter") }}
        </WMButton>
        <SelectButton
          v-model="selectedOption"
          :options="options"
          optionLabel="name"
          class="flex flex-nowrap"
        />
      </div>
    </div>
    <div>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText
          class="w-30rem"
          v-model="filters['global'].value"
          :placeholder="$t('search')"
        />
      </span>
    </div>
  </div>
  <DataTable
    v-model:filters="filters"
    v-model:selection="selectedServices"
    :rowClass="rowClass"
    :value="services"
    dataKey="service_number"
    tableStyle="min-width: 50rem"
    scrollable
    paginator
    :rows="rows"
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
        <router-link to="/foo" class="vertical-align-middle">{{
          slotProps.data.service_number
        }}</router-link>
      </template>
      <template v-if="column.type === 'sla'" #body="slotProps">
        <div
          v-if="slotProps.data.status == 'open'"
          :class="slaClass(slotProps.data.sla)"
        >
          {{
            slotProps.data.status == "open"
              ? $t("sla.days_left", [slotProps.data.days_for_closing])
              : $t("sla.days_exceeded", [slotProps.data.days_for_closing])
          }}
        </div>
        <div v-else :class="slaClass('not_breached')">
          {{ "עמד ביעד" }}
        </div>
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
import { defineProps, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { FilterMatchMode } from "primevue/api";
import { useListUtilsStore } from "@/stores/listUtils";
import { useUtilsStore } from "@/stores/utils";

const { t, locale } = useI18n();
const i18n = useI18n();

const selectedServices = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const listUtilsStore = useListUtilsStore();
const utilsStore = useUtilsStore();

const props = defineProps({
  services: Array,
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
});

const options = ref();
options.value = listUtilsStore.getSelectFilterButtonValues(
  "service.services",
  i18n
);

watch(locale, () => {
  options.value = listUtilsStore.getSelectFilterButtonValues(
    "service.services",
    i18n
  );
});

const rowClass = (data) => {
  return [{ inactive_row: !data.is_active }];
};

const slaClass = (data) => {
  return listUtilsStore.getSlaConditionalStyle(data);
};

const priorityClass = (data) => {
  return listUtilsStore.getPriorityConditionalStyle(data);
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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const menuItems = [
  { label: "Whatsapp", value: "option1" },
  { label: "SMS", value: "option2" },
];
</script>
