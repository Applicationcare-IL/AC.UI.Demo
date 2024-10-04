<template>
  <div class="flex">
    <WMButton :text="$t('buttons.add-products')" type="type-4" @click="showDialog">
      <template #customIcon>
        <div class="flex" v-html="ProductsIcon" />
      </template>
    </WMButton>
    <Divider layout="vertical" />
    <WMButton :text="$t('buttons.order')" type="save" @click="showDialog" />
  </div>

  <WMSaleProductSelectorDialog
    v-if="showSaleProductsSelectorDialog"
    v-model="showSaleProductsSelectorDialog"
    :sale="sale"
    @sale-products-added="handleSaleProductsAdded"
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import ProductsIcon from "/icons/products.svg?raw";

// DEPENDENCIES

// PROPS, EMITS
defineProps({
  sale: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["saleProductsAdded"]);

// REFS
const showSaleProductsSelectorDialog = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const showDialog = () => {
  showSaleProductsSelectorDialog.value = true;
};

const handleSaleProductsAdded = () => {
  emit("saleProductsAdded");
};

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
