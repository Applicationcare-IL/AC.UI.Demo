<template>
  <WMDetailFormSubHeader
    entity="budget-item"
    :form-key="formKey"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  />
  <WMDetailBudgetItemForm ref="detailBudgetItemForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Budget item Detail",
});

const formKey = ref("budgetItemDetailForm");

const detailBudgetItemForm = ref(null);

const saveForm = () => {
  detailBudgetItemForm.value.onSave();
};

const refreshTable = () => {
  detailBudgetItemForm.value.fetchData();
};
</script>
