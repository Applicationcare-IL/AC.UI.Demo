<template>
  <WMCustomerProductsTable
    :products="customerProducts"
    :loading="loadingCustomerProducts"
    :total-records="totalCustomerProducts"
    preview
    @update:page="currentCustomerProductsPage = $event"
    @update:search="handleUpdateSearchValue($event)"
  />
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES
const { getSaleCustomerProducts } = useSales();

// INJECT

// PROPS, EMITS
const props = defineProps({
  customer: {
    type: Object,
    required: true,
  },
});

// REFS
const currentCustomerProductsPage = ref(0);
const loadingCustomerProducts = ref(true);
const totalCustomerProducts = ref(0);
const customerProducts = ref([]);
const searchValue = ref("");

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadCustomerProducts = async () => {
  loadingCustomerProducts.value = true;

  const nextPage = currentCustomerProductsPage.value + 1;

  const params = new URLSearchParams({
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  if (searchValue.value) {
    params.append("search", searchValue.value);
  }

  let response = await getSaleCustomerProducts(props.customer.id, params);

  customerProducts.value = response.data;
  totalCustomerProducts.value = response.totalRecords;
  loadingCustomerProducts.value = false;
};

const handleUpdateSearchValue = (value) => {
  searchValue.value = value;
  loadCustomerProducts();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadCustomerProducts();
});
</script>

<style scoped></style>
