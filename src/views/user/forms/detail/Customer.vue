<template>
  <WMDetailFormSubHeader
    @save-form="saveForm()"
    @updateEntityState="updateEntityState"
    :form-key="formKey"
  />
  <WMDetailCustomerForm ref="detailCustomerForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";
import { CustomerService } from "@/service/CustomerService";

const formKey = ref("customerDetailForm");

const detailCustomerForm = ref(null);

const saveForm = () => {
  detailCustomerForm.value.onSave();
};

const updateEntityState = (id, state) => {
  console.log("updateEntityState", state);
  CustomerService.updateState(id, state);
};
</script>
