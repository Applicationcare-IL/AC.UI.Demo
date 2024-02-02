<template>
  <div class="mobile-task-detail">
    <div
      class="mobile-task-detail-header my-2 ml-2 flex flex-row overflow-x-scroll"
    >
      <WMCompleteTasksButton entity="task" />
      <WMAssignOwnerButton entity="task" />
      <WMSendMessageButton :selected-elements="selectedElements" />
      <WMSendEmailButton :selected-elements="selectedElements" />
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
        name="address"
        type="info"
        :highlighted="true"
        :label="$t('address')"
        value="address"
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
        width="full"
      />

      <Button label="Save notes" class="mt-2" />
    </div>
    <div class="mobile-task-detail-footer flex flex-column gap-2 mx-3">
      <Button
        label="Service detail"
        size="large"
        class="w-full p-4"
        severity="success"
        @click="showServiceDetail = true"
      />

      <Dialog
        v-model:visible="showServiceDetail"
        modal
        header="Service detail"
        :dismissable-mask="true"
        :closable="true"
        :style="{ width: '100%' }"
      >
        SERVICE DETAIL
      </Dialog>

      <Button
        label="Contact detail"
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
        :style="{ width: '100%' }"
      >
        CONTACT DETAIL
      </Dialog>

      <Button
        label="Customer detail"
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
        :style="{ width: '100%' }"
      >
        CUSTOMER DETAIL
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

const task = ref("");
const selectedElements = ref(0);

// dialogs
const showServiceDetail = ref(false);
const showContactDetail = ref(false);
const showCustomerDetail = ref(false);

const route = useRoute();

const utilsStore = useUtilsStore();
const { setSelectedContacts } = useContacts();

const { getTaskFromApi, mapContactsFromTasks } = useTasks();

const fetchTasks = async (taskId) => {
  utilsStore.entity = "task";

  await getTaskFromApi(taskId).then((data) => {
    task.value = data;
    utilsStore.selectedElements["task"] = [task.value];
  });

  setSelectedContacts(mapContactsFromTasks(task.value));
};

fetchTasks(route.params.id);

// WATCHERS
watch(
  () => utilsStore.selectedElements[utilsStore.entity],
  (value) => {
    selectedElements.value = value?.length;
  }
);
</script>

<style scoped lang="scss"></style>
