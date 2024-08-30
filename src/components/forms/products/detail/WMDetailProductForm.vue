<template>
  <pre>{{ values.new_product_image }}</pre>

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
                <i class="pi pi-ellipsis-v cursor-pointer" @click="console.log('open settings')" />
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

  <!-- <pre>{{ values }}</pre> -->
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, watch } from "vue";
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
