<template>
  <h2 v-if="showControls && showTitle" class="h2">
    {{ $t("contact.contact") }}
  </h2>

  <WMAssignContactButton v-if="showAddContact" @add-contacts="addContacts" />

  <div
    v-if="showControls && showHeaderOptions && !showAddContact"
    class="flex flex-column gap-3 mb-3"
  >
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignContactButton @add-contacts="addContacts" />
        <WMButton
          v-if="can('contacts.export')"
          class="m-1 col-6"
          name="export-white"
          icon="export"
        >
          {{ $t("export") }}
        </WMButton>
      </div>
      <div v-if="showFilters" class="flex flex-row align-items-center gap-3">
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
          name="filterContact"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
        >
          <WMFilterForm entity="contact" filter-form-name="contact" />
        </WMSidebar>
        <WMOwnerToggle entity="contact" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox v-model="searchValue" entity="contact" />
    </div>
  </div>

  <div v-if="showOnlySearch" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row gap-3">
      <WMSearchBox v-model="searchValue" entity="contact" />
    </div>
  </div>

  <DataTable
    v-model:selection="selectedContacts"
    lazy
    :value="contacts"
    data-key="contact_id"
    table-style="min-width: 50rem"
    scrollable
    :paginator="showControls"
    :rows="props.rows"
    :total-records="totalRecords"
    class="w-full"
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
      :header="column.header ? $t(column.header) : $t(`contact.${column.name}`)"
      :class="column.class"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.name] }}
        </template>
        <template v-if="column.type === 'link'">
          <router-link
            :to="'/' + column.to + '/' + slotProps.data[column.linkParameter]"
            class="vertical-align-middle"
            >{{ slotProps.data[column.name] }}</router-link
          >
        </template>
        <template v-if="column.type === 'star'">
          <div
            @click="editMode[slotProps.index] && onStarClicked(slotProps.data)"
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
              @click="unlinkContact(slotProps.data.contact_id)"
            />
          </div>
        </template>
        <template v-if="column.type === 'alert'">
          <div :class="alertCellConditionalStyle(slotProps.data[column.name])">
            {{ slotProps.data[column.name] }}
          </div>
        </template>
        <template v-if="column.type === 'address'">
          {{ formatAddress(slotProps.data.location) }}
        </template>
        <template v-if="column.type === 'address'">
          {{ formatAddress(slotProps.data.location) }}
        </template>
        <template v-if="column.type === 'take-call-btn'">
          <Button
            type="button"
            label="Take call"
            icon="pi pi-phone"
            severity="primary"
            @click="handleTakeCall(slotProps.data)"
          />
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, unref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const router = useRouter();
const { can } = usePermissions();
const { t } = useI18n();
const toast = useToast();
const utilsStore = useUtilsStore();
const optionSetsStore = useOptionSetsStore();
const { optionLabelWithLang } = useLanguages();
const { getAlertCellConditionalStyle } = useListUtils();
const { getContactsFromApi } = useContacts();
const {
  getCustomerFromApi,
  assignContactToCustomer,
  unassignContactFromCustomer,
} = useCustomers();
const { assignContactToProject, unassignContactFromProject } = useProjects();
const { takeCall } = useCalls();

const { formatAddress } = useUtils();

// PROPS, EMITS
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
  showControls: {
    type: Boolean,
    default: true,
  },
  showFilters: {
    type: Boolean,
    default: true,
  },
  showTitle: {
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
  showHeaderOptions: {
    type: Boolean,
    default: true,
  },
  showAddContact: {
    type: Boolean,
    default: false,
  },
  showOnlySearch: {
    type: Boolean,
    default: false,
  },
  tableClass: {
    type: String,
    default: "",
  },
  relatedEntity: {
    type: String,
    default: "customer",
  },
  searchValue: {
    type: String,
    default: "",
  },
  taskCall: {
    type: String,
    default: "",
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
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const totalRecords = ref(0);
const editMode = ref([]);
const contacts = ref([]);
const customer = ref();
const searchValue = ref(props.searchValue);
const lazyParams = ref({});
const isFilterVisible = ref(false);

// COMPUTED
// If the source of data is external, we don't need to load the
// data from the API and the functions are dealt internally
const isSourceExternal = computed(() => {
  return props.contacts != null;
});

// COMPONENT METHODS
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

const addContacts = (addedContacts) => {
  addedContacts.forEach((contact) => {
    if (contacts.value.find((c) => c.contact_id === contact.id)) return;

    if (props.relatedEntity === "customer") {
      contact.role = getDefaultRole();
    }

    if (props.relatedEntity === "project") {
      contact.role_project = getDefaultRole();
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
        toast.success("Contact Successfully unlinked");
      })
      .catch(() => {
        toast.error("Contact unlink Failed");
      });
  }

  if (props.relatedEntity === "project") {
    unassignContactFromProject(props.projectId, contactId)
      .then(() => {
        loadLazyData();
        toast.success("Contact Successfully unlinked");
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
        // loadLazyData();
        toast.success("Contact Successfully updated");
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
        // loadLazyData();
        toast.success("Contact Successfully updated");
      })
      .catch(() => {
        toast.error("Contact assign Failed");
      });
  }
};

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

const getDefaultRole = () => {
  if (props.relatedEntity === "customer") {
    return unref(optionSets.value["contact_customer_role"][0]);
  }

  if (props.relatedEntity === "project") {
    return unref(optionSets.value["contact_project_role"][0]);
  }
};

const handleTakeCall = (contact) => {
  const params = {
    entity_type: "contact",
    entity_id: contact.contact_id,
  };

  takeCall(props.taskCall, params).then(() => {
    emit("closeDialog");

    toast.success("Call taken successfully");

    router.push({
      name: "contactDetail",
      params: { id: contact.contact_id },
      force: true,
    });
  });
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
      optionSets.value[column.optionSet] =
        await optionSetsStore.getOptionSetValues(column.optionSet);
    }
  });
};
</script>
