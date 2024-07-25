<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewUserForm ref="newAdminUserForm" />
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
const newAdminUserForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminUserForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminUsers" });
};
</script>
