<template>
  <WMDetailFormSubHeader @save-form="saveForm()" :form-key="formKey" />
  <WMDetailTaskForm ref="detailTaskForm" :form-key="formKey"></WMDetailTaskForm>
</template>

<script setup>
import { ref } from "vue";

const formKey = ref("taskDetailForm");

const detailTaskForm = ref(null);

const saveForm = () => {
  console.log("saveForm");
  detailTaskForm.value.onSave();
};
</script>
