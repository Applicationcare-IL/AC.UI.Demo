<template>
  <WMInput
    :name="discount_type + uuidv4()"
    type="input-select-button"
    :highlighted="true"
    :options="saleDiscountOptions"
    :value="selectedDiscountOption"
    @update:selected-item="handleSelectedItem($event)"
  />
</template>

<script setup>
// IMPORTS
import { v4 as uuidv4 } from "uuid";
import { onMounted, ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

// REFS
const saleDiscountOptions = ref([
  { name: "Percent %", value: "percentage" },
  { name: "Amount ₪", value: "number" },
]);

const selectedDiscountOption = ref({});

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleSelectedItem = (item) => {
  selectedDiscountOption.value = item;
  modelValue.value = item.value;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (!modelValue.value) {
    selectedDiscountOption.value = saleDiscountOptions.value[0];
    modelValue.value = saleDiscountOptions.value[0].value;
    return;
  }

  selectedDiscountOption.value = saleDiscountOptions.value.find(
    (option) => option.value === modelValue.value
  );
});
</script>

<style scoped></style>
