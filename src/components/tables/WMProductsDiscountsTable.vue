<template>
  <WMNewButton
    v-if="!props.readOnly"
    :text="$t('new')"
    :disabled="creatingMode"
    class="mb-3"
    @click="handleNewDiscount"
  />

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
    @page="onPage($event)"
    @row-edit-save="onRowEditSave"
    @row-edit-cancel="onRowEditCancel"
  >
    <Column
      v-if="!props.readOnly"
      :row-editor="true"
      :frozen="true"
      align-frozen="right"
      style="width: 10px"
    />
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
        <WMRenderTableFieldEditor v-model="data[column.field]" :column-data="column" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
// eslint-disable-next-line no-unused-vars
import { v4 as uuidv4 } from "uuid";
import { computed, onMounted, ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getProductDiscounts, addProductDiscount, updateProductDiscount } = useProducts();

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

const columns = [
  {
    name: "quantity",
    type: "text",
    field: "quantity",
    header: "quantity",
  },
  {
    name: "discount_type",
    type: "text",
    field: "discount_type",
    header: "product.discount-type",
  },
  {
    name: "discount_number",
    type: "text",
    field: "discount_number",
    header: "product.discount-number",
  },
];

const utilsStore = useUtilsStore();
// const searchValue = ref("");
const loading = ref(false);

// COMPUTED
const creatingMode = computed(() => {
  if (discounts.value.length < 1) return false;

  return discounts.value.some((discount) => discount.mode === "create");
});

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  loading.value = true;
  const filters = utilsStore.filters["product"];
  const nextPage = lazyParams.value.page + 1;
  // const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  // if (searchValueParam) {
  //   params.append("search", searchValueParam);
  // }

  // if (props.relatedEntity && props.relatedEntityId) {
  //   params.append(props.relatedEntity, props.relatedEntityId);
  // }

  let response = await getProductDiscounts(props.product.id, params);
  discounts.value = response.data;
  totalRecords.value = response.totalRecords;
  loading.value = false;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
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
  discounts.value.push(newDiscount);
  editingRows.value = [...editingRows.value, newDiscount];
};

const onRowEditSave = (event) => {
  let { newData, index } = event;

  if (event.data.mode === "create") {
    console.log("create", newData);
    addProductDiscount(props.product.id, newData).then((response) => {
      delete newData.mode;
    });

    console.log("creo nuevo descuento");
  } else {
    updateProductDiscount(props.product.id, newData.id, newData);
    console.log("actualizo descuento");
  }

  discounts.value[index] = newData;
};

const onRowEditCancel = (event) => {
  if (event.data.mode === "create") {
    discounts.value = discounts.value.filter((value) => value.id !== event.data.id);
  }
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
