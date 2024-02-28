<template>
  <WMDetailFormSubHeader
    :form-key="formKey"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  />
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

const refreshTable = () => {
  detailProjectBudgetForm.value.fetchData();
};
</script>
