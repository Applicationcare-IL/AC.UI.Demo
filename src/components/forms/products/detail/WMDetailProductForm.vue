<template>
  <!-- <pre>{{ product }}</pre> -->
  <div v-if="product" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">
          <Card class="p-card--first-top-card">
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="product.id"
                  />
                </div>
                <!-- <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('first-name') + ':'"
                    :value="product.name"
                    required
                  />
                </div> -->
              </div>
            </template>
          </Card>
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="product.id"
                  />
                </div>
                <!-- <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('first-name') + ':'"
                    :value="product.name"
                    required
                  />
                </div> -->
              </div>
            </template>
          </Card>
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="product.id"
                  />
                </div>
                <!-- <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('first-name') + ':'"
                    :value="product.name"
                    required
                  />
                </div> -->
              </div>
            </template>
          </Card>
        </div>
        <div class="flex gap-5">hola</div>
      </div>
    </div>
  </div>

  <pre>{{ values }}</pre>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES

const formUtilsStore = useFormUtilsStore();

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

// const emit = defineEmits(["userUpdated"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { meta, values } = useForm({
  //   validationSchema: formUtilsStore.getUserUpdateFormValidationSchema,
});

formUtilsStore.formEntity = "product";

// PROVIDE, EXPOSE
// defineExpose({
//   onSave,
// });

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
