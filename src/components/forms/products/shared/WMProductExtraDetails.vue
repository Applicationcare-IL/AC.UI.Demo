<template>
  <Skeleton v-if="loading" width="100%" height="120px" />
  <div class="flex flex-column gap-5">
    <div class="flex flex-wrap gap-5">
      <WMInput
        name="crm"
        required
        type="input-text"
        :label="$t('product.crm-id') + ':'"
        size="sm"
        :value="product.crm"
      />
      <WMInput
        name="erp"
        required
        type="input-text"
        :label="$t('product.erp-id') + ':'"
        size="sm"
        :value="product.erp"
      />
      <WMInput
        name="expenses_card"
        type="input-text"
        :label="$t('product.expenses-card') + ':'"
        size="sm"
      />
      <WMInput
        name="incomes_card"
        required
        type="input-text"
        :label="$t('product.incomes-card') + ':'"
        size="sm"
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
defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const loading = ref(true);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  loading.value = false;
});
</script>

<style scoped></style>
