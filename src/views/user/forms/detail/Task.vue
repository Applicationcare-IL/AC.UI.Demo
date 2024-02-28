<template>
  <WMDetailFormSubHeader
    :form-key="formKey"
    @save-form="saveForm()"
    @task-completed="refreshTask()"
  />
  <WMDetailTaskForm ref="detailTaskForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Task Detail",
});

const formKey = ref("taskDetailForm");

const detailTaskForm = ref(null);

const saveForm = () => {
  detailTaskForm.value.onSave();
};

const refreshTask = () => {
  detailTaskForm.value.loadTask();
};
</script>
