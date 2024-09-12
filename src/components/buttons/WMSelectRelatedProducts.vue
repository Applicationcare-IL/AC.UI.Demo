<template>
  <WMButton :text="$t('buttons.link-related-products')" type="type-4" @click="showDialog">
    <template #customIcon>
      <div class="flex" v-html="ProductsIcon" />
    </template>
  </WMButton>

  <WMRelatedProductSelectorDialog
    v-if="showDocumentsSelectorDialog"
    v-model="showDocumentsSelectorDialog"
    @select-documents="handleSelectDocuments"
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import ProductsIcon from "/icons/products.svg?raw";

// DEPENDENCIES

// PROPS, EMITS

// REFS

const showDocumentsSelectorDialog = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const showDialog = () => {
  // showDocumentsSelectorDialog.value = true;
};

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
