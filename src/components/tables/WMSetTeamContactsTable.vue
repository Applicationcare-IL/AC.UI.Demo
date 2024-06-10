<template>
  <WMAssignContactButton :options="['contacts', 'teams']" @add-contacts="addContacts" />
  <DataTable
    v-model:selection="selectedContacts"
    lazy
    :value="contacts"
    data-key="contact_id"
    table-style="min-width: 50rem"
    scrollable
    :rows="props.rows"
    :total-records="totalRecords"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`contact.${column.name}`)"
      :class="column.class"
    >
      <template v-if="column.type === 'link'" #body="slotProps">
        <router-link
          :to="'/' + column.to + '/' + slotProps.data[column.linkParameter]"
          class="vertical-align-middle"
          >{{ slotProps.data[column.name] }}</router-link
        >
      </template>

      <template v-if="column.type === 'customers'" #body="slotProps">
        <Dropdown
          v-model="slotProps.data.customer"
          :options="slotProps.data.customers"
          option-label="name"
          class="w-full p-0"
        />
      </template>

      <template v-if="column.type === 'role_project'" #body="slotProps">
        <Dropdown
          v-model="slotProps.data.role_project"
          :options="optionSets[column.optionSet]"
          :option-label="optionLabelWithLang"
          option-value="id"
          class="w-full p-0"
        />
      </template>
      <template v-if="column.type === 'actions'" #body="slotProps">
        <div class="flex flex-row gap-2">
          <WMUnlinkButtonIconOnly
            v-if="column.buttons?.includes('unlink')"
            @click="unlinkContact(slotProps.data.contact_id)"
          />
        </div>
      </template>
      <template v-if="column.type === 'alert'" #body="slotProps">
        <div :class="alertCellConditionalStyle(slotProps.data[column.name])">
          {{ slotProps.data[column.name] }}
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

const selectedContacts = ref(null);

const utilsStore = useUtilsStore();
const totalRecords = ref(0);
const optionSetsStore = useOptionSetsStore();

const emit = defineEmits([
  "update:role",
  "unlink",
  "update:mainContact",
  "change:selectedContacts",
]);

const { optionLabelWithLang } = useLanguages();

const props = defineProps({
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
    default: true,
  },

  customerId: {
    type: String,
    default: null,
  },
  projectId: {
    type: String,
    default: null,
  },
  contacts: {
    type: Array,
    default: null,
  },
  relatedEntity: {
    type: String,
    default: "customer",
  },
});

onMounted(() => {
  loadOptionSets();
  totalRecords.value = props.contacts?.length;
});

const optionSets = ref([]);

const contacts = ref(props.contacts);

const loadOptionSets = async () => {
  //for each option set in columns, get the option set values
  props.columns.forEach(async (column) => {
    if (column.optionSet) {
      optionSets.value[column.optionSet] = await optionSetsStore.getOptionSetValues(
        column.optionSet
      );
    }
  });
};

const { getAlertCellConditionalStyle } = useListUtils();

const customer = ref();
const searchValue = ref("");

const lazyParams = ref({});

const { getContactsFromApi } = useContacts();

const { getCustomerFromApi, getCustomersFromApi } = useCustomers();

const loadLazyData = () => {
  const filters = utilsStore.filters["contact"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = props.rows;
  const customerParam = props.customerId;
  const projectIdParam = props.projectId;

  const paramOptions = {
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  };

  // paramOptions.customer_id = 1075;
  if (customerParam) paramOptions.customer_id = customerParam;
  if (projectIdParam) paramOptions.project_id = projectIdParam;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams(paramOptions);

  getContactsFromApi(params).then((result) => {
    totalRecords.value = result.totalRecords;
  });

  if (customerParam) {
    getCustomerFromApi(props.customerId).then((data) => {
      customer.value = data;
    });
  }
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const defaultRole = computed(() => {
  return optionSets.value["contact_project_role"][0];
});

const addContacts = (addedContacts) => {
  addedContacts.forEach(async (contact) => {
    contact.role_project = defaultRole.value.id;
    contact.main = false;
    contact.customers = await getAvailableCustomersOfContact(contact);
    contact.customer = await getCustomerInfoFromAvailableCustomers(
      contact.customer,
      contact.customers
    );

    contacts.value.push(contact);
  });
};

const getAvailableCustomersOfContact = async (contact) => {
  const customers = await getCustomersFromApi({ contact_id: contact.id });
  return customers.data;
};

const getCustomerInfoFromAvailableCustomers = async (customer, customers) => {
  if (!customer) {
    return customers[0];
  }

  return customers.find((c) => c.id === customer.id);
};

const alertCellConditionalStyle = (data) => {
  return getAlertCellConditionalStyle(data);
};

const unlinkContact = (contactId) => {
  emit("unlink", contactId);

  contacts.value = contacts.value.filter((contact) => {
    return contact.contact_id !== contactId;
  });
  return;
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["contact"] = selectedContacts.value;
};

watch(
  () => utilsStore.searchString["contact"],
  () => {
    searchValue.value = utilsStore.searchString["contact"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

watch(
  () => contacts.value,
  () => {
    emit("change:selectedContacts", contacts.value);
  },
  { deep: true }
);
</script>
