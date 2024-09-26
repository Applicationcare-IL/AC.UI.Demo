<template>
  <WMDetailFormSubHeader
    entity="customer"
    :form-key="formKey"
    @save-form="saveForm()"
    @deactivate-entity="handleDeactivateCustomer"
    @activate-entity="handleActivateCustomer"
    @refresh-table="refreshTable"
  >
    <template #bottom-left>
      <WMMessagesButton :id="route.params.id" entity="customer" />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailCustomerForm ref="detailCustomerForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";

// DEPENDENCIES
const route = useRoute();
const { activateCustomer, deactivateCustomer } = useCustomers();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("customerDetailForm");
const detailCustomerForm = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Customer Detail",
});

const saveForm = () => {
  detailCustomerForm.value.onSave();
};

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

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
