<template>
  <WMDetailFormSubHeader
    entity="admin-report"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  />
  <WMDetailAdminReportForm ref="detailAdminReportForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Report Detail",
});

const formKey = ref("adminReportDetailForm");

const detailAdminReportForm = ref(null);

const saveForm = () => {
  detailAdminReportForm.value.onSave();
};

const refreshTable = () => {
  detailAdminReportForm.value.fetchData();
};
</script>
