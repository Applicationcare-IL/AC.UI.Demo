<template>
  <Skeleton v-if="loading" width="100%" height="196px" />
  <div v-else class="flex flex-column gap-5">
    <div class="flex gap-5">
      <WMInput
        v-if="productTypes"
        name="product_type"
        :highlighted="true"
        type="input-select"
        :label="$t('product.product-type') + ':'"
        :options="productTypes"
        :placeholder="$t('select', ['product.product-type'])"
        size="sm"
        option-set
        data-testid="product.form.product-type"
        required
        :value="product?.type"
      />

      <WMInput
        v-if="productFamilies"
        name="product_family"
        :highlighted="true"
        type="input-select"
        :label="$t('product.product-family') + ':'"
        :options="productFamilies"
        :placeholder="$t('select', ['product.product-family'])"
        size="sm"
        option-set
        data-testid="product.form.product-family"
        required
        :value="product?.family"
      />

      <WMInput
        v-if="productGroups"
        name="product_group"
        :highlighted="true"
        type="input-select"
        :label="$t('product.product-group') + ':'"
        :options="productGroups"
        :placeholder="$t('select', ['product.product-group'])"
        size="sm"
        option-set
        data-testid="product.form.product-group"
        required
        :value="product?.group"
      />

      <WMInput
        v-if="productDepartments"
        name="product_department"
        :highlighted="true"
        type="input-select"
        :label="$t('product.product-department') + ':'"
        :options="productDepartments"
        :placeholder="$t('select', ['product.product-department'])"
        size="sm"
        option-set
        data-testid="product.form.product-department"
        required
        :value="product?.department"
      />
    </div>
    <div class="flex gap-5">
      product?.valid_until {{ product?.valid_until }}
      <WMInput
        type="date"
        :label="$t('product.valid-till') + ':'"
        name="valid_until"
        required
        :value="product?.valid_until"
      />
      <WMInput type="date" :label="$t('product.eol') + ':'" name="eol" :value="product?.eol" />
      <WMInput type="date" :label="$t('product.eos') + ':'" name="eos" :value="product?.eos" />
    </div>
    <div class="flex gap-5">
      <WMInput
        v-if="billingTypes"
        name="billing_type"
        :highlighted="true"
        type="input-select"
        :label="$t('product.billing-type') + ':'"
        :options="productTypes"
        :placeholder="$t('select', ['product.billing-type'])"
        size="sm"
        option-set
        data-testid="product.form.billing-type"
        required
        :value="product?.billing_type"
      />

      <WMInput
        v-if="renewalTypes"
        name="renewal_type"
        :highlighted="true"
        type="input-select"
        :label="$t('product.renewal-type') + ':'"
        :options="renewalTypes"
        :placeholder="$t('select', ['product.renewal-type'])"
        size="sm"
        option-set
        data-testid="product.form.renewal-type"
        required
        :value="product?.renewal_type"
      />

      <WMInput
        v-if="cancellationTypes"
        name="cancellation_type"
        :highlighted="true"
        type="input-select"
        :label="$t('product.cancellation-type') + ':'"
        :options="cancellationTypes"
        :placeholder="$t('select', ['product.cancellation-type'])"
        size="sm"
        option-set
        data-testid="product.form.cancellation-type"
        required
        :value="product?.cancellation_type"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

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

const productTypes = ref(null);
const productFamilies = ref(null);
const productGroups = ref(null);
const productDepartments = ref(null);

const billingTypes = ref(null);
const renewalTypes = ref([]);
const cancellationTypes = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  productTypes.value = await optionSetsStore.getOptionSetValues("product_type");
  productFamilies.value = await optionSetsStore.getOptionSetValues("product_family");
  productGroups.value = await optionSetsStore.getOptionSetValues("product_group");
  productDepartments.value = await optionSetsStore.getOptionSetValues("product_department");

  billingTypes.value = await optionSetsStore.getOptionSetValues("billing_type");
  renewalTypes.value = await optionSetsStore.getOptionSetValues("renewal_type");
  cancellationTypes.value = await optionSetsStore.getOptionSetValues("cancellation_type");

  loading.value = false;
});
</script>

<style scoped></style>
