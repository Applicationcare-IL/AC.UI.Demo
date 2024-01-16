<template>
  <h2 class="h2 mb-0">LOCATION</h2>
  <div class="wm-form-row gap-4">
    <WMSelectableButton
      v-model="showAddressOptionsRef"
      :label="$t('project.address')"
    />
    <WMSelectableButton
      v-model="showCityDataOptionsRef"
      :label="$t('project.city_data')"
    />
  </div>
  <div class="wm-form-row gap-5">
    <div v-if="showAddressOptionsRef">
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
          <div class="flex flex-row gap-5 mt-2 mb-2">
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
          </div>

          <WMInput
            v-model="location.house_number"
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
  <div v-if="showCityDataOptionsRef">
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
import { useField } from "vee-validate";
import { ref, watch } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const showAddressOptionsRef = ref(false);
const showCityDataOptionsRef = ref(false);

const { checked, handleChange } = useField("showAddressOptions", undefined, {
  type: "checkbox",
  valueProp: showAddressOptionsRef.value,
  initialValue: false,
  uncheckedValue: false,
});

watch(
  () => showAddressOptionsRef.value,
  (value) => {
    console.log("watch", value);
    handleChange(value);
  }
);

const isCitySelected = ref(false);

const cities = ref(optionSetsStore.optionSets["service_city"]);
const streets = ref(optionSetsStore.optionSets["service_street"]);

const location = ref({});

const updateStreets = (event) => {
  if (event.value) {
    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_street", event.value.id)
      .then((data) => {
        streets.value = data;
      });
    isCitySelected.value = true;
  } else {
    isCitySelected.value = false;
  }
};
</script>

<style scoped lang="scss"></style>
