<template>
  <h2 class="h2">
    {{ $t("customer.customer") }}
  </h2>
  <div v-if="showControls" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignCustomerButton @addCustomers="addCustomers" />
        <WMAssignOwnerButton entity="customer" />
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
          name="filterCustomer"
        >
          <WMFilterForm entity="customer" filterFormName="customer" />
        </WMSidebar>
        <WMOwnerToggle entity="customer" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="customer" />
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
          v-if="slotProps.data.main_contact?.id == contactId"
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
          >
            <WMOptionSetValue :optionSet="item" />
          </Tag>
        </div>
      </template>
      <template v-if="column.type === 'actions'" #body="slotProps">
        <div class="flex flex-row gap-2">
          <WMButton
            name="unlink"
            icon="unlink"
            @click="unlinkCustomer(slotProps.data.id)"
          />
        </div>
      </template>
      <template v-if="column.type === 'role'" #body="slotProps">
        {{ slotProps.data.role.value }}
      </template>
      <template v-if="column.type === 'option-set'" #body="slotProps">
        {{ $t(slotProps.data[column.name].value) }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch, watchEffect, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { FilterMatchMode } from "primevue/api";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

import { useUtilsStore } from "@/stores/utils";

const { t } = useI18n();
const toast = useToast();

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

const editMode = ref([]);

const addCustomers = (addedCustomers) => {
  addedCustomers.forEach((customer) => {
    if (customers.value.find((c) => c.customer_id === customer.id)) return;

    customer.main = false;
    // customers.value.push(customer);
    saveRow(customer);
    editMode.value[customers.value.length - 1] = true;
  });
};

const { unassignContactFromCustomer, assignContactToCustomer } = useCustomers();

const defaultRole = computed(() => {
  return optionSetsStore.optionSets["contact_customer_role"].find(
    (role) => role.value === "employee"
  );
});

const saveRow = (customer) => {
  const contactParams = {
    contact_id: props.contactId,
    role: defaultRole.value.id,
  };

  console.log("defaultRole", defaultRole.value);
  console.log("contactParams", contactParams);

  assignContactToCustomer(customer.id, contactParams)
    .then(() => {
      loadLazyData();
      toast.success("Contact successfully linked");
    })
    .catch(() => {
      toast.error("Contact link failed");
    });
};

const unlinkCustomer = (customerId) => {
  unassignContactFromCustomer(customerId, props.contactId)
    .then(() => {
      loadLazyData();
      toast.success("Contact Successfully unlinked");
    })
    .catch(() => {
      toast.error("Contact unlink Failed");
    });
};

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
