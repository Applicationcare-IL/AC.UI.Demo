<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewUserForm ref="newContactForm" />
</template>

<script setup>
// import { ref } from "vue";

// import { useRouter } from "vue-router";
// const router = useRouter();

// const newContactForm = ref(null);

// const saveForm = () => {
//   newContactForm.value.onSubmit();
// };

// const cancelForm = () => {
//   router.push({ name: "contacts" });
// };
</script>
