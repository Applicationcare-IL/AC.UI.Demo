<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewUserForm ref="newAdminUserForm" />
</template>

<script setup>
import { ref } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

const newAdminUserForm = ref(null);

const saveForm = () => {
  newAdminUserForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "adminUsers" });
};
</script>
