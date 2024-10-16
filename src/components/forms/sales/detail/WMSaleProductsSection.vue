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

  <WMCustomerProductsTable
    v-if="selectedOption === 'customers-products'"
    :products="customerProducts"
    :loading="loadingCustomerProducts"
    :total-records="totalCustomerProducts"
    preview
    @update:page="currentCustomerProductsPage = $event"
    @update:search="handleUpdateCustomerProductSearchValue($event)"
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

const currentCustomerProductsPage = ref(0);
const loadingCustomerProducts = ref(true);
const totalCustomerProducts = ref(0);
const customerProducts = ref([]);
const customerProductSearchValue = ref("");

// COMPUTED

// COMPONENT METHODS AND LOGIC
const changeSelectedOption = (value) => {
  selectedOption.value = value.value;
};

const loadCustomerProducts = async () => {
  loadingCustomerProducts.value = true;

  const nextPage = currentCustomerProductsPage.value + 1;

  const params = new URLSearchParams({
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  if (customerProductSearchValue.value) {
    params.append("search", customerProductSearchValue.value);
  }

  let response = await getSaleCustomerProducts(props.sale.customer.id, params);

  customerProducts.value = response.data;
  totalCustomerProducts.value = response.totalRecords;
  loadingCustomerProducts.value = false;
};

const handleUpdateCustomerProductSearchValue = (value) => {
  customerProductSearchValue.value = value;
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
