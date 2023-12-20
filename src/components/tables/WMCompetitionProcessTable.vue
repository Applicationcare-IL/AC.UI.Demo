<template>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignCustomerButton @addCustomers="addCustomers" />

        <!-- <WMButton class="m-1 col-6" name="export-white" icon="export">
          {{ $t("export") }}
        </WMButton> -->
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="customer" />
      <!-- <WMButton
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
        name="filterCustomer"
      >
        <WMFilterForm entity="customer" filterFormName="customer" />
      </WMSidebar> -->
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
    :class="`p-datatable-${tableClass}`"
  >
    <Column style="width: 35px">
      <template #body="slotProps">
        <img
          @click="console.log('preview customer')"
          src="/icons/eye.svg"
          alt=""
          class="vertical-align-middle"
        />
      </template>
    </Column>
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
      <template v-if="column.type === 'text'" #body="slotProps">
        {{ slotProps.data[column.name] }}
      </template>

      <template v-if="column.type === 'actions'" #body="slotProps">
        <div class="flex flex-row gap-2">
          <WMButton
            v-if="
              column.buttons?.includes('edit') && !editMode[slotProps.index]
            "
            name="edit"
            icon="edit"
            @click="editMode[slotProps.index] = true"
          />
          <WMButton
            v-if="column.buttons?.includes('edit') && editMode[slotProps.index]"
            name="save"
            icon="save"
            class="in_table"
            @click="
              saveRow(slotProps.data);
              editMode[slotProps.index] = false;
            "
          />
          <WMButton
            v-if="column.buttons?.includes('unlink')"
            name="unlink"
            icon="unlink"
            @click=""
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useFormUtilsStore } from "@/stores/formUtils";

import { useUtilsStore } from "@/stores/utils";

const { t } = useI18n();

const selectedCustomers = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const totalRecords = ref(0);
const searchValue = ref("");

const { getCustomersFromApi } = useCustomers();

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
  contactId: {
    type: Object,
    default: null,
  },
  tableClass: {
    type: String,
    default: "",
  },
});

onMounted(() => {
  loadLazyData();
});

const { getAlertCellConditionalStyle } = useListUtils();

const customers = ref([]);
const lazyParams = ref({});

const loadLazyData = () => {
  const filters = utilsStore.filters["customer"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = props.rows;
  const contactParam = props.contactId;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
    contact_id: contactParam,
  });

  getCustomersFromApi(params).then((result) => {
    customers.value = fakeData();
    totalRecords.value = result.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const alertCellConditionalStyle = (data) => {
  return getAlertCellConditionalStyle(data);
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["customer"] = selectedCustomers.value;
};

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
  () => utilsStore.searchString["customer"],
  () => {
    searchValue.value = utilsStore.searchString["customer"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

const addCustomers = (customers) => {};

const editMode = ref([]);

const fakeData = () => [
  {
    file: true,
    notes: "משהו חשוב שכולל מילים שכתבו על הארגון ",
    refusal_to_win: "",
    qualified_second: "",
    status: "התקבלה הצעה",
    offer_amount: "30,000.00",
    offer_received: "11/12/23",
    offer_requested: "11/12/23",
    organization: {
      id: 1,
      name: "א.א. בוני הדרום",
    },
  },
  {
    file: true,
    notes: "משהו חשוב שכולל מילים שכתבו על הארגון ",
    refusal_to_win: "",
    qualified_second: "",
    status: "התקבלה הצעה",
    offer_amount: "30,000.00",
    offer_received: "11/12/23",
    offer_requested: "11/12/23",
    organization: {
      id: 1,
      name: "א.א. בוני הדרום",
    },
  },
  {
    file: true,
    notes: "משהו חשוב שכולל מילים שכתבו על הארגון ",
    refusal_to_win: "",
    qualified_second: "",
    status: "התקבלה הצעה",
    offer_amount: "30,000.00",
    offer_received: "11/12/23",
    offer_requested: "11/12/23",
    organization: {
      id: 1,
      name: "א.א. בוני הדרום",
    },
  },
];
</script>
