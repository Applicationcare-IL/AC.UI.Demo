<template>
  <WMDetailFormSubHeader @save-form="saveForm()" :form-key="formKey" />
  <WMDetailProjectForm ref="detailProjectForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "Project Detail",
});

const formKey = ref("projectDetailForm");

const detailProjectForm = ref(null);

const saveForm = () => {
  detailProjectForm.value.onSave();
};
</script>
