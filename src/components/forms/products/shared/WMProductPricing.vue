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

      <WMInput
        name="discount_type"
        type="input-select-button"
        :highlighted="true"
        :label="$t('product.sale-discount') + ':'"
        :options="saleDiscountOptions"
        :value="selectedDiscountOption"
        width="80"
        @update:selected-item="selectedDiscountOption = $event"
      />

      <WMInput
        v-if="
          selectedDiscountOption.value === 'percentage' || selectedDiscountOption.value === 'number'
        "
        v-model="amount"
        :value="amount"
        type="input-number"
        :label="$t('product.amount') + ':'"
        name="amount"
        :width="40"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

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

const saleDiscountOptions = ref([
  { name: "None", value: "none" },
  { name: "Percent %", value: "percentage" },
  { name: "Amount ₪", value: "number" },
]);

const selectedDiscountOption = ref(saleDiscountOptions.value[0]);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (props.product.discount_type) {
    selectedDiscountOption.value = saleDiscountOptions.value.find(
      (option) => option.value === props.product.discount_type
    );
    amount.value = props.product.discount_number;
  }
});
</script>

<style scoped></style>
