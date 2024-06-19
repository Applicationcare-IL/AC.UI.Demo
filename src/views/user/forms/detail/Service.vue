<template>
  <WMDetailFormSubHeader
    entity="service"
    :form-key="formKey"
    @save-form="saveForm()"
    @refresh-table="refreshTable"
  />
  <WMDetailServiceForm ref="detailServiceForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Service Detail",
});

const formKey = ref("serviceDetailForm");

const detailServiceForm = ref(null);

const saveForm = () => {
  detailServiceForm.value.onSave();
};

const refreshTable = () => {
  detailServiceForm.value.fetchData();
};
</script>
