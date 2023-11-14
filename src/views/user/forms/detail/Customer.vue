<template>
  <WMDetailFormSubHeader @save-form="saveForm()" :form-key="formKey" />
  <WMDetailCustomerForm ref="detailCustomerForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

const formKey = ref("customerDetailForm");

const detailCustomerForm = ref(null);

const saveForm = () => {
  detailCustomerForm.value.onSave();
};
</script>
