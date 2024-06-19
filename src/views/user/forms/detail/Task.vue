<template>
  <WMDetailFormSubHeader
    entity="task"
    :form-key="formKey"
    @save-form="saveForm()"
    @task-completed="refreshTask"
    @refresh-table="refreshTask"
  >
    <template #custom-secondary-buttons>
      <WMCancelButton
        v-if="can('tasks.cancel')"
        :is-disabled="!isTaskCancellable"
        size="small"
        @click="handleCancelTasks"
      />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailTaskForm ref="detailTaskForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { cancelTask } = useTasks();
const utilsStore = useUtilsStore();
const dialog = useDialog();
const toast = useToast();
const { t } = useI18n();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const selectedTask = ref(null);
const formKey = ref("taskDetailForm");
const detailTaskForm = ref(null);

// COMPUTED
const isTaskCancellable = computed(() => {
  return (
    selectedTask.value &&
    selectedTask.value.status.value !== "canceled" &&
    selectedTask.value.status.value !== "completed" &&
    selectedTask.value.status.value !== "closed"
  );
});

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Task Detail",
});

const handleCancelTasks = async () => {
  if (selectedTask.value && !isTaskCancellable.value) return;

  let response = await dialog.confirmCancelTask();

  if (response) {
    cancelTask(selectedTask.value.id).then(() => {
      refreshTask();
    });

    toast.info({
      message: t("task.toast-task-cancelled-message"),
      title: t("task.toast-task-cancelled-title"),
      life: 5000,
      group: "br",
    });
  }
};

const saveForm = () => {
  detailTaskForm.value.onSave();
};

const refreshTask = () => {
  detailTaskForm.value.loadTask();
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => utilsStore.selectedElements["task"],
  (value) => {
    selectedTask.value = value[0];
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
