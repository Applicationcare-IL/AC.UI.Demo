<template>
  <WMDetailFormSubHeader
    entity="product"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  />
  <WMDetailProductForm
    v-if="product"
    ref="detailProductForm"
    :form-key="formKey"
    :product="product"
  />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getProduct } = useProducts();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminUserDetailForm");
const detailProductForm = ref();
const product = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Product Detail",
});

const loadLazyData = async () => {
  product.value = await getProduct(route.params.id);

  utilsStore.selectedElements["product"] = [product.value];
};

utilsStore.entity = "product";

loadLazyData();

const saveForm = () => {
  detailProductForm.value.onSave();
};
// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
