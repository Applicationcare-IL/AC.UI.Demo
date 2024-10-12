<template>
  <!-- Type text -->
  <InputText v-if="columnData.type == 'text'" v-model="modelValue" />
  <!-- Type number -->
  <InputNumber v-if="columnData.type == 'number'" v-model="modelValue" />
  <!-- Product discount type -->
  <template v-if="columnData.type == 'product-discount-type'">
    <WMProductDiscountEditorField v-model="modelValue" />
  </template>
  <!-- Product relationship type -->
  <template v-if="columnData.type == 'product-relationship-type'">
    <WMProductRelationshipTypeEditorField v-model="modelValue" />
  </template>
  <!-- Currency -->
  <template v-if="columnData.type == 'currency'">
    <WMInputCurrency v-model="modelValue" :name="columnData.field" :read-only="false" />
  </template>
  <!-- Product discount -->
  <template v-if="columnData.type == 'product-discount'">
    <InputNumber v-model="modelValue.quantity" />
  </template>
  <!-- Product in sale status -->
  <template v-if="columnData.type == 'product-in-sale-status'">
    <WMProductsInSaleTableStatusFieldEditor v-model="modelValue" />
  </template>
</template>
<script setup>
defineProps({
  columnData: Object,
});

const modelValue = defineModel();
</script>
