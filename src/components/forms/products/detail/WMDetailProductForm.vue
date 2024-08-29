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
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    required
                    type="input-text"
                    :label="$t('product.name') + ':'"
                    size="md"
                    :value="product.name"
                  />
                  <WMInput
                    name="information_page"
                    required
                    type="input-text"
                    :label="$t('product.information-page') + ':'"
                    size="md"
                    :value="product.information_page"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    id="description"
                    type="text-area"
                    :label="$t('description') + ':'"
                    name="description"
                    size="lg"
                    required
                    :value="product.description"
                  />
                </div>
                <div class="wm-form-row flex flex-wrap gap-5">
                  <WMInput
                    v-if="units"
                    name="units"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('product.units') + ':'"
                    :options="units"
                    :placeholder="$t('select', ['unit'])"
                    size="sm"
                    option-set
                    data-testid="product.form.units"
                    required
                  />

                  <WMInput
                    v-if="manufacturerTypes"
                    name="manufacturer_type"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('product.manufacturer-type') + ':'"
                    :options="manufacturerTypes"
                    :placeholder="$t('select', ['product.manufacturer-type'])"
                    size="sm"
                    option-set
                    data-testid="product.form.manufacturer-type"
                    required
                  />

                  <WMInput
                    v-if="customers"
                    name="manufacturer"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('product.manufacturer') + ':'"
                    :options="customers"
                    :placeholder="$t('select', ['product.manufacturer'])"
                    size="sm"
                    data-testid="product.form.manufacturer"
                    required
                  />

                  <WMInput
                    name="existing_product"
                    type="input-select-button"
                    :highlighted="true"
                    :label="$t('product.existing-product') + ':'"
                    :options="yesNoOptions"
                    :value="yesNoOptions[1]"
                    width="80"
                  />
                </div>
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
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const toast = useToast();
const route = useRoute();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const { updateProduct, parseProduct } = useProducts();
const { getCustomersFromApi } = useCustomers();

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
const loading = ref(true);
const units = ref([]);
const manufacturerTypes = ref([]);
const customers = ref(null);
const employees = ref(null);
const yesNoOptions = ref([]);

const saleDiscountOptions = ref([
  { name: "None", value: "none" },
  { name: "Percent %", value: "percent" },
  { name: "Amount ₪", value: "amount" },
]);

const productTypes = ref(null);
const productFamilies = ref(null);
const productGroups = ref(null);
const productDepartments = ref(null);

const billingTypes = ref([]);
const billingCycleUnits = ref([]);
const renewalTypes = ref([]);
const cancellationTypes = ref([]);

const quickCodes = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  // validationSchema: formUtilsStore.getUserUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateProduct(route.params.id, parseProduct(values))
    .then(() => {
      toast.success({ message: "User updated successfully" });
      resetForm({ values: values });
      emit("productUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating user");
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
onMounted(async () => {
  units.value = await optionSetsStore.getOptionSetValues("units");
  manufacturerTypes.value = await optionSetsStore.getOptionSetValues("manufacturer_type");
  yesNoOptions.value = await optionSetsStore.getOptionSetValues("yesNo");

  let customersData = await getCustomersFromApi({ per_page: 9999999 });
  customers.value = customersData.data.map((customer) => ({
    label: customer.name,
    value: customer.id,
  }));
});
</script>
