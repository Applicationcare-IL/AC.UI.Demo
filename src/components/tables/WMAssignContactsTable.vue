<template>
  <WMAssignContactButton @add-contacts="addContacts" />

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

      <template v-if="column.type === 'role_project'" #body="slotProps">
        <Dropdown
          v-if="editMode[slotProps.index]"
          v-model="slotProps.data.role_project"
          :options="optionSets[column.optionSet]"
          :option-label="optionLabelWithLang"
          option-value="id"
          class="w-full p-0"
        />
        <div v-else>
          <WMOptionSetValue :option-set="slotProps.data.role_project" />
        </div>
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
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

const { t } = useI18n();

const selectedContacts = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const totalRecords = ref(0);
const optionSetsStore = useOptionSetsStore();
const selectedRole = ref([]);

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

const editMode = ref([]);

// If the source of data is external, we don't need to load the
// data from the API and the functions are dealt internally
const isSourceExternal = computed(() => {
  return props.contacts != null;
});

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
  //for each option set in columns, get the option set values
  props.columns.forEach(async (column) => {
    console.log(column.optionSet);
    if (column.optionSet) {
      optionSets.value[column.optionSet] =
        await optionSetsStore.getOptionSetValues(column.optionSet);
    }
  });
};

const { getAlertCellConditionalStyle } = useListUtils();

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

const contacts = ref([]);
const customer = ref();
const searchValue = ref("");

const lazyParams = ref({});

const { getContactsFromApi } = useContacts();

const {
  getCustomerFromApi,
  assignContactToCustomer,
  unassignContactFromCustomer,
} = useCustomers();

const { assignContactToProject, unassignContactFromProject } = useProjects();

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
    contacts.value = result.data;
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
  if (props.relatedEntity === "customer") {
    return optionSets.value["contact_customer_role"][0];
  }

  if (props.relatedEntity === "project") {
    // set the first role as default
    return optionSets.value["contact_project_role"][0];
  }
});

const addContacts = (addedContacts) => {
  addedContacts.forEach((contact) => {
    if (contacts.value.find((c) => c.contact_id === contact.id)) return;

    if (props.relatedEntity === "customer") {
      contact.role = defaultRole.value;
    }

    if (props.relatedEntity === "project") {
      contact.role_project = defaultRole.value.id;
    }

    contact.main = false;

    contacts.value.push(contact);
    editMode.value[contacts.value.length - 1] = true;
  });
};

const isMainContact = (contact) => {
  return (
    customer.value?.main_contact?.id == contact.id || contact.main === true
  );
};

const alertCellConditionalStyle = (data) => {
  return getAlertCellConditionalStyle(data);
};

const onStarClicked = (contact) => {
  emit("update:mainContact", contact.id);

  if (!isSourceExternal.value) {
    if (props.relatedEntity === "customer") {
      const contactParams = {
        contact_id: contact.id,
        main: true,
        role: contact.role.id,
      };

      assignContactToCustomer(customer.value.id, contactParams)
        .then(() => {
          loadLazyData();
        })
        .catch(() => {});
    }

    if (props.relatedEntity === "project") {
      const contactParams = {
        contact: contact.id,
        role: contact.role.id,
      };

      assignContactToProject(props.projectId, contactParams)
        .then(() => {
          loadLazyData();
        })
        .catch(() => {});
    }
  }
};

const toast = useToast();

const unlinkContact = (contactId) => {
  if (isSourceExternal.value) {
    emit("unlink", contactId);

    contacts.value = contacts.value.filter((contact) => {
      return contact.contact_id !== contactId;
    });
    return;
  }

  if (props.relatedEntity === "customer") {
    unassignContactFromCustomer(customer.value.id, contactId)
      .then(() => {
        loadLazyData();
        toast.success({ message: "Contact Successfully unlinked" });
      })
      .catch(() => {
        toast.error("Contact unlink Failed");
      });
  }

  if (props.relatedEntity === "project") {
    unassignContactFromProject(props.projectId, contactId)
      .then(() => {
        loadLazyData();
        toast.success({ message: "Contact Successfully unlinked" });
      })
      .catch(() => {
        toast.error("Contact unlink Failed");
      });
  }
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["contact"] = selectedContacts.value;
};

const saveRow = (contact) => {
  const roleValue =
    props.relatedEntity === "customer"
      ? contact.role?.id
      : contact.role_project?.id;

  if (props.relatedEntity === "customer") {
    const contactParams = {
      contact_id: contact.contact_id,
      role: roleValue,
    };

    assignContactToCustomer(customer.value.id, contactParams)
      .then(() => {
        loadLazyData();
        toast.success({ message: "Contact Successfully updated" });
      })
      .catch(() => {
        toast.error("Contact assign Failed");
      });
  }

  if (props.relatedEntity === "project") {
    const contactParams = {
      contact: contact.contact_id,
      role: roleValue,
    };

    assignContactToProject(props.projectId, contactParams)
      .then(() => {
        loadLazyData();
        toast.success({ message: "Contact Successfully updated" });
      })
      .catch(() => {
        toast.error("Contact assign Failed");
      });
  }
};

const isFilterVisible = ref(false);

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}
// watchEffect(() => {
//   loadLazyData();
// });

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
</script>
