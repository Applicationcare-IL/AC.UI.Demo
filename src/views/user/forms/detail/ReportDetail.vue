<template>
  <WMDetailFormSubHeader
    entity="report"
    :form-key="formKey"
    :show-message-button="false"
    :show-email-button="false"
    :show-assign-owner-button="false"
    :show-save-button="false"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  >
    <template #custom-buttons>
      <WMButton :text="$t('export')" type="type-5" @click="handleExportReport">
        <template #customIcon>
          <div class="flex" v-html="ExportIcon" />
        </template>
      </WMButton>
    </template>
  </WMDetailFormSubHeader>

  <WMReportDetailForm ref="reportForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

import ExportIcon from "/icons/export.svg?raw";

useHead({
  title: "Report Detail",
});

const formKey = ref("reportDetailForm");

const reportForm = ref(null);

const handleExportReport = () => {
  reportForm.value.handleExportReport();
};
</script>
