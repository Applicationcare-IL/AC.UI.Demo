<template>
  <WMDetailFormSubHeader
    entity="milestone"
    :form-key="formKey"
    :show-message-button="false"
    :show-email-button="false"
    :show-assign-owner-button="false"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  >
    <template #custom-buttons>
      <WMCompleteMilestoneButton @milestone-completed="refreshTable" />
    </template>
  </WMDetailFormSubHeader>

  <WMDetailProjectMilestoneForm ref="projectMilestoneForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Project milestone Detail",
});

const formKey = ref("budgetItemDetailForm");

const projectMilestoneForm = ref(null);

const saveForm = () => {
  projectMilestoneForm.value.onSave();
};

const refreshTable = () => {
  projectMilestoneForm.value.fetchData();
};
</script>
