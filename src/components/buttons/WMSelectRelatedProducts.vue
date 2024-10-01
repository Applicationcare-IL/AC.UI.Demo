<template>
  <WMButton :text="$t('buttons.link-related-products')" type="type-4" @click="showDialog">
    <template #customIcon>
      <div class="flex" v-html="ProductsIcon" />
    </template>
  </WMButton>

  <WMRelatedProductSelectorDialog
    v-if="showRelatedProductsSelectorDialog"
    v-model="showRelatedProductsSelectorDialog"
    :product="product"
    @related-products-added="handleRelatedProductsAdded"
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import ProductsIcon from "/icons/products.svg?raw";

// DEPENDENCIES

// PROPS, EMITS
defineProps({
  product: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["relatedProductsAdded"]);

// REFS
const showRelatedProductsSelectorDialog = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const showDialog = () => {
  showRelatedProductsSelectorDialog.value = true;
};

const handleRelatedProductsAdded = () => {
  emit("relatedProductsAdded");
};

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
