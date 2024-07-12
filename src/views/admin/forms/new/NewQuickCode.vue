<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewQuickCodeForm ref="newAdminQuickCodeForm" />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRouter } from "vue-router";

// DEPENDENCIES
const router = useRouter();

// INJECT

// PROPS, EMITS

// REFS
const newAdminQuickCodeForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminQuickCodeForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminQuickCodes" });
};
</script>
