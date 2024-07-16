<template>
  <span>Products</span>
  {{ totalRecords }}
  <pre>
  {{ products }}
  </pre>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES
const { getProducts } = useProducts();

// INJECT

// PROPS, EMITS

// REFS
const products = ref([]);
const totalRecords = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const response = await getProducts();

  products.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();
// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
