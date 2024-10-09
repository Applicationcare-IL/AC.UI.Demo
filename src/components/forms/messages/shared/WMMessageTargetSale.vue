<template>
  <div v-if="loading" class="m-5">
    <ProgressSpinner />
  </div>
  <div v-else class="flex flex-column gap-3">
    <WMInputSearch
      v-model="selectedSale"
      name="sale"
      :highlighted="true"
      :required="true"
      :label="$t('message.project-type') + ':'"
      :options="sales"
      size="md"
      :placeholder="$t('message.select-project-type')"
      :option-set="true"
    />
    <WMInputSearch
      v-model="selectedSource"
      name="source"
      :highlighted="true"
      :required="true"
      :label="$t('message.project-type') + ':'"
      :options="sources"
      size="md"
      :placeholder="$t('message.select-project-type')"
      :option-set="true"
    />

    <WMInput
      name="tender"
      type="input-select-button"
      :highlighted="true"
      :label="$t('product.existing-product') + ':'"
      :options="yesNoOptions"
      :value="selectedTender"
      width="80"
    />
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
const props = defineProps({
  message: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const loading = ref(true);

const sales = ref();
const sources = ref();
const yesNoOptions = ref();

const selectedSale = ref();
const selectedSource = ref();
const selectedTender = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  sales.value = await optionSetsStore.getOptionSetValues("sales_type");
  sources.value = await optionSetsStore.getOptionSetValues("sales_source");
  yesNoOptions.value = await optionSetsStore.getOptionSetValues("yesNo");

  loading.value = false;
};

const selectExistingProduct = (existingProductFlag, yesNoOptions) => {
  return existingProductFlag
    ? yesNoOptions.find((option) => option.value === true)
    : yesNoOptions.find((option) => option.value === false);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadLazyData();

  if (props.message) {
    selectedSale.value = props.message.sale_type;
    selectedSource.value = props.message.sale_initiator;
    selectedTender.value = selectExistingProduct(props.message.tender, yesNoOptions.value);
  }
});
</script>

<style scoped></style>
