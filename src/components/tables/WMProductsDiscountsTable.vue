<template>
  <DataTable
    lazy
    :value="discounts"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :loading="loading"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
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
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
// eslint-disable-next-line no-unused-vars
import { onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getProductDiscounts } = useProducts();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Array,
    required: true,
  },
});

// REFS
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
