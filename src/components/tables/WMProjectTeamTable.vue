<template>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignContactButton
          v-if="!props.readOnly"
          :options="['contacts', 'teams']"
          @add-contacts="addContacts"
        />
      </div>
      <WMTablePaginator
        :total-records="totalRecords"
        :current-page="currentPage"
        :current-offset="datatableOffset"
        @update:rows="handleNumberOfRowsPerPage"
      />
    </div>
  </div>

  <DataTable
    v-model:selection="selectedContacts"
    lazy
    :value="contacts"
    data-key="contact_id"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="rowsPerPage"
    :total-records="totalRecords"
    class="w-full"
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
      <template #body="slotProps">
        <template v-if="column.type === 'text'">
          <InputText
            v-if="column.editable && editMode[slotProps.index]"
            v-model="slotProps.data[column.name]"
          />
          <span v-else>
            <template v-if="column.optionSet">
              <WMOptionSetValue :option-set="slotProps.data[column.name]" />
            </template>
            <template v-else>{{ slotProps.data[column.name] }}</template>
          </span>
        </template>
        <template v-if="column.type === 'link'">
          <router-link
            :to="'/' + column.to + '/' + slotProps.data[column.linkParameter]"
            class="vertical-align-middle"
            >{{ slotProps.data[column.name] }}</router-link
          >
        </template>

        <template v-if="column.type === 'role'">
          <Dropdown
            v-if="editMode[slotProps.index]"
            v-model="slotProps.data.role"
            :options="optionSets[column.optionSet]"
            :option-label="optionLabelWithLang"
            class="w-full p-0"
          />
          <div v-else>
            <WMOptionSetValue :option-set="slotProps.data.role" />
          </div>
        </template>
        <template v-if="column.type === 'customers'">
          <Dropdown
            v-if="editMode[slotProps.index]"
            v-model="slotProps.data.customer"
            :options="slotProps.data.customers"
            option-label="name"
            class="w-full p-0"
          />
          <div v-else>
            {{ slotProps.data.customer?.name }}
          </div>
        </template>
        <template v-if="column.type === 'role_project'">
          <Dropdown
            v-if="editMode[slotProps.index]"
            v-model="slotProps.data.role_project"
            :options="optionSets[column.optionSet]"
            :option-label="optionLabelWithLang"
            class="w-full p-0"
          />
          <div v-else>
            <WMOptionSetValue :option-set="slotProps.data.role_project" />
          </div>
        </template>
        <template v-if="column.type === 'actions'">
          <div class="flex flex-row gap-2">
            <WMButton
              v-if="column.buttons?.includes('edit') && !editMode[slotProps.index]"
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
              @click="unlinkContact(slotProps.data)"
            />
          </div>
        </template>
        <template v-if="column.type === 'alert'">
          <div :class="alertCellConditionalStyle(slotProps.data[column.name])">
            {{ slotProps.data[column.name] }}
          </div>
        </template>
        <template v-if="column.type === 'attachment'">
          <WMUploadAttachmentButton
            entity="project-team"
            :entity-id="slotProps.data.id"
            file-name="contract"
            :has-file="slotProps.data.contract"
            :download-url="slotProps.data.contract?.download_url"
            :disabled="props.readOnly"
          />
        </template>
        <template v-if="column.type === 'currency'">
          <WMInputCurrency
            v-if="column.editable && editMode[slotProps.index]"
            v-model="slotProps.data[column.name]"
            :read-only="false"
            :name="column.name"
          />
          <WMInputCurrency
            v-else
            v-model="slotProps.data[column.name]"
            :read-only="true"
            :name="column.name"
          />
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, unref, watch, watchEffect } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const toast = useToast();
const utilsStore = useUtilsStore();
const optionSetsStore = useOptionSetsStore();
const { optionLabelWithLang } = useLanguages();
const { getAlertCellConditionalStyle } = useListUtils();
const { getCustomersFromApi } = useCustomers();

const {
  getProjectTeam,
  assignContactToProject,
  unassignContactFromProject,
  updateTeamMember,
} = useProjects();

// PROPS, EMITS
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:role",
  "unlink",
  "update:mainContact",
  "change:selectedContacts",
  "closeDialog",
]);

// REFS
const selectedContacts = ref(null);
// const isFilterOpen = ref(false);
// const isFilterApplied = ref(false);
const editMode = ref([]);
const contacts = ref([]);
const searchValue = ref(props.searchValue);
const lazyParams = ref({});

const totalRecords = ref(0);
const rowsPerPage = ref(10);
const currentPage = ref(1);
const datatableOffset = ref(0);

// COMPUTED
// If the source of data is external, we don't need to load the
// data from the API and the functions are dealt internally
const isSourceExternal = computed(() => {
  return props.contacts != null;
});

// COMPONENT METHODS AND LOGIC
const loadLazyData = () => {
  // const filters = utilsStore.filters["contact"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;

  const paramOptions = {
    per_page: rowsPerPage.value,
  };

  if (nextPage && nextPage > 1) {
    paramOptions.page = nextPage;
  }

  if (searchValueParam) {
    paramOptions.search = searchValueParam;
  }

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams(paramOptions);

  getProjectTeam(props.projectId, params).then((response) => {
    if (!response.contacts) return;

    contacts.value = response.contacts;
    totalRecords.value = response.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const handleNumberOfRowsPerPage = (numberOfRowsPerPage) => {
  currentPage.value = 1;
  datatableOffset.value = 0;
  rowsPerPage.value = numberOfRowsPerPage;
  loadLazyData();
};

const addContacts = (addedContacts) => {
  addedContacts.forEach(async (contact) => {
    contact.role_project = getDefaultRole();
    contact.main = false;
    contact.contact_name = contact.name;
    contact.state = "not-saved";
    contact.contact_id = contact.id;
    contact.customers = await getAvailableCustomersOfContact(contact);
    contact.customer = await getCustomerInfoFromAvailableCustomers(
      contact.customer,
      contact.customers
    );

    contacts.value.push(contact);
    editMode.value[contacts.value.length - 1] = true;
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

const unlinkContact = (contact) => {
  if (contact.state === "not-saved") {
    contacts.value = contacts.value.filter((c) => c.contact_id !== contact.contact_id);
    return;
  }

  const params = {
    project_id: parseInt(props.projectId),
    contact_id: contact.contact_id,
    role_id: contact.role_project?.id,
    customer_id: contact.customer.id,
  };

  unassignContactFromProject(params)
    .then(() => {
      contacts.value = contacts.value.filter((c) => c.contact_id !== contact.contact_id);
      toast.success({ message: "Contact Successfully unlinked" });
    })
    .catch(() => {
      toast.error("Contact unlink Failed");
    });
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["contact"] = selectedContacts.value;
};

const saveRow = (contact) => {
  const projectId = parseInt(props.projectId);
  const teamMemberId = contact.id;

  const contactParams = {
    project: projectId,
    contact: teamMemberId,
    role: contact.role_project?.id,
    customer: contact.customer.id,
    contract_number: contact.contract_number ? contact.contract_number : 0,
    contract_amount: contact.contract_amount ? contact.contract_amount : 0,
  };

  if (contact.state === "not-saved") {
    assignContactToProject(contactParams)
      .then((response) => {
        updateTeamMember(projectId, response.data.id, contactParams);
        toast.success({ message: "Contact Successfully updated" });
      })
      .catch(() => {
        toast.error("Contact assign Failed");
      });
  } else {
    updateTeamMember(projectId, teamMemberId, contactParams)
      .then(() => {
        toast.success({ message: "Contact Successfully updated" });
      })
      .catch(() => {
        toast.error("Contact update Failed");
      });
  }
};

// function closeFilterSidebar() {
//   isFilterVisible.value = false;
// }

// function openFilterSidebar() {
//   isFilterVisible.value = true;
// }

const getDefaultRole = () => {
  return unref(optionSets.value["contact_project_role"][0]);
};

// WATCHERS
watch(
  props.contacts,
  (newValue) => {
    if (isSourceExternal.value && newValue && contacts) {
      contacts.value = newValue;
    }

    if (!isSourceExternal.value || !newValue) {
      return;
    }

    editMode.value[props.contacts.length - 1] = true;
  },
  { deep: true }
);

watchEffect(() => {
  if (isSourceExternal.value) return;

  loadLazyData();
});

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
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadOptionSets();
  if (isSourceExternal.value) {
    contacts.value = props.contacts;
    totalRecords.value = props.contacts?.length;
  } else {
    loadLazyData();
  }
});

const optionSets = ref([]);

const loadOptionSets = async () => {
  props.columns.forEach(async (column) => {
    if (column.optionSet) {
      optionSets.value[column.optionSet] = await optionSetsStore.getOptionSetValues(
        column.optionSet
      );
    }
  });
};
</script>
