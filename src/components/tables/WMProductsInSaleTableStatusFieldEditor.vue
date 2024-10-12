<template>
  <Dropdown
    v-if="productStatuses.length"
    v-model="modelValue"
    :options="productStatuses"
    :option-label="optionLabelWithLang"
    placeholder="Select a Status"
    :class="`p-dropdown-sale-product-status p-dropdown-sale-product-status--${modelValue.value}`"
  >
    <template #option="slotProps">
      {{ slotProps.option[optionLabelWithLang] }}
    </template>
  </Dropdown>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

// REFS
const productStatuses = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  productStatuses.value = await optionSetsStore.getOptionSetValues("product_offered_status");
});
</script>

<style scoped></style>
