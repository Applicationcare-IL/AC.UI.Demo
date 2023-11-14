<template>
  <WMDetailFormSubHeader :form-key="formKey"></WMDetailFormSubHeader>
  <WMDetailTaskForm :form-key="formKey"></WMDetailTaskForm>
</template>

<script setup>
import { ref } from "vue";

const formKey = ref("taskDetailForm");
</script>
