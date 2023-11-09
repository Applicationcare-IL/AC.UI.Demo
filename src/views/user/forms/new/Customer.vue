<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewCustomerForm ref="newCustomerForm" />
</template>

<script setup>
import { ref } from "vue";

import WMNewCustomerForm from "@/components/forms/WMNewCustomerForm.vue";
import WMNewFormSubHeader from "@/components/layout/WMNewFormSubHeader.vue";

import { useRouter } from "vue-router";
const router = useRouter();

const newCustomerForm = ref(null);

const saveForm = () => {
  newCustomerForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "customers" });
};
</script>
