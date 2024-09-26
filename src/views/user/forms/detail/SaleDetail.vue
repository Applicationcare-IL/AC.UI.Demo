<template>
  <WMDetailFormSubHeader
    entity="sale"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
    <template #top-left> Cancel button </template>
    <template #custom-buttons> Waiting for customer button </template>
  </WMDetailFormSubHeader>
  <!-- <pre>{{ sale }}</pre> -->
  <WMDetailSaleForm
    v-if="sale"
    ref="detailSaleForm"
    :form-key="formKey"
    :sale="sale"
    @sale-updated="loadLazyData()"
  />
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getSale } = useSales();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("saleDetailForm");
const detailSaleForm = ref();
const sale = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Sale Detail",
});

const loadLazyData = async () => {
  sale.value = await getSale(route.params.id);

  utilsStore.selectedElements["sale"] = [sale.value];
};

const saveForm = () => {
  detailSaleForm.value.onSave();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  utilsStore.entity = "sale";
  await loadLazyData();
});
</script>
