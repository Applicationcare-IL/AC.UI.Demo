<template>
  <WMDetailFormSubHeader @save-form="saveForm()" :form-key="formKey" />
  <WMDetailProjectForm ref="detailProjectForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

const formKey = ref("projectDetailForm");

const detailProjectForm = ref(null);

const saveForm = () => {
  detailProjectForm.value.onSave();
};
</script>
