<template>
  <WMDetailFormSubHeader
    entity="customer"
    :form-key="formKey"
    @save-form="saveForm()"
    @deactivate-entity="handleDeactivateCustomer"
    @activate-entity="handleActivateCustomer"
    @refresh-table="refreshTable"
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

const { activateCustomer, deactivateCustomer } = useCustomers();

const handleActivateCustomer = (id) => {
  activateCustomer(id);
  detailCustomerForm.value.fetchData();
};

const handleDeactivateCustomer = (id) => {
  deactivateCustomer(id);
  detailCustomerForm.value.fetchData();
};

const refreshTable = () => {
  detailCustomerForm.value.fetchData();
};
</script>
