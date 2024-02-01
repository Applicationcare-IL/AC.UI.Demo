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
    {{ task }}
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

const task = ref("");
const selectedElements = ref(0);

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
