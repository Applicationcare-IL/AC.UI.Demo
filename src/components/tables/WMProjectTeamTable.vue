<template>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMAssignContactButton @add-contacts="addContacts" />
      </div>
      <!-- <div class="flex flex-row align-items-center gap-3">
        <WMOwnerToggle entity="contact" />
      </div> -->
    </div>
    <div class="flex flex-row gap-3">
      <!-- <WMSearchBox v-model="searchValue" entity="contact" /> -->
      <!-- <WMFilterButton
        :is-active="isFilterApplied || isFilterVisible"
        @click="openFilterSidebar"
      />
      <WMSidebar
        :visible="isFilterVisible"
        name="filterContact"
        @close-sidebar="closeFilterSidebar"
        @open-sidebar="openFilterSidebar"
      >
        <WMFilterForm entity="contact" filter-form-name="contact" />
      </WMSidebar> -->
    </div>
  </div>

  <!-- <pre>{{ contacts }}</pre> -->
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
    <!-- <Column v-if="multiselect" style="width: 40px" selection-mode="multiple"></Column> -->
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
              @click="unlinkContact(slotProps.data)"
            />
          </div>
        </template>
        <template v-if="column.type === 'alert'">
          <div :class="alertCellConditionalStyle(slotProps.data[column.name])">
            {{ slotProps.data[column.name] }}
          </div>
        </template>
        <!-- <template v-if="column.type === 'address'">
          {{ formatAddress(slotProps.data.location) }}
        </template> -->
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

const { getProjectTeam, assignContactToProject, unassignContactFromProject } =
  useProjects();

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
const totalRecords = ref(0);
const editMode = ref([]);
const contacts = ref([]);
const searchValue = ref(props.searchValue);
const lazyParams = ref({});

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
    // ...filters,
    per_page: 10,
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

const addContacts = (addedContacts) => {
  addedContacts.forEach(async (contact) => {
    contact.role_project = getDefaultRole();
    contact.main = false;
    contacts.value.push(contact);
    editMode.value[contacts.value.length - 1] = true;
  });
};

const alertCellConditionalStyle = (data) => {
  return getAlertCellConditionalStyle(data);
};

const unlinkContact = (contact) => {
  const params = {
    project_id: parseInt(props.projectId),
    contact_id: contact.contact_id,
    role_id: contact.role_project?.id,
    customer_id: contact.customer.id,
  };

  unassignContactFromProject(params)
    .then(() => {
      loadLazyData();
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
  const contactParams = {
    project: parseInt(props.projectId),
    contact: contact.contact_id,
    role: contact.role_project?.id,
    customer: contact.customer.id,
  };

  assignContactToProject(contactParams)
    .then(() => {
      loadLazyData();
      toast.success({ message: "Contact Successfully updated" });
    })
    .catch(() => {
      toast.error("Contact assign Failed");
    });
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
      optionSets.value[column.optionSet] =
        await optionSetsStore.getOptionSetValues(column.optionSet);
    }
  });
};
</script>
