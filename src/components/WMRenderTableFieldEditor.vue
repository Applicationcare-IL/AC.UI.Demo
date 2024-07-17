<template>
  <!-- Type text -->
  <InputText v-model="modelValue" />
</template>
<script setup>
defineProps({
  type: String,
  value: String,
});

const modelValue = defineModel();
</script>
