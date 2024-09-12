<template>
  <!-- {{ modelValue }} -->
  <!-- Type text -->
  <InputText v-if="columnData.type == 'text'" v-model="modelValue" />
  <!-- Product discount type -->
  <template v-if="columnData.type == 'product-discount-type'">
    <WMProductDiscountEditorField v-model="modelValue" />
  </template>
  <!-- Product relationship type -->
  <template v-if="columnData.type == 'product-relationship-type'">
    <WMProductRelationshipTypeEditorField v-model="modelValue" />
  </template>
</template>
<script setup>
defineProps({
  columnData: Object,
});

const modelValue = defineModel();
</script>
