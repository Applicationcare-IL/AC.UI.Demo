<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewRoleForm ref="newAdminRoleForm" />
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
const newAdminRoleForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminRoleForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminRoles" });
};
</script>