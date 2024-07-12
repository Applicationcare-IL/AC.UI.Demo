<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewMessageForm ref="newAdminMessageForm" />
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
const newAdminMessageForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminMessageForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminMessages" });
};
</script>
