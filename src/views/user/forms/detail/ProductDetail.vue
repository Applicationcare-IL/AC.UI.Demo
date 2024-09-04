<template>
  <WMDetailFormSubHeader
    entity="product"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
    <template #top-left>
      <WMButton
        v-if="isActive"
        :text="$t('buttons.activate')"
        type="secondary"
        @click="activateProductFunc()"
      />
      <WMButton
        v-if="isNotActive"
        :text="$t('buttons.deactivate')"
        type="secondary"
        @click="deactivateProductFunc()"
      />
    </template>
    <template #custom-buttons>
      <WMDuplicateProductButton :product="product" />
      <WMNewProductVersionButton :product="product" />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailProductForm
    v-if="product"
    ref="detailProductForm"
    :form-key="formKey"
    :product="product"
    @product-updated="loadLazyData()"
  />
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getProduct, activateProduct, deactivateProduct } = useProducts();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
const isActive = ref();
const isNotActive = ref();

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

  if (product.value.state.value === "active") isNotActive.value = true;
  if (product.value.state.value === "not_active") isActive.value = true;

  utilsStore.selectedElements["product"] = [product.value];
};

const saveForm = () => {
  detailProductForm.value.onSave();
};

const activateProductFunc = () => {
  activateProduct([product.value.id])
    .then(() => {
      isActive.value = !isActive.value;
      isNotActive.value = !isNotActive.value;
      loadLazyData();
    })
    .catch((error) => {
      console.error(error);
    });
};

const deactivateProductFunc = () => {
  deactivateProduct(product.value.id)
    .then(() => {
      isActive.value = !isActive.value;
      isNotActive.value = !isNotActive.value;
      loadLazyData();
    })
    .catch((error) => {
      console.error(error);
    });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  utilsStore.entity = "product";
  await loadLazyData();
});
</script>
