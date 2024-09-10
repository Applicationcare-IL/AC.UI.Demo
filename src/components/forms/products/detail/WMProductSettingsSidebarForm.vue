<template>
  <div class="m-3 ml-0" :style="{ minWidth: '600px' }">
    <div class="flex gap-2 align-items-center justify-content-between">
      <h3 class="h3 m-0">{{ $t("product.settings") }}</h3>
      <div class="flex gap-2">
        <WMSaveButton @click="onSubmit" />
        <WMCancelButton @click="cancelForm()" />
      </div>
    </div>
    <Divider />
  </div>
  <div class="m-3 ml-0 flex flex-column gap-3">
    <WMProductSettings :product="product" />
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const toast = useToast();
const route = useRoute();
const { updateProduct, parseProduct } = useProducts();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  product: Object,
  formValues: Object,
});

const emit = defineEmits(["productSettingsUpdated", "productSettingsChanged"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { meta, handleSubmit, values, resetForm } = useForm({
  validationSchema: formUtilsStore.getProductSettingsFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  isFormDirty.value = false;

  const data = {
    ...props.formValues,
    ...values,
  };

  updateProduct(route.params.id, parseProduct(data))
    .then(() => {
      toast.success({ message: "Product  settings updated successfully" });
      emit("productSettingsUpdated");
      resetForm({ values: values });
      closeSidebar();
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating product settings");
    });
});

const cancelForm = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (!isFormDirty) return;

    isFormDirty.value = value.dirty;
  }
);

watch(
  () => values,
  (value) => {
    emit("productSettingsChanged", value);
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
