<template>
  <WMDetailFormSubHeader @save-form="saveForm()" :form-key="formKey" />
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
</script>
