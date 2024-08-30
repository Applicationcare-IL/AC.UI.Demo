<template>
  <Skeleton v-if="loading" width="100%" height="385px"/>
  <div v-else class="flex flex-column gap-5">
    <div class="wm-form-row gap-5">
      <WMInput
          name="id"
          type="info"
          :highlighted="true"
          :label="$t('id') + ':'"
          :value="product.id"
      />
      <WMTeamOwnerFields/>
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
          name="info_page"
          required
          type="input-text"
          :label="$t('product.information-page') + ':'"
          size="md"
          :value="product.info_page"
      />
    </div>
    <div class="wm-form-row gap-5">
      <div class="wm-input flex flex-column">
        <label class="wm-form-label">Photo: </label>
        <div class="flex photo-container" :class="{ 'has-image': productImage }">
          <i
              class="pi pi-times cursor-pointer photo-container__remove"
              @click="handleRemoveImage()"
          />
          <div
              v-if="productImage"
              class="bg-cover bg-no-repeat bg-center border-round h-full w-full"
              :style="{
              backgroundImage: `url(${productImage})`,
            }"
          />

          <WMUploadProductImage v-else @upload-image="handleUploadImage"/>
        </div>
      </div>
      <WMInput
          id="description"
          type="text-area"
          :label="$t('description') + ':'"
          name="description"
          size="lg"
          required
          :value="product.description"
          :rows="8"
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
          :value="product?.manufacturer_type"
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
          :value="product?.manufacturer"
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

<script setup>
// IMPORTS
import {useField} from "vee-validate";
import {onMounted, ref} from "vue";

import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const {getCustomersFromApi} = useCustomers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const loading = ref(true);

const units = ref([]);
const manufacturerTypes = ref([]);
const customers = ref(null);
const yesNoOptions = ref([]);
const productImage = ref(props.product?.product_image_url);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const {handleChange: handleProductImageChange, setTouched} = useField(
    "new_product_image",
    undefined,
    {
      initialValue: false,
    }
);

const handleUploadImage = (files) => {
  productImage.value = URL.createObjectURL(files);
  handleProductImageChange(files);
  setTouched(true);
};

const handleRemoveImage = () => {
  productImage.value = null;
  handleProductImageChange(null);
  setTouched(true);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  units.value = await optionSetsStore.getOptionSetValues("units");
  manufacturerTypes.value = await optionSetsStore.getOptionSetValues("manufacturer_type");
  yesNoOptions.value = await optionSetsStore.getOptionSetValues("yesNo");

  let customersData = await getCustomersFromApi({per_page: 9999999});
  customers.value = customersData.data.map((customer) => ({
    label: customer.name,
    value: customer.id,
  }));

  loading.value = false;
});
</script>

<style scoped lang="scss">
.photo-container {
  position: relative;
  height: 146px;
  width: 146px;

  &.has-image:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(255 255 255 / 69%);
    width: 100%;
    height: 100%;
  }

  &.has-image:hover .photo-container__remove {
    opacity: 1;
  }

  &__remove {
    position: absolute;
    top: 8px;
    right: 6px;
    z-index: 1;
    font-size: 1.4rem;
    font-weight: bold;
    opacity: 0;
  }
}
</style>
