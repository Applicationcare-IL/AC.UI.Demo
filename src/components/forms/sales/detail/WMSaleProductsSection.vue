<template>
  <div class="flex mt-1 mb-3 custom-selectable-button-group-tabs">
    <WMSelectableButtonGroup
      :options="options"
      :value="selectedOption"
      no-icon
      @update:selected-option="changeSelectedOption"
    />
  </div>

  <WMProductsInSaleTable
    v-if="selectedOption === 'products-in-sale'"
    :sale="sale"
    selectable
    preview
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  sale: {
    type: Object,
    required: true,
  },
});

// REFS
const options = ref([
  {
    label: "Products in sale",
    value: "products-in-sale",
  },
  {
    label: "Customers products",
    value: "customers-products",
  },
]);

const selectedOption = ref(options.value[0].value);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const changeSelectedOption = (value) => {
  selectedOption.value = value.value;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
