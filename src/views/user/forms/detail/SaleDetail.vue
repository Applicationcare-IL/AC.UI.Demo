<template>
  <WMDetailFormSubHeader
    entity="sale"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
    <template #top-left>
      <WMCancelButton
        v-if="can('sales.cancel')"
        size="small"
        :is-disabled="!isSaleCancellable"
        @click="handleCancelSale"
      />
    </template>
    <template #custom-buttons> Waiting for customer button </template>
  </WMDetailFormSubHeader>

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
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const dialog = useDialog();
const { getSale, cancelSale } = useSales();
const utilsStore = useUtilsStore();
const { can } = usePermissions();
const toast = useToast();
const { t } = useI18n();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("saleDetailForm");
const detailSaleForm = ref();
const sale = ref(null);

// COMPUTED
const isSaleCancellable = computed(() => {
  return true;
  // return (
  //   sale.value &&
  //   sale.value.status.value !== "canceled" &&
  //   sale.value.status.value !== "completed" &&
  //   sale.value.status.value !== "closed"
  // );
});

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

const handleCancelSale = async () => {
  if (sale.value && !isSaleCancellable.value) return;

  let response = await dialog.confirmCancelSale();

  if (response) {
    cancelSale(sale.value.id).then(() => {
      loadLazyData();
    });

    toast.info({
      message: t("sale.toast-sale-cancelled-message"),
      title: t("sale.toast-sale-cancelled-title"),
      life: 5000,
      group: "br",
    });
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  utilsStore.entity = "sale";
  await loadLazyData();
});
</script>
