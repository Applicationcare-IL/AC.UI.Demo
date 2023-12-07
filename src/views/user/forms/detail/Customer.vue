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

const formKey = ref("customerDetailForm");

const detailCustomerForm = ref(null);

const saveForm = () => {
  detailCustomerForm.value.onSave();
};

const { updateState } = useCustomers();

const updateEntityState = (id, state) => {
  console.log("updateEntityState", state);
  updateState(id, state);
};
</script>
