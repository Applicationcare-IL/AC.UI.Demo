<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["task.task"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMTeamOwnerFields />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="flex flex-row gap-2 align-items-end">
          <WMInputSearch
            name="contact"
            :required="true"
            :placeholder="$t('select', ['contact.contact'])"
            type="input-search"
            :label="$t('contact.contact') + ':'"
            width="160"
            :highlighted="true"
            :new="true"
            related-sidebar="newContact"
            :search-function="searchContact"
            :model-value="selectedContact"
          />
          <WMSidebar
            :visible="isNewContactSidebarVisible"
            name="newContact"
            @close-sidebar="closeNewContactSidebar"
            @open-sidebar="openNewContactSidebar"
          >
            <WMNewEntityFormHeader entity="contact" name="newContact" />
            <WMNewContactForm
              :is-sidebar="true"
              :show-confirm-dialog="false"
              @close-sidebar="closeNewContactSidebar"
              @contact-created="handleContactCreated"
            />
          </WMSidebar>
        </div>
        <WMInputSearch
          name="customer"
          :required="true"
          :placeholder="$t('select', ['organization.organization'])"
          type="input-search"
          :label="$t('organization.organization') + ':'"
          width="160"
          :highlighted="true"
          :search-function="searchCustomer"
          :new="true"
          related-sidebar="newCustomer"
          :model-value="selectedCustomer"
        />
        <WMSidebar
          :visible="isNewCustomerSidebarVisible"
          name="newCustomer"
          @close-sidebar="closeNewCustomerSidebar"
          @open-sidebar="openNewCustomerSidebar"
        >
          <WMNewEntityFormHeader entity="customer" name="newCustomer" />
          <WMNewCustomerForm
            :is-sidebar="true"
            :show-confirm-dialog="false"
            @close-sidebar="closeNewCustomerSidebar"
            @customer-created="handleCustomerCreated"
          />
        </WMSidebar>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <WMInputSearch
          name="task-family"
          :required="true"
          :placeholder="$t('select', ['task.family'])"
          type="input-search"
          :label="$t('task.family') + ':'"
          width="200"
          :highlighted="true"
          :options="taskFamily"
          :option-set="true"
        />
        <WMInputSearch
          name="task-type"
          :required="true"
          :placeholder="$t('select', ['task.type'])"
          type="input-search"
          :label="$t('task.type') + ':'"
          width="200"
          :highlighted="true"
          :search-function="searchTaskTypes"
          :disabled="!values['task-family']"
        />
      </div>
      <!-- <Divider class="mb-0" layout="horizontal" />
      <div class="task-timing flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">Timing</h2>
        <div class="wm-form-row gap-5">
          <WMInput
            name="start_task"
            type="input-select-button"
            :highlighted="true"
            :label="'Start task'"
            :options="startTaskOptions"
            :value="selectedStartTaskOption"
            @update:selectedItem="onChange"
            width="80"
          />

          <WMInput
            v-if="selectedStartTaskOption.name === 'future'"
            type="date"
            :label="'Start date'"
            id="start_date"
            name="start_date"
          />
        </div>
      <div class="wm-form-row gap-5">
          <WMToggleSwitch v-model="isRecurring" label="Recurring task">
            Content
          </WMToggleSwitch>
        </div>
      </div> -->
      <Divider class="mb-0" layout="horizontal" />
      <div class="task-description flex flex-auto flex-column gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            id="description"
            type="text-area"
            name="description"
            :required="true"
            :label="$t('description') + ':'"
            :highlighted="true"
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
// IMPORTS
import { useForm } from "vee-validate";
import { inject, onMounted, ref, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

const { getTasksTypesFromApi, createTask, parseTask } = useTasks();
const { getCustomersFromApi, getCustomerFromApi } = useCustomers();

const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

const { getContactsFromApi, getContactFromApi } = useContacts();

// INJECT
const preselectedContact = inject("preselectedContact", null);
const preselectedCustomer = inject("preselectedCustomer", null);
const isFormDirty = inject("isFormDirty");
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    default: "",
  },
  relatedEntityId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["newTaskCreated"]);

// REFS
// const isRecurring = ref(false);
const taskFamily = ref("");

const isNewContactSidebarVisible = ref(false);
const isNewCustomerSidebarVisible = ref(false);

const selectedContact = ref();
const selectedCustomer = ref();

// const selectedStartTaskOption = ref({ name: "now", value: "now" });
// const startTaskOptions = ref([
//   { name: "now", value: "now" },
//   { name: "future", value: "future" },
// ]);

// COMPUTED

// COMPONENT METHODS
function openNewContactSidebar() {
  isNewContactSidebarVisible.value = true;
}

function closeNewContactSidebar() {
  isNewContactSidebarVisible.value = false;
}

function openNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = true;
}

function closeNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = false;
}

const searchCustomer = (query) => {
  return getCustomersFromApi({
    search: query,
    contact_id: values.contact?.id,
  });
};

const { handleSubmit, values, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getTaskFormValidationSchema,
});

optionSetsStore.getOptionSetValuesFromApiRaw("task_family").then((data) => {
  taskFamily.value = data;
});

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
    customer_id: values.customer?.id,
  });
};

const searchTaskTypes = (query) => {
  return getTasksTypesFromApi({
    search: query,
    task_family: values["task-family"].id,
  });
};

const onSubmit = handleSubmit((values) => {
  const today = new Date().toISOString().slice(0, 10);

  const task = {
    ...values,
    started_at: today,
    due_date: today, // TODO: change that to the date the user selected
  };

  if (
    props.relatedEntity &&
    props.relatedEntity != "contact" &&
    props.relatedEntity != "customer"
  ) {
    task.entity_type = props.relatedEntity;
    task.entity_id = props.relatedEntityId;
  }

  createTask(parseTask(task))
    .then((data) => {
      emit("newTaskCreated");
      dialog.confirmNewTask({ id: data.data.id, emit });

      resetForm();
      isFormDirty.value = false;

      closeSidebar();

      toast.successAction("contact", "created");
    })
    .catch((error) => {
      console.error(error);
      toast.error("contact", "not-created");
    });
});

const onCancel = () => {
  closeSidebar();
};

function handleContactCreated(contactId) {
  if (!contactId) {
    return;
  }

  getContactFromApi(contactId).then((response) => {
    selectedContact.value = response;

    closeNewContactSidebar();
  });
}

function handleCustomerCreated(customerId) {
  if (!customerId) {
    return;
  }

  getCustomerFromApi(customerId).then((response) => {
    selectedCustomer.value = response;

    closeNewCustomerSidebar();
  });
}

// function onChange(value) {
//   selectedStartTaskOption.value = value;
// }

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
  onCancel,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    isFormDirty.value = value.dirty;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (preselectedContact) {
    selectedContact.value = preselectedContact.value;
  }

  if (preselectedCustomer) {
    selectedCustomer.value = preselectedCustomer.value;
  }
});
</script>

<style scoped lang="scss"></style>
