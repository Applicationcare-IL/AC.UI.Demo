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
    <template #bottom-left>
      <!-- <WMMessagesButton :id="route.params.id" entity="sale" /> -->
    </template>
    <template #custom-buttons>
      <div class="waiting-for-customer" :class="{ active: isWaitingForCustomer }">
        <label
          for="waitingForCustomer"
          class="waiting-for-customer__text font-bold h6 cursor-pointer"
        >
          Waiting for customer
        </label>
        <Checkbox
          v-model="isWaitingForCustomer"
          input-id="waitingForCustomer"
          :binary="true"
          @change="handleWaitingForCustomer"
        />
      </div>
    </template>
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

const isWaitingForCustomer = ref(false);

// COMPUTED
const isSaleCancellable = computed(() => {
  return (
    sale.value &&
    sale.value.status.value !== "canceled" &&
    sale.value.status.value !== "completed" &&
    sale.value.status.value !== "closed"
  );
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

const handleWaitingForCustomer = async () => {
  detailSaleForm.value.handleIsWaitingForCustomerFieldState(isWaitingForCustomer.value ? 1 : 0);
};

const handleWaitingForCustomerToast = () => {
  toast.warning({
    title: "The sale is marked as “waiting for costumer”",
    group: "bl",
    life: 5000,
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  utilsStore.entity = "sale";
  await loadLazyData();

  if (sale.value.waiting_for_customer) {
    isWaitingForCustomer.value = true;
    handleWaitingForCustomerToast();
  }
});
</script>

<style lang="scss" scoped>
.waiting-for-customer {
  display: flex;
  gap: 4px;
  align-items: center;

  &__text {
    padding: 2.5px 8px;
    border-radius: 6px;
    color: var(--blue-700);
    height: 24px;
  }

  :deep(.p-checkbox) {
    height: 24px;
    width: 24px;
  }

  :deep(.p-checkbox .p-checkbox-box) {
    border-radius: 6px;
    height: 100%;
    width: 100%;
  }

  &.active {
    .waiting-for-customer__text {
      color: var(--gray-800);
      background-color: var(--yellow-400);
    }

    :deep(.p-checkbox .p-checkbox-box.p-highlight) {
      background: var(--yellow-400);
      border-color: var(--yellow-400);
      color: var(--gray-800);
    }

    :deep(.p-checkbox .p-checkbox-box .p-checkbox-icon) {
      color: var(--gray-800);
    }
  }
}
</style>
