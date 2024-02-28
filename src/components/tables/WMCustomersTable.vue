<template>
  <h2 class="h2">
    {{ $t("customer.customer") }}
  </h2>
  <div v-if="showControls" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignCustomerButton @add-customers="addCustomers" />
        <WMAssignOwnerButton
          v-if="can('customers.assign')"
          entity="customer"
          @owner-assigned="
            loadLazyData();
            clearSelectedCustomers();
          "
        />
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
          name="filterCustomer"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
        >
          <WMFilterForm entity="customer" filter-form-name="customer" />
        </WMSidebar>
        <WMOwnerToggle entity="customer" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="customer" />
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
    <Column
      v-if="multiselect"
      style="width: 40px"
      selection-mode="multiple"
    ></Column>
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="
        column.header ? $t(column.header) : $t(`customer.${column.name}`)
      "
      :class="column.class"
      :frozen="column.type === 'actions'"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'alert'">
          <div :class="alertCellConditionalStyle(slotProps.data[column.name])">
            {{ slotProps.data[column.name] }}
          </div>
        </template>
        <template v-if="column.type === 'link'">
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
        <template v-if="column.type === 'star'">
          <div
            @click="
              editMode[slotProps.index] && onStarClicked(slotProps.data.id)
            "
          >
            <img
              v-if="isMainContact(slotProps.data)"
              src="/icons/star.svg"
              alt=""
              class="vertical-align-middle"
            />
            <img
              v-if="editMode[slotProps.index] && !isMainContact(slotProps.data)"
              src="/icons/star_grey.svg"
              alt=""
              class="vertical-align-middle"
            />
          </div>
        </template>
        <template v-if="column.type === 'tags'">
          <div class="w-15rem">
            <div class="flex flex-row gap-2 overflow-x-auto">
              <Tag
                v-for="(item, index) in slotProps.data[column.name]"
                :key="index"
                class="vertical-align-middle"
              >
                <WMOptionSetValue :option-set="item" />
              </Tag>
            </div>
          </div>
        </template>
        <template v-if="column.type === 'actions'">
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
              v-if="
                column.buttons?.includes('edit') && editMode[slotProps.index]
              "
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
              @click="unlinkCustomer(slotProps.data.id)"
            />
          </div>
        </template>
        <template v-if="column.type === 'role'">
          <Dropdown
            v-if="editMode[slotProps.index]"
            v-model="slotProps.data.role"
            :options="optionSetsStore.optionSets[column.optionSet]"
            :option-label="optionLabelWithLang"
            class="w-full p-0"
          />
          <div v-else>
            <WMOptionSetValue :option-set="slotProps.data.role" />
          </div>
        </template>
        <template v-if="column.type === 'option-set'">
          <WMOptionSetValue :option-set="slotProps.data[column.name]" />
        </template>
        <template v-if="column.type === 'owner'">
          {{ slotProps.data.owner.name }}
        </template>
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.name] }}
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { can } = usePermissions();

const { t } = useI18n();
const toast = useToast();
const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();
const {
  getCustomersFromApi,
  unassignContactFromCustomer,
  assignContactToCustomer,
} = useCustomers();
const { getAlertCellConditionalStyle } = useListUtils();
const { optionLabelWithLang } = useLanguages();

// PROPS, EMITS
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
  relatedEntity: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:mainContact"]);

// REFS
const selectedCustomers = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const totalRecords = ref(0);
const searchValue = ref("");
const customers = ref([]);
const lazyParams = ref({});
const isFilterVisible = ref(false);
const editMode = ref([]);

// COMPUTED
const defaultRole = computed(() => {
  return optionSetsStore.optionSets["contact_customer_role"][0];
});

// COMPONENT METHODS
const clearSelectedCustomers = () => {
  selectedCustomers.value = [];
};

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

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

const addCustomers = (addedCustomers) => {
  addedCustomers.forEach((customer) => {
    if (customers.value.find((c) => c.customer_id === customer.id)) return;

    customer.main = false;
    customer.role = defaultRole.value;
    customers.value.push(customer);
    editMode.value[customers.value.length - 1] = true;
  });
};

const saveRow = (customer) => {
  const contactParams = {
    contact_id: props.contactId,
    role: customer.role.id,
  };

  assignContactToCustomer(customer.id, contactParams)
    .then(() => {
      // loadLazyData();
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

const isMainContact = (customer) => {
  return customer.main_contact?.id == props.contactId;
};

const onStarClicked = (customerId) => {
  emit("update:mainContact", props.contactId);

  if (props.relatedEntity === "contact") {
    const contactParams = {
      contact_id: props.contactId,
      main: true,
      role: defaultRole.value.id,
    };

    assignContactToCustomer(customerId, contactParams)
      .then(() => {
        toast.success("Contact successfully marked as main contact");
        // loadLazyData();
      })
      .catch(() => {});
  }
};

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
  loadLazyData();
});
</script>
