<template>
  <div class="flex gap-2">
    <WMSelectableButtonGroup
      :options="options"
      :value="selectedOption"
      no-icon
      @update:selected-option="changeSelectedOption"
    />
  </div>

  {{ selectedOption }}
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

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
