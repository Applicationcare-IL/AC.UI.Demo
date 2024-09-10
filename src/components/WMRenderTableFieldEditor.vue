<template>
  modelValue {{ modelValue }}
  <!-- Type text -->
  <InputText v-if="columnData.type == 'text'" v-model="modelValue" />
  <!-- Product discount type -->
  <template v-if="columnData.type == 'product-discount-type'">
    <WMInput
      name="discount_type"
      type="input-select-button"
      :highlighted="true"
      :options="saleDiscountOptions"
      :value="selectedDiscountOption"
      width="80"
      @update:selected-item="handleSelectedItem($event)"
    />
  </template>
</template>
<script setup>
import { ref } from "vue";
defineProps({
  columnData: Object,
});

const modelValue = defineModel();

const saleDiscountOptions = ref([
  { name: "Percent %", value: "percentage" },
  { name: "Amount ₪", value: "number" },
]);

const selectedDiscountOption = ref(saleDiscountOptions.value[0]);
modelValue.value = selectedDiscountOption.value.value;

const handleSelectedItem = (item) => {
  selectedDiscountOption.value = item;
  modelValue.value = item.value;
};
</script>
