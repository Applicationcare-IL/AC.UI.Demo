<template>
  <div class="mobile-task-detail">
    <div class="mobile-task-detail-header my-2 ml-2 flex flex-row overflow-x-scroll">
      <WMCompleteTasksButton entity="task" @task-completed="fetchTaskInfo(route.params.id)" />
      <WMAssignOwnerButton
        v-if="can(utilsStore.pluralEntity + '.assign')"
        entity="task"
        @owner-assigned="fetchTaskInfo(route.params.id)"
      />
      <WMSendMessageButton :selected-elements="selectedElements" />

      <WMSendEmailButton v-if="can('global.mail')" :selected-elements="selectedElements" />
    </div>
    <div class="mobile-task-detail-content mb-5 p-3 py-3">
      <WMInput
        name="id"
        type="info"
        :highlighted="true"
        :label="$t('id')"
        :value="task.id"
        class="mb-3"
      />
      <WMInput
        name="owner"
        type="info"
        :highlighted="true"
        :label="$t('owner')"
        :value="task.owner"
        class="mb-3"
      />
      <WMInput
        name="type"
        type="info"
        :highlighted="true"
        :label="$t('task.type')"
        :value="task.task_type?.name"
        class="mb-3"
      />

      <WMInput
        v-if="location"
        name="address"
        type="info"
        :highlighted="true"
        :label="$t('address')"
        :value="location"
        class="mb-3"
      />

      <WMInput
        name="description"
        type="info"
        :highlighted="true"
        :label="$t('task.description')"
        :value="task.description"
        class="mb-3 w-full"
      />

      <Divider />

      <WMInput
        id="notes"
        :label="$t('task.notes')"
        :value="task.notes"
        type="text-area"
        name="notes"
        size="full"
      />

      <Button label="Save notes" class="mt-6" @click="onSave" />

      <Divider />

      <WMAttachmentsTable :entity-id="route.params.id" entity-type="task" />
    </div>
    <div class="mobile-task-detail-footer flex flex-column gap-2 mx-3">
      <Button
        v-if="serviceButtonLabel"
        size="large"
        class="w-full p-4"
        severity="success"
        :label="serviceButtonLabel"
        @click="showServiceDetail = true"
      />

      <Dialog
        v-model:visible="showServiceDetail"
        modal
        header="Service detail"
        :dismissable-mask="true"
        :closable="true"
        :style="{ width: '90%' }"
      >
        <MobileTaskDetailServiceDialog :service="service" />
      </Dialog>

      <Button
        :label="`${contact.name}, ${contact.telephone}`"
        size="large"
        class="w-full p-4"
        severity="success"
        @click="showContactDetail = true"
      />

      <Dialog
        v-model:visible="showContactDetail"
        modal
        header="Contact detail"
        :dismissable-mask="true"
        :closable="true"
        :style="{ width: '90%' }"
      >
        <MobileTaskDetailContactDialog :contact="contact" />
      </Dialog>

      <Button
        :label="customer.name"
        size="large"
        class="w-full p-4"
        severity="success"
        @click="showCustomerDetail = true"
      />

      <Dialog
        v-model:visible="showCustomerDetail"
        modal
        header="Customer detail"
        :dismissable-mask="true"
        :closable="true"
        :style="{ width: '90%' }"
      >
        <MobileTaskDetailCustomerDialog :customer="customer" />
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

const task = ref("");

const formUtilsStore = useFormUtilsStore();

const selectedElements = ref(0);
const { can } = usePermissions();

const toast = useToast();

const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getMobileTaskFormValidationSchema,
});

// dialogs
const showServiceDetail = ref(false);
const showContactDetail = ref(false);
const showCustomerDetail = ref(false);

const route = useRoute();

const utilsStore = useUtilsStore();
const { setSelectedContacts, getContactFromApi } = useContacts();
const { getCustomerFromApi } = useCustomers();
const { getServiceFromApi } = useServices();

const { getTaskFromApi, mapContactsFromTasks, updateTask, parseUpdateTask } = useTasks();

const { optionLabelWithLang } = useLanguages();

const service = ref("");
const contact = ref("");
const customer = ref("");

const serviceButtonLabel = computed(() => {
  if (!service.value) {
    return "";
  }

  return (
    service.value.area[optionLabelWithLang.value] +
    ", " +
    service.value.type[optionLabelWithLang.value]
  );
});

const fetchTaskInfo = async (taskId) => {
  utilsStore.entity = "task";

  await getTaskFromApi(taskId).then((data) => {
    task.value = data;
    utilsStore.selectedElements["task"] = [task.value];
  });

  setSelectedContacts(mapContactsFromTasks(task.value));

  getContactInfo(task.value.contact_id);
  getCustomerInfo(task.value.customer_id);
  getServiceInfo(task.value.related_entity?.id);
};

fetchTaskInfo(route.params.id);

const location = computed(() => {
  if (!task.value.related_entity?.location) {
    return false;
  }

  const city = task.value.related_entity.location?.city
    ? task.value.related_entity.location.city[optionLabelWithLang.value]
    : "";

  const street = task.value.related_entity.location?.street
    ? task.value.related_entity.location.street[optionLabelWithLang.value]
    : "";

  const number = task.value.related_entity.location?.house_number
    ? task.value.related_entity.location.house_number
    : "";

  return `${street},  ${number}, ${city}`;
});

const getContactInfo = (contactId) => {
  getContactFromApi(contactId).then((data) => {
    contact.value = data;
  });
};

const getCustomerInfo = (customerId) => {
  getCustomerFromApi(customerId).then((data) => {
    customer.value = data;
  });
};

const getServiceInfo = (serviceId) => {
  getServiceFromApi(serviceId).then((data) => {
    service.value = data;
  });
};

const onSave = handleSubmit((values) => {
  updateTask(route.params.id, parseUpdateTask(values))
    .then(() => {
      toast.success({ message: "Notes updated successfully!" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating notes");
    });
});

// WATCHERS
watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value?.length;
  }
);
</script>

<style scoped lang="scss"></style>
