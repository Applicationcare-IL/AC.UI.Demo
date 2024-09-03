<template>
  <!-- <pre>{{ values.manufacturer }}</pre> -->

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
          <Card class="w-full">
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
            <template #content> Content </template>
          </Card>

          <Card class="w-full bg-gray-25">
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
              <!-- <pre>{{ product }}</pre> -->
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
                  :title="$t('product.installation')"
                  :state="product.installation_required"
                />
                <WMProductSettingPreview :title="$t('product.supply')" :state="product.supply" />
                <WMProductSettingPreview
                  :title="$t('product.maintenance')"
                  :state="product.maintenance_required"
                />
              </div>
            </template>
          </Card>

          <WMSidebar
            :visible="isUpdateProductSettingsSidebarVisible"
            name="updateProductSettings"
            @close-sidebar="closeUpdateProductSettingsSidebar"
            @open-sidebar="openUpdateProductSettingsSidebar"
          >
            <div class="m-3 ml-0">
              <div class="flex gap-2 align-items-center justify-content-between">
                <h3 class="h3 m-0">{{ $t("product.settings") }}</h3>
                <div class="flex gap-2">
                  <WMSaveButton @click="saveForm()" /> <WMCancelButton @click="cancelForm()" />
                </div>
              </div>
              <Divider />
            </div>
            <div class="m-3 ml-0 flex flex-column gap-3">
              <WMProductSettings :product="product" />
            </div>
          </WMSidebar>
        </div>
      </div>
    </div>

    <div class="flex flex-column gap-5 mb-6">
      <Accordion>
        <AccordionTab :header="$t('product.bundle-discount')"> Bundle discount table </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('product.related-products')">
          Related product table
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
      </TabView>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
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

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getNewProductFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  const { new_product_image, ...rest } = values;

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

formUtilsStore.formEntity = "product";

const openUpdateProductSettingsSidebar = () => {
  isUpdateProductSettingsSidebarVisible.value = true;
};

const closeUpdateProductSettingsSidebar = () => {
  isUpdateProductSettingsSidebarVisible.value = false;
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
onMounted(async () => {});
</script>
