<template>
  <WMButton :text="$t('buttons.duplicate')" type="type-5" @click="toggle">
    <template #customIcon>
      <div class="flex" v-html="DuplicateIcon" />
    </template>
  </WMButton>

  <OverlayPanel
    ref="isOpen"
    style="max-width: 400px"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-2">
      <span class="h4"> {{ $t("product.duplicate-product") }} </span>

      <p class="text-base">
        {{ $t("product.duplicate-text-part-one") }}
        <router-link :to="{ name: 'productDetail', params: { id: product.id } }">
          {{ product.name }}
        </router-link>
        {{ $t("product.duplicate-text-part-two") }}
      </p>

      <WMInput
        v-model="productName"
        :value="productName"
        type="input-text"
        name="name"
        :label="$t('product.name') + ':'"
        required
        size="md"
      />

      <div class="flex gap-2">
        <WMButton
          class="mt-3"
          :text="$t('buttons.save-duplication')"
          type="primary"
          @click="handleDuplicateProduct"
        />
        <WMButton
          class="mt-3"
          :text="$t('buttons.cancel')"
          type="secondary"
          @click="closeOverlay"
        />
      </div>
    </div>
  </OverlayPanel>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import DuplicateIcon from "/icons/duplicate.svg?raw";
import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();

const { duplicateProduct } = useProducts();

const toast = useToast();
const { t } = useI18n();
const router = useRouter();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// REFS
const isOpen = ref();
const productName = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const handleDuplicateProduct = () => {
  duplicateProduct(props.product.id, productName.value).then(({ data }) => {
    toast.success({ message: t("product.duplication-success") });
    router.push({ name: "productDetail", params: { id: data.id } });
  });
};

const closeOverlay = () => {
  isOpen.value.toggle();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  productName.value = `(Copy) ${props.product.name}`;
});
</script>

<style scoped></style>
