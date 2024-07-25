<template>
  <WMDetailFormSubHeader
    entity="admin-report"
    :form-key="formKey"
    :show-sub-bar="false"
    :has-action-builder="false"
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
