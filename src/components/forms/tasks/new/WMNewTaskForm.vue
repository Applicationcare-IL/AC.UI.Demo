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
            v-model="selectedContact"
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
          />

          <WMSidebar
            :visible="isNewContactSidebarVisible"
            name="newContact"
            @close-sidebar="closeNewContactSidebar"
            @open-sidebar="openNewContactSidebar"
          >
            <template v-if="can('contacts.create')">
              <WMNewEntityFormHeader entity="contact" name="newContact" />
              <WMNewContactForm
                :is-sidebar="true"
                :show-confirm-dialog="false"
                @close-sidebar="closeNewContactSidebar"
                @contact-created="handleContactCreated"
              />
            </template>
            <template v-else>
              <div class="m-5">
                {{ $t("permissions.you-dont-have-permission") }}
              </div>
            </template>
          </WMSidebar>
        </div>
        <WMInputSearch
          v-model="selectedCustomer"
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
          :disabled="!isCustomerEditable"
        />
        <WMSidebar
          :visible="isNewCustomerSidebarVisible"
          name="newCustomer"
          data-testid="new_form"
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
          :options="taskFamilies"
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
      <Divider class="mb-0" layout="horizontal" />
      <div class="task-timing flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("task.timing") }}</h2>
        <div class="wm-form-row gap-5 align-items-baseline">
          <WMInput
            name="start_task"
            type="input-select-button"
            :highlighted="true"
            :label="$t('task.start-task') + ':'"
            :options="startTaskOptions"
            :value="selectedStartTaskOption"
            width="80"
            @update:selected-item="onChangeStartTaskOption"
          />

          <WMInput
            v-if="selectedStartTaskOption.value === 'future'"
            id="start_date"
            type="date"
            :label="$t('start-date') + ':'"
            name="start_date"
            :value="parseDate(today)"
          />
        </div>

        <div class="wm-form-row gap-5">
          <WMToggleSwitch v-model="isRecurring" :label="$t('task.recurring-task')">
            <WMNewTaskFormRecurringOptions
              :related-entity="relatedEntity"
              @update:selected-options="onRecurringOptionsChange"
            />
          </WMToggleSwitch>
        </div>
      </div>
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
            size="full"
          />
        </div>
      </div>
    </div>
    <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
  </div>

  <WMPaymentRequestTaskDialog
    v-model="paymentRequestTaskTypeDialogVisibility"
    :task="currentCreatingTask"
    @request-payment-task-created="handleRequestPaymentTaskCreated"
  />
</template>

<script setup>
// IMPORTS
import { formatDate } from "@vueuse/core";
import { useForm } from "vee-validate";
import { computed, inject, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { t } = useI18n();

const { getTasksTypesFromApi, createTask, parseTask } = useTasks();
const { getCustomersFromApi, getCustomerFromApi } = useCustomers();

const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

const { parseDate } = useDates();

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
const isRecurring = ref(false);
const taskFamilies = ref("");

const currentCreatingTask = ref(null);

const isNewContactSidebarVisible = ref(false);
const isNewCustomerSidebarVisible = ref(false);

const paymentRequestTaskTypeDialogVisibility = ref(false);

const selectedContact = ref();
const selectedCustomer = ref();

const startTaskOptions = ref([
  { name: t("now"), value: "now" },
  { name: t("future"), value: "future" },
]);

const selectedStartTaskOption = ref(startTaskOptions.value[0]);
const recurringOptions = ref(null);
const today = ref(new Date().toISOString().slice(0, 10));

const PAYMENT_REQUEST_TASK_FAMILY_ID = ref(0);

// COMPUTED
// TODO: this should be a prop with an array of the values that we want to disable, but for now this is enough
const isCustomerEditable = computed(() => {
  return props.relatedEntity != "service";
});

// COMPONENT METHODS AND LOGIC
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
  taskFamilies.value = data;

  PAYMENT_REQUEST_TASK_FAMILY_ID.value = data.find(
    (taskFamily) => taskFamily.value === "payment"
  ).id;
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
  const taskDate = values.start_date ? formatDate(values.start_date, "YYYY-MM-DD") : today.value;

  let task = {
    ...values,
    started_at: taskDate,
    due_date: taskDate,
  };

  if (
    props.relatedEntity &&
    props.relatedEntity != "contact" &&
    props.relatedEntity != "customer"
  ) {
    task.entity_type = props.relatedEntity;
    task.entity_id = props.relatedEntityId;
  }

  if (isRecurring.value) {
    task = {
      ...task,
      is_recurring: true,
      ...recurringOptions.value,
    };
  }

  if (PAYMENT_REQUEST_TASK_FAMILY_ID.value === values["task-family"].id) {
    currentCreatingTask.value = task;
    paymentRequestTaskTypeDialogVisibility.value = true;
    return;
  }

  handleCreateTask(task);
});

const handleCreateTask = (task) => {
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
};

const handleRequestPaymentTaskCreated = (newTaskId) => {
  emit("newTaskCreated");
  dialog.confirmNewTask({ id: newTaskId, emit });

  resetForm();
  isFormDirty.value = false;

  closeSidebar();

  toast.successAction("contact", "created");
};

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

function onChangeStartTaskOption(value) {
  selectedStartTaskOption.value = value;
}

function onRecurringOptionsChange(value) {
  recurringOptions.value = value;
}

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

watch(
  () => selectedContact.value,
  (newSelectedContact) => {
    if (newSelectedContact.customer?.id) {
      getCustomerFromApi(newSelectedContact.customer.id).then((response) => {
        selectedCustomer.value = response;
      });
    }
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
