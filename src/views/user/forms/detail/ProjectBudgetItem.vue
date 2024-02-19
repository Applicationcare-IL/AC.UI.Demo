<template>
  <WMDetailFormSubHeader
    :form-key="formKey"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
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
</script>
