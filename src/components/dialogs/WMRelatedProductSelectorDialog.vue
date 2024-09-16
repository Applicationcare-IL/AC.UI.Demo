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
        <h4 class="h4">Add related products</h4>
        <div class="flex flex-row w-full justify-content-end gap-3 mt-3">
          <div class="w-full overflow-auto">
            <h5 class="h5">Type of relationship</h5>
            <WMInput
              :value="selectedOption"
              name="relationship"
              type="input-select"
              :highlighted="true"
              :options="relationshipTypesList"
              size="sm"
              required
            />

            <h5 class="h5">Products</h5>
            <WMProductsTable
              ref="productsTable"
              :columns="productsTableColumns"
              preview
              selectable
              @update:selection="onSelectionChanged"
            />
          </div>
        </div>
        <WMButton
          class="mt-2"
          :text="$t('buttons.add-related-products')"
          type="primary"
          :disabled="!selectedProducts || !selectedProducts.length"
          @click="handleAddRelatedProducts"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();
const { getProductRelationshipTypes, addRelatedProductBulk } = useProducts();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["relatedProductsAdded"]);

// REFS
const modelValue = defineModel();
const selectedProducts = ref();

const relationshipTypesList = ref([]);
const selectedOption = ref(null);

const productsTableColumns = [
  {
    name: "product-image",
    type: "attachment-image",
    field: "product_image_url",
    header: "photo",
    class: "p-0 filled-td",
  },
  {
    name: "product-name",
    type: "link",
    field: "link_detail",
    header: "product.name",
    routeName: "productDetail",
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
    name: "manufacturer",
    type: "text",
    field: "manufacturer_name",
    header: "product.manufacturer",
  },
  {
    name: "type",
    type: "option-set",
    field: "type",
    header: "product.type",
  },
  {
    name: "family",
    type: "option-set",
    field: "family",
    header: "product.family",
  },
  {
    name: "group",
    type: "option-set",
    field: "group",
    header: "product.group",
  },
  {
    name: "department",
    type: "option-set",
    field: "department",
    header: "product.department",
  },
  {
    name: "renewal_type",
    type: "option-set",
    field: "renewal_type",
    header: "product.renewal_type",
  },
  {
    name: "cancellation_type",
    type: "option-set",
    field: "cancellation_type",
    header: "product.cancellation_type",
  },
  {
    name: "license",
    type: "checkbox",
    field: "license",
    header: "product.license",
  },
  {
    name: "commitment",
    type: "checkbox",
    field: "commitment",
    header: "product.commitment",
  },
  {
    name: "guarantee",
    type: "checkbox",
    field: "guarantee",
    header: "product.guarantee",
  },
  {
    name: "installation",
    type: "checkbox",
    field: "installation_required",
    header: "product.installation",
  },
  {
    name: "maintenance",
    type: "checkbox",
    field: "maintenance",
    header: "product.maintenance",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "State",
    width: "100px",
    class: "p-0 filled-td",
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

const loadProductRelationshipTypes = async () => {
  let response = await getProductRelationshipTypes({
    per_page: 999999999,
  });

  relationshipTypesList.value = response.data.map((employee) => {
    return {
      id: employee.id,
      label: employee.name,
    };
  });
};

const handleAddRelatedProducts = async () => {
  let selectedProductIds = selectedProducts.value.map((product) => product.id);

  const relationships = selectedProductIds.map((id) => {
    return {
      related: id,
      type: selectedOption.value.id,
    };
  });

  addRelatedProductBulk(props.product.id, relationships)
    .then(() => {
      toast.success({ message: "Related products added successfully" });
      emit("relatedProductsAdded");
      closeDialog();
    })
    .catch((error) => {
      toast.error(error);
      console.error(error);
    });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadProductRelationshipTypes();
  selectedOption.value = relationshipTypesList.value[0];
});
</script>
