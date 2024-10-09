<template>
  <div class="w-full flex justify-content-between">
    <WMNewButton
      v-if="!props.readOnly"
      :text="$t('new')"
      :disabled="creatingMode"
      class="mb-3"
      @click="handleNewDiscount"
    />
    <!-- All - percentage - amount filters -->
    <SelectButton
      v-model="selectedDiscountTypeFilter"
      :options="discountTypeOptions"
      option-label="name"
      option-value="value"
      class="flex flex-nowrap"
      :allow-empty="false"
      @change="onChangeDiscountTypeFilter"
    />
  </div>
  <!-- <pre>{{ discounts }}</pre> -->
  <DataTable
    v-model:editingRows="editingRows"
    lazy
    :value="discounts"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :loading="loading"
    :total-records="totalRecords"
    class="w-full"
    edit-mode="row"
    :row-class="rowClass"
    @page="onPage($event)"
    @row-edit-save="onRowEditSave"
    @row-edit-cancel="onRowEditCancel"
  >
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="$t(column.header)"
      :class="column.class"
      :style="column.width ? { width: column.width } : {}"
    >
      <template #body="{ data }">
        <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column" />
      </template>
      <template #editor="{ data }">
        <WMRenderTableFieldEditor
          v-if="column.editable"
          v-model="data[column.field]"
          :column-data="column"
        />
        <WMRenderTableFieldBody v-else v-model="data[column.field]" :column-data="column" />
      </template>
    </Column>
    <Column
      v-if="!props.readOnly"
      :row-editor="true"
      style="width: 10px"
      class="p-1 extended-column"
      :header="$t('actions')"
    />
    <Column style="width: 100%">
      <template #body="{ data }">
        <WMRemoveButton
          v-if="data.mode !== 'create'"
          class="p-0"
          @click="handleRemoveDiscount(data)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { v4 as uuidv4 } from "uuid";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const {
  getProductDiscounts,
  addProductDiscount,
  updateProductDiscount,
  deleteProductDiscount,
  checkIfDiscountExists,
} = useProducts();

const toast = useToast();
const dialog = useDialog();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Array,
    required: true,
  },
});

// REFS
const editingRows = ref([]);

const discounts = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});

const discountTypeOptions = [
  { name: t("product.percentage-with-symbol"), value: "percentage" },
  { name: t("product.amount-with-symbol"), value: "number" },
  { name: t("all"), value: "" },
];

const selectedDiscountTypeFilter = ref(discountTypeOptions[2].value);

const columns = [
  {
    name: "quantity",
    type: "text",
    field: "quantity",
    header: "quantity",
    width: "5%",
    editable: true,
  },
  {
    name: "discount_type",
    type: "product-discount-type",
    field: "discount_type",
    header: "product.discount-type",
    width: "15%",
    editable: true,
  },
  {
    name: "discount_number",
    type: "product-discount",
    field: "render_discount",
    header: "product.discount-percentage-amount",
    editable: true,
  },
];

const loading = ref(false);

// COMPUTED
const creatingMode = computed(() => {
  if (discounts.value.length < 1) return false;

  return discounts.value.some((discount) => discount.mode === "create");
});

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  loading.value = true;
  // const filters = utilsStore.filters["product"];
  const nextPage = lazyParams.value.page + 1;

  const params = new URLSearchParams({
    // ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  if (selectedDiscountTypeFilter.value !== "") {
    params.append("discount_type", selectedDiscountTypeFilter.value);
  }

  let response = await getProductDiscounts(props.product.id, params);
  discounts.value = response.data;
  totalRecords.value = response.totalRecords;
  loading.value = false;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const rowClass = (data) => {
  return [{ "bg-new-row": data.mode === "create" }];
};

const getDiscountTemplate = () => {
  return {
    id: uuidv4(),
    mode: "create",
    quantity: "",
    discount_type: "",
    discount_number: "",
  };
};

const handleNewDiscount = async () => {
  const newDiscount = getDiscountTemplate();
  editingRows.value = [newDiscount, ...editingRows.value];
  discounts.value = [newDiscount, ...discounts.value];
};

const handleRemoveDiscount = (discount) => {
  deleteProductDiscount(props.product.id, discount.id).then(() => {
    discounts.value = discounts.value.filter((value) => value.id !== discount.id);

    toast.info({
      title: "Discount removed",
    });
  });
};

const onRowEditSave = async (event) => {
  let { newData: rowData, index } = event;

  const discountExists = await checkIfDiscountExists(props.product.id, rowData.quantity);

  if (discountExists) {
    let result = await dialog.confirmOverwriteProductDiscount();
    if (!result) return;
  }

  if (event.data.mode === "create") {
    handleAddProductDiscount(rowData, index);
  } else {
    handleUpdateProductDiscount(rowData, index);
  }

  loadLazyData();
};

const handleAddProductDiscount = async (rowData, index) => {
  addProductDiscount(props.product.id, rowData)
    .then(() => {
      delete rowData.mode;

      discounts.value[index] = rowData;

      toast.success({
        title: "Discount added",
      });
    })
    .catch((error) => {
      discounts.value = discounts.value.filter((value) => value.id !== rowData.id);

      console.error(error);
      toast.error("Error adding discount");
    });
};

const handleUpdateProductDiscount = async (rowData, index) => {
  updateProductDiscount({ productId: props.product.id, discountId: rowData.id, params: rowData })
    .then(() => {
      discounts.value[index] = rowData;
      toast.success({
        title: "Discount updated",
      });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating discount");
    });
};

const onRowEditCancel = (event) => {
  if (event.data.mode === "create") {
    discounts.value = discounts.value.filter((value) => value.id !== event.data.id);
  }
};

const onChangeDiscountTypeFilter = () => {
  loadLazyData();
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
});

// WATCHERS
// watchEffect(() => {
//   loadLazyData();
// });

// watch(
//   () => utilsStore.searchString["product"],
//   () => {
//     searchValue.value = utilsStore.searchString["product"];
//     utilsStore.debounceAction(() => {
//       loadLazyData();
//     });
//   },
//   { deep: true }
// );

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
