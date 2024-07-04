<template>
  <span>Products</span>
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

// COMPUTED

// COMPONENT METHODS AND LOGIC
const fetchProducts = async () => {
  products.value = await getProducts();
};

fetchProducts();
// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
