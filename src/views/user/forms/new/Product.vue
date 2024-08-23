<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewProductForm ref="newProductForm" />
</template>

<script setup>
useHead({
  title: "New Product",
});

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const newProductForm = ref(null);

const saveForm = () => {
  newProductForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "products" });
};
</script>
