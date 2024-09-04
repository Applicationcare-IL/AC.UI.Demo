<template>
  <WMButton :text="$t('buttons.new-version')" type="type-5" @click="toggle">
    <template #customIcon>
      <div class="flex" v-html="NewVersionIcon" />
    </template>
  </WMButton>

  <OverlayPanel
    ref="isOpen"
    style="max-width: 400px"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-2">
      <span class="h4"> {{ $t("product.new-version") }} </span>

      <p class="text-base">
        {{ $t("product.new-version-text-part-one") }}
        <router-link :to="{ name: 'productDetail', params: { id: product.id } }">
          {{ product.name }}
        </router-link>
        {{ $t("product.new-version-text-part-two") }}
      </p>

      <div class="flex gap-2">
        <WMButton
          class="mt-3"
          :text="$t('buttons.approve')"
          type="primary"
          @click="handleCreateNewVersion"
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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import NewVersionIcon from "/icons/versions.svg?raw";
import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();

const { newProductVersion } = useProducts();

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

// COMPUTED

// COMPONENT METHODS AND LOGIC
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const handleCreateNewVersion = () => {
  newProductVersion(props.product.id).then(({ data }) => {
    toast.success({ message: t("product.new-version-success") });
    router.push({ name: "productDetail", params: { id: data.id } });
  });
};

const closeOverlay = () => {
  isOpen.value.toggle();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
