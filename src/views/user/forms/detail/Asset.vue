<template>
  <WMDetailFormSubHeader
    entity="asset"
    :form-key="formKey"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  />
  <WMDetailAssetForm ref="detailAssetForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Asset Detail",
});

const formKey = ref("assetDetailForm");

const detailAssetForm = ref(null);

const saveForm = () => {
  detailAssetForm.value.onSave();
};

const refreshTable = () => {
  detailAssetForm.value.fetchData();
};
</script>
