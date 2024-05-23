<template>
  <h2 class="h2 mb-0">LOCATION</h2>
  <div class="wm-form-row gap-4">
    <WMSelectableButton v-model="showAddressOptionsRef" :label="$t('project.address')" />
    <WMSelectableButton
      v-model="showCityDataOptionsRef"
      :label="$t('project.city_data')"
    />
  </div>
  <div class="wm-form-row gap-5">
    <div v-show="showAddressOptionsRef">
      <h5 class="h5">{{ $t("project.address") }}</h5>
      <div class="wm-form-row gap-5">
        <div class="wm-form-column gap-5">
          <WMInputSearch
            v-model="location.city"
            name="city"
            :highlighted="true"
            :required="true"
            :label="$t('address.city') + ':'"
            :options="cities"
            width="152"
            :placeholder="$t('select', ['addres.city'])"
            :option-set="true"
            @change="updateStreets($event)"
          />

          <WMInputSearch
            v-model="location.street"
            name="street"
            :required="true"
            :highlighted="true"
            :label="$t('address.street') + ':'"
            :options="streets"
            width="152"
            :placeholder="$t('select', ['address.street'])"
            :option-set="true"
            :disabled="!isCitySelected"
          />

          <WMInputSearch
            v-model="location.neighborhood"
            name="neighborhood"
            :highlighted="true"
            :label="$t('address.neighborhood') + ':'"
            :options="neighborhoods"
            :disabled="!isCitySelected"
            width="152"
            :placeholder="$t('select', ['address.neighborhood'])"
            :option-set="true"
          />

          <WMInput
            :value="location.house_number"
            name="house-number"
            type="input-text"
            :disabled="!isCitySelected"
            :highlighted="true"
            :label="$t('address.house-number') + ':'"
            :required="true"
          />
        </div>
        <WMLocationMap :location="location" />
      </div>
    </div>
  </div>
  <div v-show="showCityDataOptionsRef">
    <h5 class="h5">{{ $t("project.city_data") }}</h5>
    <div class="wm-form-row gap-5">
      <WMInput
        name="block"
        type="input-text"
        :highlighted="true"
        :label="$t('address.block') + ':'"
        required
      />
      <WMInput
        name="parcel"
        type="input-text"
        :highlighted="true"
        :label="$t('address.parcel') + ':'"
        required
      />
      <WMInput
        name="sub-parcel"
        type="input-text"
        :highlighted="true"
        :label="$t('address.sub-parcel') + ':'"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { onMounted, provide, ref, watch } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
const showAddressOptionsRef = ref(false);
const showCityDataOptionsRef = ref(false);

const isCitySelected = ref(false);

const cities = ref();
const streets = ref();
const neighborhoods = ref();

const location = ref({
  house_number: 1, // default is always 1 https://app.clickup.com/t/86bxqdq6b
});

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleChange: handleChangeAddressOptions } = useField(
  "showAddressOptions",
  undefined,
  {
    type: "checkbox",
    valueProp: showAddressOptionsRef.value,
    initialValue: false,
    uncheckedValue: false,
  }
);

const { handleChange: handleChangeCityDataOptions } = useField(
  "showCityDataOptions",
  undefined,
  {
    type: "checkbox",
    valueProp: showCityDataOptionsRef.value,
    initialValue: false,
    uncheckedValue: false,
  }
);

const updateStreets = (event) => {
  if (event.value) {
    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_street", event.value.id)
      .then((data) => {
        streets.value = data;
      });

    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_neighborhood", event.value.id)
      .then((data) => {
        neighborhoods.value = data;
      });

    isCitySelected.value = true;
  } else {
    isCitySelected.value = false;
  }
};

// PROVIDE, EXPOSE
provide("location", { location });

// WATCHERS
watch(
  () => showAddressOptionsRef.value,
  (value) => {
    handleChangeAddressOptions(value);
  }
);

watch(
  () => showCityDataOptionsRef.value,
  (value) => {
    handleChangeCityDataOptions(value);
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  cities.value = await optionSetsStore.getOptionSetValues("service_city");
  streets.value = await optionSetsStore.getOptionSetValues("service_street");
  neighborhoods.value = await optionSetsStore.getOptionSetValues("service_neighborhood");
});
</script>

<style scoped lang="scss"></style>
