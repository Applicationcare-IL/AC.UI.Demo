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

useHead({
  title: "Customer Detail",
});

const formKey = ref("customerDetailForm");

const detailCustomerForm = ref(null);

const saveForm = () => {
  detailCustomerForm.value.onSave();
};

const { updateState } = useCustomers();

const updateEntityState = (id, state) => {
  updateState(id, state);
};
</script>
