<template>
  <WMNewEntitySidebar name="newContact" entity="contact" />
  <h2 v-if="showControls" class="h2">{{ $t("contact.contact") }}</h2>
  <div v-if="showControls" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          @click="formUtilsStore.expandSidebar = 'newContact'"
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          >{{ t("new") }}</WMButton
        >
        <WMAssignButton entity="contact" />
      </div>
      <div class="flex flex-row align-items-center gap-3">
        <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          >{{ t("filter") }}
        </WMButton>
        <SelectButton
          v-model="selectedOption"
          :options="options"
          optionLabel="name"
          class="flex flex-nowrap"
        />
      </div>
    </div>
    <div>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText class="w-30rem" :placeholder="$t('search')" />
      </span>
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
    :rows="rows"
    @page="onPage($event)"
    :totalRecords="totalRecords"
    @update:selection="onSelectionChanged"
    @update:rows="updatedRows($event)"
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
        <div @click="onStarClicked(slotProps.data.contact_id)">
          <img
            v-if="
              props.customer?.main_contact?.id == slotProps.data.id ||
              slotProps.data.main
            "
            src="/icons/star.svg"
            alt=""
            class="vertical-align-middle"
          />
        </div>
      </template>
      <template v-if="column.type === 'roleDropdown'" #body="slotProps">
        <Dropdown
          :options="optionSetsStore.optionSets[column.optionSet]"
          optionLabel="value"
          optionValue="value"
          class="w-full p-0"
          v-model="selectedRole[slotProps.index]"
          @change="
            emit(
              'update:' + column.name,
              $event.value,
              slotProps.data.contact_id
            )
          "
        >
        </Dropdown>
      </template>
      <template v-if="column.type === 'actions'" #body="slotProps">
        <div class="flex flex-row gap-2">
          <WMButton
            v-if="column.buttons?.includes('edit')"
            name="edit"
            icon="edit"
          />
          <WMButton
            v-if="column.buttons?.includes('unlink')"
            name="unlink"
            icon="unlink"
            @click="emit('unlink', slotProps.data.contact_id)"
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
import { defineProps, ref, watch, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useListUtilsStore } from "@/stores/listUtils";
import { useUtilsStore } from "@/stores/utils";
import { ContactsService } from "@/service/ContactsService";
import { useOptionSetsStore } from "@/stores/optionSets";

const i18n = useI18n();

const { t, locale } = useI18n();

const selectedContacts = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const listUtilsStore = useListUtilsStore();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const totalRecords = ref(0);
const optionSetsStore = useOptionSetsStore();
const selectedRole = ref([]);

const emit = defineEmits(["update:role", "unlink", "update:mainContact"]);

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
  customer: {
    type: Object,
    default: null,
  },
  contacts: {
    type: Array,
    default: null,
  },
});

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

const options = ref();
options.value = listUtilsStore.getSelectFilterButtonValues(
  "contact.contacts",
  i18n
);

watch(locale, () => {
  options.value = listUtilsStore.getSelectFilterButtonValues(
    "contact.contacts",
    i18n
  );
});

const employeeOptionSet = optionSetsStore.optionSets[
  "contact_customer_role"
].find((x) => x.value === "employee");

//When the contacts are changed, preselect employee as the default role Value
watch(
  props.contacts,
  (newValue) => {
    if (!isSourceExternal.value || !newValue) return;
    const lastAddedContact = newValue[props.contacts.length - 1];
    selectedRole.value[selectedRole.value.length] = "employee";
    emit("update:role", employeeOptionSet.id, lastAddedContact?.contact_id);
  },
  { immediate: true }
);

const contacts = ref(props.contacts);
const lazyParams = ref({});

const loadLazyData = () => {
  ContactsService.getContactsFromApi({
    page: lazyParams.value.page + 1,
    per_page: props.rows,
    customer_id: props.customer?.id,
  }).then((result) => {
    contacts.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const alertCellConditionalStyle = (data) => {
  return listUtilsStore.getAlertCellConditionalStyle(data);
};

const onStarClicked = (id) => {
  if (isSourceExternal.value) emit("update:mainContact", id);
  else console.log("not external");
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["contact"] = selectedContacts.value;
};
</script>
