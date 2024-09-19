<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewSaleForm ref="newSaleForm" />
</template>

<script setup>
useHead({
  title: "New Sale",
});

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const newSaleForm = ref(null);

const saveForm = () => {
  newSaleForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "sales" });
};
</script>
