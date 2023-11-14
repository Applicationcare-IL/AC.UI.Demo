<template>
  <WMDetailFormSubHeader @save-form="saveForm()" :form-key="formKey" />
  <WMDetailServiceForm ref="detailServiceForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

const formKey = ref("serviceDetailForm");

const detailServiceForm = ref(null);

const saveForm = () => {
  detailServiceForm.value.onSave();
};
</script>
