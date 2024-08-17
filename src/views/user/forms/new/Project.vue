<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewProjectForm ref="newProjectForm" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const newProjectForm = ref(null);

const saveForm = () => {
  newProjectForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "projects" });
};
</script>
