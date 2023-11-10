<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()" />
  <WMNewTaskForm ref="newTaskForm"></WMNewTaskForm>
</template>

<script setup>
import { ref } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

const newTaskForm = ref(null);

const saveForm = () => {
  newTaskForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({ name: "tasks" });
};
</script>
