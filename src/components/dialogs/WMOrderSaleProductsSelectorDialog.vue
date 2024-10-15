<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :style="{ width: '90vw' }"
    class="documents-selector-dialog"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex">
      <div class="flex flex-column p-3 documents-selector-dialog__table">
        <h4 class="h4 mb-0">{{ $t("order-dialog-title") }}</h4>
        <p class="mb-3">{{ $t("order-dialog-text") }}</p>

        <p class="font-bold">{{ $t("order-dialog-pre-table-text") }}:</p>
        <div class="flex flex-row w-full justify-content-end gap-3">
          <div class="w-full overflow-auto">
            <WMProductsTable
              :columns="productsTableColumns"
              :products="products"
              :total-records="totalRecords"
              :loading="loading"
              preview
              selectable
              @update:page="currentPage = $event"
              @update:selection="onSelectionChanged"
            />
          </div>
        </div>
        <WMButton
          class="mt-2"
          :text="$t('buttons.order')"
          type="primary"
          :disabled="!selectedProducts || !selectedProducts.length"
          @click="handleOrderSaleProducts"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watchEffect } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { layoutConfig } = useLayout();
const { orderSaleProducts, getSaleProducts } = useSales();
const optionSetsStore = useOptionSetsStore();

const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  sale: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["saleProductsOrdered"]);

// REFS
const modelValue = defineModel();

const currentPage = ref(0);
const products = ref([]);
const selectedProducts = ref();
const loading = ref(true);
const totalRecords = ref(0);

const offeredStatusId = ref();

const productsTableColumns = [
  {
    name: "product-name",
    type: "link",
    field: "link_detail",
    header: "product.name",
    routeName: "productDetail",
  },
  {
    name: "product-status",
    type: "product-in-sale-status",
    field: "status",
    header: "product.status",
    editable: false,
  },
  {
    name: "id",
    type: "text",
    field: "id",
    header: "id",
  },
  {
    name: "base-price",
    type: "currency",
    field: "base_price",
    header: "product.base-price",
  },
  {
    name: "salesman-discount",
    type: "currency",
    field: "salesman_discount",
    header: "product.salesman-discount",
    editable: true,
  },
  {
    name: "product-price-in-sale",
    type: "currency",
    field: "price_in_sale",
    header: "product.products-price-in-sale",
    editable: false,
  },
  {
    name: "units",
    type: "number",
    field: "quantity",
    header: "product.units",
    editable: true,
  },
  {
    name: "deal-price",
    type: "currency",
    field: "deal_price",
    header: "product.deal-price",
    editable: false,
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const onSelectionChanged = (value) => {
  selectedProducts.value = value;
};

const closeDialog = () => {
  modelValue.value = false;
};

const loadProducts = async () => {
  loading.value = true;

  const nextPage = currentPage.value + 1;

  const params = new URLSearchParams({
    status: offeredStatusId.value,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  let response = await getSaleProducts(props.sale.id, params);

  products.value = response.data;
  totalRecords.value = response.totalRecords;
  loading.value = false;
};

const handleOrderSaleProducts = async () => {
  const selectedProductsIds = selectedProducts.value.map((product) => product.id);

  orderSaleProducts(props.sale.id, selectedProductsIds)
    .then(() => {
      toast.success({ message: "Products ordered successfully" });
      emit("saleProductsOrdered");
      closeDialog();
    })
    .catch((error) => {
      toast.error(error);
      console.error(error);
    });
};

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadProducts();
});

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  offeredStatusId.value = await optionSetsStore.getId("product_offered_status", "offered");

  await loadProducts();
});
</script>
