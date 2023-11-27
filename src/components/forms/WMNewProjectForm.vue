<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t("new", ["project.project"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="owner"
            type="info"
            :highlighted="true"
            :label="$t('owner') + ':'"
            value="שרוליק כהן"
          />
          <WMInput
            name="id"
            type="info"
            :highlighted="true"
            :label="$t('team') + ':'"
            value="שיפור פני העיר"
          />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="project-name"
            :required="true"
            type="input-text"
            :label="$t('project.project_name') + ':'"
          />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            type="text-area"
            :label="$t('project.project_description') + ':'"
            id="description"
            name="project-description"
          />
        </div>
      </div>
      <Divider layout="horizontal" />
      <h2 class="h2 my-0">{{ $t("classification") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="project_type"
            :highlighted="true"
            :required="true"
            :label="'project type' + ':'"
            type="input-search"
            :options="projectTypes"
            width="152"
            :placeholder="$t('select', ['classification-1'])"
          />

          <WMInputSearch
            name="project_area"
            :highlighted="true"
            :required="true"
            :label="'project area' + ':'"
            :options="projectAreas"
            width="152"
            :placeholder="$t('select', ['classification-2'])"
          />

          <WMInputSearch
            name="project_detail"
            :highlighted="true"
            :required="true"
            :label="'project details' + ':'"
            :options="projectDetails"
            width="152"
            :placeholder="$t('select', ['classification-3'])"
          />
        </div>
      </div>

      <Divider class="mb-0" layout="horizontal" />
      <div class="flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">LOCATION</h2>
        <div class="wm-form-row gap-4">
          <WMSelectableButton label="city" v-model="showCityDataOptions" />
          <WMSelectableButton label="address" v-model="showAddressOptions" />
        </div>
        <div class="wm-form-row gap-5">
          <span v-if="showCityDataOptions"> CITY FIELDS </span>
          <span v-if="showAddressOptions"> ADDRESS FIELDS </span>
        </div>
      </div>

      <Divider class="mb-0" layout="horizontal" />

      <div class="flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">TEAM</h2>
        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="contact"
            :required="true"
            :placeholder="$t('select', ['contact'])"
            type="table"
            :label="$t('contact') + ':'"
            width="160"
            :highlighted="true"
            :searchFunction="searchContact"
            :new="true"
            related-sidebar="newCustomer"
            @change="onContactselected"
            :multiple="true"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMContactsTable
            :contacts="selectedContacts"
            :columns="getSelectedContactsForNewCustomerColumns()"
            :showControls="false"
            @update:role="updatedRole"
            @update:mainContact="updatedMainContact"
            @unlink="unlinkContact"
            :multiselect="false"
          />
        </div>
      </div>
    </div>
    <WMFormButtons
      v-if="isSidebar"
      @save-form="onSubmit()"
      @cancel-form="onCancel()"
    />
  </div>
</template>

<script setup>
import { ref, defineEmits, defineExpose, onMounted } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

import { useForm } from "vee-validate";

const optionSetsStore = useOptionSetsStore();

const { createProject, parseProject } = useProjects();

const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

const showCityDataOptions = ref(false);
const showAddressOptions = ref(false);

const { handleSubmit, values } = useForm({
  validationSchema: formUtilsStore.getNewProjectFormValidationSchema,
});

const taskFamily = ref("");
optionSetsStore.getOptionSetValuesFromApiRaw("task_family").then((data) => {
  taskFamily.value = data;
});

const emit = defineEmits(["closeSidebar"]);

const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApi("project_type")
    .then((data) => (projectTypes.value = data));
  optionSetsStore
    .getOptionSetValuesFromApi("project_area")
    .then((data) => (projectAreas.value = data));
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail")
    .then((data) => (projectDetails.value = data));
});

// const updateDropdown = (dropdown, selectedId, dropdownOptions) => {
//   optionSetsStore
//     .getOptionSetValuesFromApiRaw(dropdown, selectedId)
//     .then((data) => {
//       optionRefs[dropdownOptions].value = data;
//     });
// };

// TEAM SECTION
const { getContactsFromApi } = useContacts();

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
  });
};

const defaultRole = optionSetsStore.optionSets["contact_customer_role"].find(
  (role) => role.value === "employee"
);

const { getSelectedContactsForNewCustomerColumns } = useListUtils();

const selectedContacts = ref([]);
const updatedMainContact = (id) => {
  selectedContacts.value.map((contact) => {
    if (contact.id === id) {
      contact.main = true;
    } else {
      contact.main = false;
    }
  });
};

const unlinkContact = (id) => {
  console.log("UNLINK CONTACT" + id);
  const index = selectedContacts.value.findIndex((contact) => {
    return contact.contact_id == id;
  });
  selectedContacts.value.splice(index, 1);
};

const onContactselected = (newContact) => {
  if (
    selectedContacts.value.some((contact) => contact.id === newContact.value.id)
  )
    return;

  //Select the default role for the new contact and add it to the list of selected contacts
  newContact.value.role = defaultRole;
  selectedContacts.value.push(newContact.value);
};

const onSubmit = handleSubmit((values) => {
  const parsedProject = parseProject(values);

  console.log(parsedProject);

  createProject(parsedProject)
    .then((data) => {
      dialog.confirmNewService(data.data.id);
      toast.successAction("service", "created");
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-created");
    });
});

const onCancel = () => {
  emit("closeSidebar");
};

defineExpose({
  onSubmit,
  onCancel,
});
</script>

<style scoped lang="scss"></style>
