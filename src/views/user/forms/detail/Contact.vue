<template>
  <WMDetailFormSubHeader @save-form="saveForm()" :form-key="formKey" />
  <WMDetailContactForm ref="detailContactForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

const formKey = ref("contactDetailForm");
const detailContactForm = ref(null);

const saveForm = () => {
  detailContactForm.value.onSave();
};
</script>
