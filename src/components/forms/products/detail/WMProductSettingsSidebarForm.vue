<template>
  <div class="m-3 ml-0" :style="{ minWidth: '550px' }">
    <!-- <pre>{{ product }}</pre>
    <pre>{{ values }}</pre> -->
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
import { inject } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
defineProps({
  product: Object,
});

defineEmits(["productSettingsUpdated"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { values, handleSubmit } = useForm({
  validationSchema: formUtilsStore.getProductSettingsFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log("update product settings", values);
});

const cancelForm = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
