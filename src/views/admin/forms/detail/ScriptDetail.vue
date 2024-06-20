<template>
  <WMDetailFormSubHeader
    entity="script"
    :form-key="formKey"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  />
  <WMDetailScriptForm ref="detailScriptForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Script Detail",
});

const formKey = ref("assetDetailForm");

const detailScriptForm = ref(null);

const saveForm = () => {
  detailScriptForm.value.onSave();
};

const refreshTable = () => {
  detailScriptForm.value.fetchData();
};
</script>
