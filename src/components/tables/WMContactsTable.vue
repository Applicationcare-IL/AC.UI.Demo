<template>
  <h2 v-if="showControls" class="h2">{{ $t("contact.contact") }}</h2>
  <div
    v-if="showControls && showHeaderOptions"
    class="flex flex-column gap-3 mb-3"
  >
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignContactButton @addContacts="addContacts" />
        <WMButton class="m-1 col-6" name="export-white" icon="export">
          ייצוא נתונים
        </WMButton>
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
          name="filterContact"
        >
          <WMFilterForm entity="contact" filterFormName="contact" />
        </WMSidebar>
        <WMOwnerToggle entity="contact" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="contact" />
    </div>
  </div>
  <DataTable
    lazy
    v-model:selection="selectedContacts"
    :value="contacts"
    dataKey="contact_id"
    tableStyle="min-width: 50rem"
    scrollable
    :paginator="showControls"
    :rows="props.rows"
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
      <template v-if="column.type === 'star'" #body="slotProps">
        <div
          @click="
            editMode[slotProps.index] &&
              !isMainContact(slotProps.data) &&
              onStarClicked(slotProps.data)
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
      <template v-if="column.type === 'role'" #body="slotProps">
        <Dropdown
          v-if="editMode[slotProps.index]"
          :options="optionSetsStore.optionSets[column.optionSet]"
          optionLabel="value"
          optionValue="id"
          class="w-full p-0"
          v-model="slotProps.data.role.id"
        >
        </Dropdown>
        <div v-else>
          {{ slotProps.data[column.name].value }}
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
import { ref, watch, onMounted, computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";
import { useOptionSetsStore } from "@/stores/optionSets";

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

const emit = defineEmits(["update:role", "unlink", "update:mainContact"]);

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
  customerId: {
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
  tableClass: {
    type: String,
    default: "",
  },
});

const editMode = ref([]);

// If the source of data is external, we don't need to load the
// data from the API and the functions are dealt internally
const isSourceExternal = computed(() => {
  return props.contacts != null;
});

onMounted(() => {
  if (isSourceExternal.value) {
    contacts.value = props.contacts;
    totalRecords.value = props.contacts?.length;
  } else {
    loadLazyData();
  }
});

const { getAlertCellConditionalStyle } = useListUtils();

watch(
  props.contacts,
  (newValue) => {
    if (!isSourceExternal.value || !newValue) return;
    editMode.value[props.contacts.length - 1] = true;
  },
  { immediate: true }
);

// const contacts = ref(props.contacts);
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

const loadLazyData = () => {
  getCustomerFromApi(props.customerId).then((data) => {
    customer.value = data;
  });

  const filters = utilsStore.filters["contact"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = props.rows;
  const customerParam = props.customerId;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
    customer_id: customerParam,
  });

  getContactsFromApi(params).then((result) => {
    contacts.value = result.data;
    totalRecords.value = result.totalRecords;
    console.log("contacts", contacts.value);
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const defaultRole = optionSetsStore.optionSets["contact_customer_role"].find(
  (role) => role.value === "employee"
);

const addContacts = (addedContacts) => {
  addedContacts.forEach((contact) => {
    if (contacts.value.find((c) => c.contact_id === contact.id)) return;
    contact.role = defaultRole;
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
    const contactParams = { id: contact.id, main: true, role: contact.role.id };
    assignContactToCustomer(customer.value.id, contactParams)
      .then(() => {
        loadLazyData();
      })
      .catch(() => {});
  }
};
const toast = useToast();

const unlinkContact = (contactId) => {
  if (isSourceExternal.value) emit("unlink", contactId);
  else {
    unassignContactFromCustomer(customer.value.id, contactId)
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
  console.log("saveRow", contact);
  const contactParams = {
    id: contact.contact_id,
    role: contact.role.id,
  };
  assignContactToCustomer(customer.value.id, contactParams)
    .then(() => {
      loadLazyData();
      toast.success("Contact Successfully updated");
    })
    .catch(() => {
      toast.error("Contact assign Failed");
    });
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
  () => utilsStore.searchString["contact"],
  () => {
    searchValue.value = utilsStore.searchString["contact"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);
</script>
