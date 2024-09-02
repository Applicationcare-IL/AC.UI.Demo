<template>
  <div class="flex flex-column gap-5">
    <div class="flex gap-5">
      <WMInputCurrency
        v-model="basePrice"
        required
        :label="$t('product.base-price') + ':'"
        name="price"
        :small="true"
      />

      {{ selectedDiscountOption }}
      <WMInput
        name="sale_discount"
        type="input-select-button"
        :highlighted="true"
        :label="$t('product.sale-discount') + ':'"
        :options="saleDiscountOptions"
        :value="saleDiscountOptions[0]"
        width="80"
        @update:selected-item="selectedDiscountOption = $event.value"
      />

      <WMInputCurrency
        v-if="selectedDiscountOption === 'amount'"
        v-model="amount"
        required
        :label="$t('product.amount') + ':'"
        name="amount"
        :small="true"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const basePrice = ref(props.product.base_price);
const amount = ref(props.product.amount);
const selectedDiscountOption = ref("none");

const saleDiscountOptions = ref([
  { name: "None", value: "none" },
  { name: "Percent %", value: "percent" },
  { name: "Amount ₪", value: "amount" },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
