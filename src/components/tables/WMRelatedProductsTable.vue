<template>
  <div class="flex flex-column w-full">
    <h2 class="h2">
      <slot name="title" />
    </h2>
    <pre>{{ relationshipTypes }}</pre>

    <div class="flex flex-column gap-3 mb-3">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row gap-2">
          <WMSelectRelatedProducts @products-selected="addRelatedProducts" />
        </div>
      </div>
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row">
          <WMSearchBox v-model="searchValue" entity="contact" />
        </div>
      </div>
    </div>

    <pre> {{ relatedProducts }}</pre>
    <DataTable
      v-model:selection="selectedRelatedProducts"
      lazy
      :value="relatedProducts"
      data-key="id"
      scrollable
      paginator
      :rows="10"
      :total-records="totalRecords"
      class="w-full"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <Column v-if="selectable" style="width: 40px" selection-mode="multiple" />
      <Column v-if="preview" style="width: 40px">
        <template #body="{ data }">
          <img src="/icons/eye.svg" class="vertical-align-middle" @click="openSidebar(data.id)" />
          <WMProductPreviewSidebar
            v-model:visible="isPreviewVisible[data.id]"
            :product-id="data.id"
          />
        </template>
      </Column>
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
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getRelatedProducts, getProductRelationshipTypes } = useProducts();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  preview: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  urlParams: {
    type: Array,
    required: false,
  },
  addUsersFunction: {
    type: Function,
    required: false,
  },
  removeUsersFunction: {
    type: Function,
    required: false,
  },
});

const emit = defineEmits(["update:selection"]);

// REFS
const selectedRelatedProducts = ref([]);
const totalRecords = ref(0);
const relatedProducts = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const isPreviewVisible = ref([]);

const relationshipTypes = ref([]);

const columns = ref([
  {
    name: "product-image",
    type: "attachment-image",
    field: "product_image_url",
    header: "photo",
    class: "p-0 filled-td",
  },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["related-products"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  if (props.urlParams) {
    props.urlParams.forEach((urlParam) => {
      params.append(urlParam.key, urlParam.value);
    });
  }

  let response = await getRelatedProducts(props.product.id, params);
  relatedProducts.value = response.data;
  totalRecords.value = response.totalRecords;
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedRelatedProducts.value);
};

// const cleanSelectedRelatedProducts = () => {
//   selectedRelatedProducts.value = [];
//   onSelectionChanged();
// };

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// const addSelectedUsers = async (users) => {
//   const userIds = users.map((user) => user.id);

//   await props.addUsersFunction(userIds);

//   loadLazyData();
// };

// const removeSelectedUsers = async () => {
//   const userIds = selectedUsers.value.map((user) => user.id);

//   await props.removeUsersFunction(userIds);

//   cleanSelectedUsers();
//   loadLazyData();
// };

// const onPage = (event) => {
//   console.log(event);
// };

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  relationshipTypes.value = await getProductRelationshipTypes();
  loadLazyData();
});
</script>
