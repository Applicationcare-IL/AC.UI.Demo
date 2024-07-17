<template>
  <!-- Type text -->
  <InputText v-if="columnData.type == 'text'" v-model="modelValue" />
</template>
<script setup>
defineProps({
  columnData: Object,
});

const modelValue = defineModel();
</script>
