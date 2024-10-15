<template>
  <div class="flex">
    <WMButton
      :text="$t('buttons.order')"
      type="save"
      :disabled="state"
      :is-disabled="state"
      @click="showDialog"
    />
  </div>

  <WMOrderSaleProductsSelectorDialog
    v-if="showOrderSaleProductsSelectorDialog"
    v-model="showOrderSaleProductsSelectorDialog"
    :sale="sale"
    @sale-products-ordered="handleSaleProductsOrdered"
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// PROPS, EMITS
defineProps({
  sale: {
    type: Object,
    default: null,
  },
  state: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["saleProductsOrdered"]);

// REFS
const showOrderSaleProductsSelectorDialog = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const showDialog = () => {
  showOrderSaleProductsSelectorDialog.value = true;
};

const handleSaleProductsOrdered = () => {
  emit("saleProductsOrdered");
};

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
