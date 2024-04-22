<template>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignCustomerButton @add-customers="addCustomers" />
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
    v-model:filters="filters"
    v-model:selection="selectedCustomers"
    lazy
    :value="customers"
    data-key="id"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="rows"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
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
      <template #body="slotProps">
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.name] }}
        </template>

        <template v-if="column.type === 'status'">
          <Dropdown
            v-if="createMode[slotProps.index] || editMode[slotProps.index]"
            v-model="slotProps.data.customer_project_status"
            :options="optionSets[column.optionSet]"
            :option-label="optionLabelWithLang"
            class="w-full p-0"
          >
          </Dropdown>
          <div v-else>
            <WMOptionSetValue
              v-if="slotProps.data.customer_project_status"
              :option-set="slotProps.data.customer_project_status"
            />
          </div>
        </template>

        <template v-if="column.type === 'refusal_to_win'">
          <Checkbox
            v-if="editMode[slotProps.index]"
            v-model="slotProps.data.offer_refusal_to_win"
            :binary="true"
          />

          <img
            v-if="
              !editMode[slotProps.index] && slotProps.data.offer_refusal_to_win
            "
            src="/icons/refusal_to_win_check.svg"
            alt=""
            class="vertical-align-middle"
          />
        </template>

        <template v-if="column.type === 'qualified_second'">
          <Checkbox
            v-if="editMode[slotProps.index]"
            v-model="slotProps.data.offer_second"
            :binary="true"
          />

          <img
            v-if="!editMode[slotProps.index] && slotProps.data.offer_second"
            src="/icons/offer_second.svg"
            alt=""
            class="vertical-align-middle"
          />
        </template>

        <template v-if="column.type === 'offer_amount'">
          <input
            v-if="editMode[slotProps.index] || createMode[slotProps.index]"
            v-model="slotProps.data.offer_amount"
            class="w-full p-0"
          />
          <div v-else>
            {{ slotProps.data.offer_amount }}
          </div>
        </template>

        <template v-if="column.type === 'date'">
          <WMInput
            v-if="editMode[slotProps.index] || createMode[slotProps.index]"
            :id="column.name + slotProps.index"
            v-model="slotProps.data[column.name]"
            type="date"
            :name="column.name + slotProps.index"
            :value="parseDate(slotProps.data[column.name])"
          />

          <span v-else-if="slotProps.data[column.name]">
            {{ formatDate(slotProps.data[column.name]) }}
          </span>
        </template>

        <template v-if="column.type === 'actions'">
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
              v-if="
                column.buttons?.includes('edit') && editMode[slotProps.index]
              "
              name="save"
              icon="save"
              class="in_table"
              @click="editRow(slotProps.data, slotProps.index)"
            />

            <WMButton
              v-if="column.buttons?.includes('unlink')"
              name="unlink"
              icon="unlink"
              @click="handleUnlinkProjectCustomer(slotProps.data)"
            />
          </div>
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const toast = useToast();

const {
  getProjectCustomers,
  createProjectCustomer,
  deleteProjectCustomer,
  parseProjectCustomer,
  updateProjectCustomer,
  mapProjectCustomer,
} = useProjects();

const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();

const { getAlertCellConditionalStyle } = useListUtils();

// INJECT

// PROPS, EMITS
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

// REFS
const selectedCustomers = ref(null);
const utilsStore = useUtilsStore();
const totalRecords = ref(0);
const searchValue = ref("");

const customers = ref([]);
const lazyParams = ref({});

const editMode = ref([]);
const createMode = ref([]);

const isFilterVisible = ref(false);

// const isFilterOpen = ref(false);
// const isFilterApplied = ref(false);
// const selectedOption = ref(1);
// const formUtilsStore = useFormUtilsStore();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const parseDate = (date) => {
  if (!date) return null;

  // check if date is an object
  if (typeof date === "object") {
    return date;
  }

  if (date.includes("-")) {
    const dateParts = date.split("-");
    return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
  }

  return date;
};

function formatDate(dateString) {
  var date = new Date(dateString);

  var dia = date.getDate();
  var mes = date.getMonth() + 1; // months are zero based
  var año = date.getFullYear();

  // add zeros to the left if necessary
  dia = dia < 10 ? "0" + dia : dia;
  mes = mes < 10 ? "0" + mes : mes;

  // return formatted date as DD/MM/YYYY
  var dateFormateada = dia + "/" + mes + "/" + año;

  return dateFormateada;
}

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
    customers.value = result.data.map((customer) =>
      mapProjectCustomer(customer)
    );
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

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

const addCustomers = (addedCustomers) => {
  addedCustomers.forEach((customer) => {
    if (customers.value.find((c) => c.customer_id === customer.id)) return;

    const newCustomer = {
      ...customer,
      customer_name: customer.name,
      customer_project_status: {
        id: 1912,
        value: "waiting",
        value_en: "Waiting",
        value_he: "מחכה",
      },
    };

    customers.value.push(newCustomer);
    createMode.value[customers.value.length - 1] = true;
  });
};

const saveRow = (customer) => {
  const newCustomer = {
    ...customer,
    customer_id: customer.id,
    customer_project_status: customer.customer_project_status,
  };

  const parsedProjectCustomer = parseProjectCustomer(
    newCustomer,
    props.serviceArea.id
  );

  createProjectCustomer(props.projectId, parsedProjectCustomer)
    .then(() => {
      toast.success({ message: "Project customer successfully updated" });
    })
    .catch(() => {
      toast.error("Project customer assign failed");
    });
};

const editRow = (customer, index) => {
  const parsedProjectCustomer = parseProjectCustomer(
    customer,
    props.serviceArea.id
  );

  updateProjectCustomer(props.projectId, parsedProjectCustomer)
    .then(() => {
      toast.success({ message: "Project customer successfully updated" });
      editMode.value[index] = false;
      // loadLazyData();
    })
    .catch(() => {
      toast.error("Project customer assign failed");
    });
};

const handleUnlinkProjectCustomer = (row) => {
  let customerId = row.customer_id;

  deleteProjectCustomer(props.projectId, customerId, props.serviceArea.id)
    .then(() => {
      customers.value = customers.value.filter((c) => c.id !== customerId);
      toast.success({ message: "Project customer successfully unlinked" });
      loadLazyData();
    })
    .catch(() => {
      toast.error("Project customer unlink failed");
    });
};

// PROVIDE, EXPOSE

// WATCHERS
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadOptionSets();
  loadLazyData();
});

const optionSets = ref([]);

const loadOptionSets = async () => {
  //for each option set in columns, get the option set values
  props.columns.forEach(async (column) => {
    console.log(column.optionSet);
    if (column.optionSet) {
      optionSets.value[column.optionSet] =
        await optionSetsStore.getOptionSetValues(column.optionSet);
    }
  });

  console.log(optionSets.value);
};
</script>
