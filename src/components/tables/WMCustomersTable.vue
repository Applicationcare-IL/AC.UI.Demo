<template>
  <WMNewEntitySidebar name="newCustomer" entity="customer" />
  <h2 class="h2">{{ $t("customer.customer") }}</h2>
  <div v-if="showControls" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          @click="formUtilsStore.expandSidebar = 'newCustomer'"
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          >{{ t("new") }}</WMButton
        >
        <WMAssignButton entity="customer" />
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
    lazy
    v-model:filters="filters"
    v-model:selection="selectedCustomers"
    :value="customers"
    dataKey="id"
    tableStyle="min-width: 50rem"
    scrollable
    paginator
    :rows="rows"
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
      :header="
        column.header ? $t(column.header) : $t(`customer.${column.name}`)
      "
      :class="column.class"
    >
      <template v-if="column.type === 'alert'" #body="slotProps">
        <div :class="alertCellConditionalStyle(slotProps.data[column.name])">
          {{ slotProps.data[column.name] }}
        </div>
      </template>
      <template
        v-if="column.type === 'link'"
        #body="slotProps"
        class="link-col"
      >
        <router-link
          :to="{
            name: 'customerDetail',
            params: { id: slotProps.data.id },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data[column.name] }}</router-link
        >
      </template>
      <template v-if="column.type === 'detail'">
        <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
      </template>
      <template v-if="column.type === 'star'" #body="slotProps">
        <img
          v-if="slotProps.data['main_contact']['id'] == contact.id"
          src="/icons/star.svg"
          alt=""
          class="vertical-align-middle"
        />
      </template>
      <template v-if="column.type === 'tags'" #body="slotProps">
        <div class="flex flex-row gap-2">
          <Tag
            v-for="item in slotProps.data[column.name]"
            class="vertical-align-middle"
            >{{ item.value }}</Tag
          >
        </div>
      </template>
      <template v-if="column.type === 'actions'" #body="slotProps">
        <div class="flex flex-row gap-2">
          <WMButton name="edit" icon="edit" />
          <WMButton name="unlink" icon="unlink" />
        </div>
      </template>
      <template v-if="column.type === 'option-set'" #body="slotProps">
        {{ $t(slotProps.data[column.name].value) }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { defineProps, ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { FilterMatchMode } from "primevue/api";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useListUtilsStore } from "@/stores/listUtils";
import { useUtilsStore } from "@/stores/utils";
import { CustomerService } from "@/service/CustomerService";

const i18n = useI18n();

const { t, locale } = useI18n();

const selectedCustomers = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const listUtilsStore = useListUtilsStore();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const totalRecords = ref(0);

const props = defineProps({
  rows: {
    type: Number,
    default: 5,
  },
  columns: {
    type: Array,
    required: true,
  },
  multiselect: {
    type: Boolean,
    default: true,
  },
  showControls: {
    type: Boolean,
    default: true,
  },
  contact: {
    type: Object,
    default: null,
  },
});

onMounted(() => {
  loadLazyData();
});

const options = ref();
options.value = listUtilsStore.getSelectFilterButtonValues(
  "contact.contacts",
  i18n
);

watch(locale, () => {
  options.value = listUtilsStore.getSelectFilterButtonValues(
    "contact.contacts",
    i18n
  );
});

const customers = ref([]);
const lazyParams = ref({});

const loadLazyData = () => {
  CustomerService.getCustomersFromApi({
    page: lazyParams.value.page + 1,
    per_page: props.rows,
    contact_id: props.contact.id,
  }).then((result) => {
    customers.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const alertCellConditionalStyle = (data) => {
  return listUtilsStore.getAlertCellConditionalStyle(data);
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["customer"] = selectedCustomers.value;
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>
