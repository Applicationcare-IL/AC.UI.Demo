<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewServiceForm ref="newContactForm" />
</template>

<script setup>
import { ref } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

const newServiceForm = ref(null);

const saveForm = () => {
  newServiceForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "services" });
};
</script>
