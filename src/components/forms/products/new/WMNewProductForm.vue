<template>
  <!-- <pre>{{ values.new_product_image }}</pre> -->
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
  </div>
  <div v-else class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex gap-5 mb-5">
      <div class="flex flex-1 flex-column gap-5 mb-5">
        <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
        <WMProductGeneralDetails />

        <Divider />

        <h2 class="h2 my-0">{{ $t("product.pricing") }}</h2>
        <WMProductPricing />

        <Divider />

        <h2 class="h2 my-0">{{ $t("product.characteristics") }}</h2>
        <WMProductCharacteristics />

        <Divider />

        <h2 class="h2 my-0">{{ $t("product.management-and-marketing") }}</h2>
        <WMProductManagementAndMarketing />
      </div>
      <Divider layout="vertical" />
      <div class="flex flex-1 flex-column gap-5 mb-5">
        <h2 class="h2 my-0">{{ $t("definitions") }}</h2>

        <div class="wm-form-row flex-column align-items-end gap-5">
          <WMProductSettings />
        </div>

        <Divider />

        <h2 class="h2 my-0">{{ $t("product.extra-details") }}</h2>
        <WMProductExtraDetails />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();

const { getQuickCodes } = useServices();
const { getCustomersFromApi } = useCustomers();
const { createProduct, parseProduct, uploadProductImage } = useProducts();
const dialog = useDialog();

const toast = useToast();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["newProductCreated"]);

// REFS
const loading = ref(true);
const units = ref([]);
const manufacturerTypes = ref([]);
const customers = ref(null);
const yesNoOptions = ref([]);

const billingCycleUnits = ref([]);
const quickCodes = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, values } = useForm({
  validationSchema: formUtilsStore.getNewProductFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  const { new_product_image, ...rest } = values;

  createProduct(parseProduct(rest))
    .then(async (newProductData) => {
      if (new_product_image) {
        await uploadProductImage(newProductData.data.data.id, new_product_image);
      }

      return Promise.resolve(newProductData);
    })
    .then((data) => {
      emit("newProductCreated");

      dialog.confirmNewProduct({ id: data.data.data.id, emit });
      toast.success({ title: "Product created", message: "Product created successfully" });
    })
    .catch((error) => {
      toast.error("An error occurred while creating the product");
      console.error(error);
    });
});

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  units.value = await optionSetsStore.getOptionSetValues("units");
  manufacturerTypes.value = await optionSetsStore.getOptionSetValues("manufacturer_type");
  yesNoOptions.value = await optionSetsStore.getOptionSetValues("yesNo");

  let customersData = await getCustomersFromApi({ per_page: 9999999 });
  customers.value = customersData.data.map((customer) => ({
    label: customer.name,
    value: customer.id,
  }));

  billingCycleUnits.value = await optionSetsStore.getOptionSetValues("product_billing_cycle_unit");

  await getQuickCodes().then((response) => {
    quickCodes.value = response.data.map((quickCode) => ({
      label: quickCode.name,
      value: quickCode.name,
    }));
  });

  loading.value = false;
});
</script>

<style scoped lang="scss"></style>
