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
      <!-- <WMSearchBox entity="customer" /> -->
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
    <!-- <Column style="width: 35px">
      <template #body="slotProps">
        <img
          @click="console.log('preview customer')"
          src="/icons/eye.svg"
          alt=""
          class="vertical-align-middle"
        />
      </template>
    </Column> -->
    <!-- <Column
      v-if="multiselect"
      style="width: 40px"
      selectionMode="multiple"
    ></Column> -->
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="
        column.header ? $t(column.header) : $t(`organization.${column.name}`)
      "
      :class="column.class"
    >
      <template v-if="column.type === 'text'" #body="slotProps">
        {{ slotProps.data[column.name] }}
      </template>

      <template v-if="column.type === 'status'" #body="slotProps">
        <Dropdown
          v-if="createMode[slotProps.index] || editMode[slotProps.index]"
          :options="optionSetsStore.optionSets[column.optionSet]"
          :optionLabel="optionLabelWithLang"
          optionValue="id"
          class="w-full p-0"
          v-model="slotProps.data.customer_project_status"
        >
        </Dropdown>
        <div v-else>
          <WMOptionSetValue
            v-if="slotProps.data.customer_project_status"
            :optionSet="slotProps.data.customer_project_status"
          />
        </div>
      </template>

      <template v-if="column.type === 'refusal_to_win'" #body="slotProps">
        {{ slotProps.data[column.name] }}
        <Checkbox
          v-if="editMode[slotProps.index]"
          v-model="slotProps.data[column.name]"
          :binary="true"
        />
      </template>

      <template v-if="column.type === 'qualified_second'" #body="slotProps">
        <Checkbox
          v-if="editMode[slotProps.index]"
          v-model="slotProps.data[column.name]"
          :binary="true"
        />
      </template>

      <template v-if="column.type === 'offer_amount'" #body="slotProps">
        <input
          class="w-full p-0"
          v-if="editMode[slotProps.index] || createMode[slotProps.index]"
          v-model="slotProps.data.offer_amount"
        />
        <div v-else>
          {{ slotProps.data.offer_amount }}
        </div>
      </template>

      <template v-if="column.type === 'date'" #body="slotProps">
        <span v-if="slotProps.data[column.name]">
          {{ slotProps.data[column.name] }}
        </span>
        <WMInput
          v-else-if="editMode[slotProps.index] || createMode[slotProps.index]"
          type="date"
          :id="column.name"
          :name="column.name"
        />
      </template>

      <template v-if="column.type === 'actions'" #body="slotProps">
        <div class="flex flex-row gap-2">
          <WMButton
            v-if="
              column.buttons?.includes('edit') &&
              !editMode[slotProps.index] &&
              !createMode[slotProps.index]
            "
            name="edit"
            icon="edit"
            @click="editMode[slotProps.index] = true"
          />

          <WMButton
            v-if="
              column.buttons?.includes('edit') && createMode[slotProps.index]
            "
            name="save"
            icon="save"
            class="in_table"
            @click="
              saveRow(slotProps.data);
              createMode[slotProps.index] = false;
            "
          />

          <WMButton
            v-if="column.buttons?.includes('edit') && editMode[slotProps.index]"
            name="save"
            icon="save"
            class="in_table"
            @click="
              editRow(slotProps.data);
              editMode[slotProps.index] = false;
            "
          />

          <WMButton
            v-if="column.buttons?.includes('unlink')"
            name="unlink"
            icon="unlink"
            @click="handleUnlinkProjectCustomer(slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";

import { useFormUtilsStore } from "@/stores/formUtils";

import { useUtilsStore } from "@/stores/utils";

const { t } = useI18n();

const {
  getProjectCustomers,
  createProjectCustomer,
  deleteProjectCustomer,
  parseProjectCustomer,
  updateProjectCustomer,
} = useProjects();

const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();

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
    default: 20,
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
  serviceArea: {
    type: Object,
    default: null,
  },
  projectId: {
    type: Number,
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

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
    service_area: props.serviceArea.id,
  });

  getProjectCustomers(props.projectId, params).then((result) => {
    customers.value = result.data;
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

const addCustomers = (addedCustomers) => {
  addedCustomers.forEach((customer) => {
    if (customers.value.find((c) => c.customer_id === customer.id)) return;

    customers.value.push(customer);
    createMode.value[customers.value.length - 1] = true;
  });
};

const toast = useToast();

const saveRow = (customer) => {
  const parsedProjectCustomer = parseProjectCustomer(
    customer,
    props.serviceArea.id
  );

  createProjectCustomer(props.projectId, parsedProjectCustomer)
    .then(() => {
      toast.success("Project customer successfully updated");
    })
    .catch(() => {
      toast.error("Project customer assign failed");
    });
};

const editRow = (customer) => {
  const parsedProjectCustomer = parseProjectCustomer(
    customer,
    props.serviceArea.id
  );

  console.log(customer);
  console.log("parsedProjectCustomer", parsedProjectCustomer);

  updateProjectCustomer(props.projectId, parsedProjectCustomer)
    .then(() => {
      toast.success("Project customer successfully updated");
    })
    .catch(() => {
      toast.error("Project customer assign failed");
    });
};

const handleUnlinkProjectCustomer = (row) => {
  let customerId = row.id;

  deleteProjectCustomer(props.projectId, customerId, props.serviceArea.id)
    .then(() => {
      customers.value = customers.value.filter((c) => c.id !== customerId);
      toast.success("Project customer successfully unlinked");
    })
    .catch(() => {
      toast.error("Project customer unlink failed");
    });
};

const editMode = ref([]);
const createMode = ref([]);

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
