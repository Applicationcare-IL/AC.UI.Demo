<template>
  <!-- <pre>{{ product }}</pre> -->
  <div v-if="product" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex flex-1 flex-column card-container gap-5">
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
            <template #title> {{ $t("product.pricing") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <!-- <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="product.id"
                  /> -->
                </div>
              </div>
            </template>
          </Card>
          <Card>
            <template #title> {{ $t("product.characteristics") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <!-- <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="product.id"
                  /> -->
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
            <template #content> Content </template>
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
          <div class="flex flex-column gap-5 m-2">
            <h4 class="h4 mb-0">
              {{ $t("product.management-and-marketing") }}
            </h4>
            <div class="flex flex-auto gap-5 flex-row"></div>
            <div class="flex flex-auto gap-5 flex-row"></div>
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
