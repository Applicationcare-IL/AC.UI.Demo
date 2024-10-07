<template>
  <div v-if="product" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex flex-1 flex-column card-container gap-5">
          <Card class="p-card--first-top-card">
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <WMProductGeneralDetails :product="product" />
            </template>
          </Card>
          <Card>
            <template #title> {{ $t("product.pricing") }} </template>
            <template #content>
              <WMProductPricing :product="product" />
            </template>
          </Card>
          <Card>
            <template #title> {{ $t("product.characteristics") }} </template>
            <template #content>
              <WMProductCharacteristics :product="product" />
            </template>
          </Card>
        </div>
        <div class="flex flex-column gap-5" style="width: calc(470px - 2rem)">
          <!-- <Card class="w-full">
            <template #title>
              <div class="w-full flex align-items-center justify-content-between">
                <span>
                  {{ $t("product.sales-data") }}
                </span>
                <i
                  class="pi pi-ellipsis-v cursor-pointer"
                  @click="console.log('open sales data')"
                />
              </div>
            </template>
            <template #content> </template>
          </Card> -->

          <Card class="w-full h-auto bg-gray-25">
            <template #title>
              <div class="w-full flex align-items-center justify-content-between">
                <span>
                  {{ $t("product.settings") }}
                </span>
                <i
                  class="pi pi-ellipsis-v cursor-pointer"
                  @click="openUpdateProductSettingsSidebar"
                />
              </div>
            </template>
            <template #content>
              <div class="flex flex-column gap-4">
                <WMProductSettingPreview
                  :title="$t('product.license')"
                  :state="product.licensing_required"
                />
                <WMProductSettingPreview
                  :title="$t('product.commitment')"
                  :state="product.commitment"
                />
                <WMProductSettingPreview
                  :title="$t('product.guarantee')"
                  :state="product.warranty"
                />
                <WMProductSettingPreview
                  :title="$t('product.installation')"
                  :state="product.installation_required"
                />

                <WMProductSettingPreview
                  :title="$t('product.provisioning')"
                  :state="product.provisioning_required"
                />
                <WMProductSettingPreview
                  :title="$t('product.maintenance')"
                  :state="product.maintenance_required"
                />
              </div>
            </template>
          </Card>

          <WMSidebar
            v-if="product"
            :visible="true"
            :show="isUpdateProductSettingsSidebarVisible"
            name="updateProductSettings"
            @close-sidebar="closeUpdateProductSettingsSidebar"
            @open-sidebar="openUpdateProductSettingsSidebar"
          >
            <WMProductSettingsSidebarForm
              :product="product"
              :form-values="values"
              @product-settings-updated="handleProductSettingsUpdated"
              @product-settings-changed="handleProductSettingsChanged"
            />
          </WMSidebar>
        </div>
      </div>
    </div>

    <div class="flex flex-column gap-5 mb-6">
      <div class="bundle-discount-accordion relative">
        <InputSwitch
          v-model="hasBundleDiscount"
          class="bundle-discount-accordion__switcher"
          @input="handleHasBundleDiscountChange(hasBundleDiscount)"
        />

        <Accordion>
          <AccordionTab :header="$t('product.bundle-discount')">
            <WMProductsDiscountsTable :product="product" />
          </AccordionTab>
        </Accordion>
      </div>

      <Accordion>
        <AccordionTab :header="$t('product.related-products')">
          <WMRelatedProductsTable :product="product" selectable preview />
        </AccordionTab>
      </Accordion>
    </div>

    <div class="flex-1 tabs-container mt-5">
      <TabView>
        <TabPanel :header="$t('more-details')">
          <div class="flex gap-2">
            <div class="flex flex-column gap-5 m-2">
              <h4 class="h4 mb-0">
                {{ $t("product.management-and-marketing") }}
              </h4>
              <WMProductManagementAndMarketing :product="product" />
            </div>
            <Divider layout="vertical" />
            <div class="flex flex-column gap-5 m-2">
              <h4 class="h4 mb-0">
                {{ $t("product.extra-details") }}
              </h4>
              <WMProductExtraDetails :product="product" />
            </div>
          </div>
        </TabPanel>
        <TabPanel :header="$t('additional-information')">
          <div class="flex flex-column gap-5 m-2">
            <h4 class="h4 mb-0">
              {{ $t("logs") }}
            </h4>
            <div class="flex flex-auto gap-5 flex-row">
              <WMInput
                name="created_by"
                type="info"
                :highlighted="true"
                :label="$t('created_by') + ':'"
                :value="product.last_activity?.creator.name"
                width="150"
              />
              <WMInput
                name="modified_by"
                type="info"
                :highlighted="true"
                :label="$t('modified_by') + ':'"
                :value="product.last_activity?.updater.name"
                width="150"
              />
            </div>
            <div class="flex flex-auto gap-5 flex-row">
              <WMInput
                name="created_at"
                type="info"
                :highlighted="true"
                :label="$t('created_at') + ':'"
                :value="product.last_activity?.creator.at"
                width="150"
              />
              <WMInput
                name="modified_at"
                type="info"
                :highlighted="true"
                :label="$t('modified_at') + ':'"
                :value="product.last_activity?.updater.at"
                width="150"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useField, useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const toast = useToast();
const route = useRoute();
const formUtilsStore = useFormUtilsStore();

const { updateProduct, parseProduct, uploadProductImage } = useProducts();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["productUpdated"]);

// REFS
const isUpdateProductSettingsSidebarVisible = ref(false);
const productSettings = ref({});
const hasBundleDiscount = ref(false);

// COMPUTED
const productValues = computed(() => {
  return {
    ...values,
    ...productSettings.value,
  };
});

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getNewProductFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  const { new_product_image, ...rest } = productValues.value;

  updateProduct(route.params.id, parseProduct(rest))
    .then(async () => {
      if (new_product_image) {
        return await uploadProductImage(route.params.id, new_product_image);
      }

      return Promise.resolve();
    })
    .then(() => {
      toast.success({ message: "Product updated successfully" });
      resetForm({ values: values });
      emit("productUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating product");
    });
});

const openUpdateProductSettingsSidebar = () => {
  isUpdateProductSettingsSidebarVisible.value = true;
};

const closeUpdateProductSettingsSidebar = () => {
  isUpdateProductSettingsSidebarVisible.value = false;
};

const handleProductSettingsUpdated = () => {
  closeUpdateProductSettingsSidebar();
  emit("productUpdated");
};

const handleProductSettingsChanged = (settings) => {
  productSettings.value = settings;
};

const { handleChange: handleChangeHasBundleDiscount, setTouched } = useField(
  "volume_discount",
  undefined,
  {
    initialValue: hasBundleDiscount.value,
  }
);

const handleHasBundleDiscountChange = (value) => {
  handleChangeHasBundleDiscount(value);
  setTouched(true);
};

// PROVIDE, EXPOSE
defineExpose({
  onSave,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (value.touched) {
      formUtilsStore.formMeta = value;
      formUtilsStore.setFormMetas(value, props.formKey);
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  formUtilsStore.formEntity = "product";

  hasBundleDiscount.value = props.product.volume_discount;
});
</script>
<style lang="scss" scoped>
.bundle-discount-accordion {
  display: flex;

  &__switcher {
    position: absolute !important;
    left: 1em;
    top: 28px;
    transform: translateY(-50%);
    z-index: 2;
  }
}
</style>
