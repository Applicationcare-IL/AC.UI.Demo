<template>
  <WMDetailFormSubHeader :form-key="formKey" @save-form="saveForm()" />
  <WMBudgetProjectForm ref="detailProjectBudgetForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Project Budget Detail",
});

const formKey = ref("projectBudgetDetailForm");

const detailProjectBudgetForm = ref(null);

const saveForm = () => {
  detailProjectBudgetForm.value.onSave();
};
</script>
