<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t("new", ["task.task"]) }}</h1>
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
        <div class="flex flex-row gap-2 align-items-end">
          <WMInputSearch
            name="contact"
            :required="true"
            :placeholder="$t('select', ['contact'])"
            type="input-search"
            :label="$t('contact') + ':'"
            width="160"
            :highlighted="true"
            :new="true"
            related-sidebar="newContact"
            :searchFunction="searchContact"
          />
          <WMSidebar
            :visible="isNewContactSidebarVisible"
            @close-sidebar="closeNewContactSidebar"
            @open-sidebar="openNewContactSidebar"
            name="newContact"
          >
            <WMNewEntityFormHeader entity="contact" name="newContact" />
            <WMNewContactForm
              :isSidebar="true"
              @close-sidebar="closeNewContactSidebar"
            />
          </WMSidebar>
        </div>
        <WMInputSearch
          name="customer"
          :required="true"
          :placeholder="$t('select', ['customer'])"
          type="input-search"
          :label="$t('customer') + ':'"
          width="160"
          :highlighted="true"
          :searchFunction="searchCustomer"
          :new="true"
          related-sidebar="newCustomer"
        />
        <WMSidebar
          :visible="isNewCustomerSidebarVisible"
          @close-sidebar="closeNewCustomerSidebar"
          @open-sidebar="openNewCustomerSidebar"
          name="newCustomer"
        >
          <WMNewEntityFormHeader entity="customer" name="newCustomer" />
          <WMNewCustomerForm
            :isSidebar="true"
            @close-sidebar="closeNewCustomerSidebar"
          />
        </WMSidebar>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <WMInputSearch
          name="task-type"
          :required="true"
          :placeholder="$t('select', ['task.type'])"
          type="input-search"
          :label="$t('task.type') + ':'"
          width="200"
          :highlighted="true"
          :searchFunction="searchTaskTypes"
        />
        <WMInputSearch
          name="task-family"
          :required="true"
          :placeholder="$t('select', ['task.family'])"
          type="input-search"
          :label="$t('task.family') + ':'"
          width="200"
          :highlighted="true"
          :options="taskFamily"
        />
      </div>
      <Divider class="mb-0" layout="horizontal" />
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
            id="description"
            name="start_date"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMToggleSwitch v-model="isRecurring" label="Recurring task">
            Content
          </WMToggleSwitch>
        </div>
      </div>
      <Divider class="mb-0" layout="horizontal" />
      <div class="task-description flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("description") }}</h2>
        <div class="wm-form-row gap-5">
          <WMInput type="text-area" id="description" name="description" />
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
import { ref, defineEmits, defineExpose } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

import { useForm } from "vee-validate";
import { CustomerService } from "@/service/CustomerService";
import { ContactsService } from "@/service/ContactsService";

import { useToast } from "@/stores/toast";
import { useDialog } from "@/stores/dialog";

const optionSetsStore = useOptionSetsStore();

const { getTasksTypesFromApi, createTask, parseTask } = useTasks();

const isRecurring = ref(false);

const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

function onChange(value) {
  selectedStartTaskOption.value = value;
}

const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

const { handleSubmit, values } = useForm({
  validationSchema: formUtilsStore.getTaskFormValidationSchema,
});

const taskFamily = ref("");
optionSetsStore.getOptionSetValuesFromApiRaw("task_family").then((data) => {
  taskFamily.value = data;
});

const emit = defineEmits(["closeSidebar"]);

// new contact sidebar
const isNewContactSidebarVisible = ref(false);

function openNewContactSidebar() {
  isNewContactSidebarVisible.value = true;
}

function closeNewContactSidebar() {
  isNewContactSidebarVisible.value = false;
}

// new customer sidebar
const isNewCustomerSidebarVisible = ref(false);

function openNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = true;
}

function closeNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = false;
}

const searchCustomer = (query) => {
  return CustomerService.getCustomersFromApi({ search: query });
};

const searchContact = (query) => {
  return ContactsService.getContactsFromApi({ search: query });
};

const searchTaskTypes = (query) => {
  return getTasksTypesFromApi({
    search: query,
    task_family: values["task-family"].id,
  });
};

const selectedStartTaskOption = ref({ name: "now", value: "now" });
const startTaskOptions = ref([
  { name: "now", value: "now" },
  { name: "future", value: "future" },
]);

const onSubmit = handleSubmit((values) => {
  const today = new Date().toISOString().slice(0, 10);

  const task = {
    ...values,
    started_at: today,
    due_date: today, // TODO: change that to the date the user selected
  };

  createTask(parseTask(task))
    .then((data) => {
      dialog.confirmNewTask(data.data.id);
      toast.successAction("contact", "created");
    })
    .catch((error) => {
      console.log(error);
      toast.error("contact", "not-created");
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
