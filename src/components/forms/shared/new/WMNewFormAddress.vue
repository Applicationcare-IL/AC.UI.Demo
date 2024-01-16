<template>
  <div class="service-address flex flex-auto flex-column gap-5">
    <h2 class="h2 mb-0">{{ $t("address.address") }}</h2>

    <div class="wm-form-row gap-5">
      <WMInputSearch
        name="city"
        :highlighted="true"
        :label="$t('address.city') + ':'"
        :options="cities"
        width="152"
        :placeholder="$t('select', ['addres.city'])"
        :option-set="true"
        @change="updateStreets"
      />
      <div class="flex flex-row">
        <WMInputSearch
          name="street"
          :highlighted="true"
          :label="$t('address.street') + ':'"
          :options="streets"
          width="152"
          :placeholder="$t('select', ['address.street'])"
          :option-set="true"
        />
      </div>
    </div>
    <div class="wm-form-row gap-5">
      <WMInput
        name="house-number"
        type="input-text"
        :highlighted="true"
        :label="$t('address.house-number') + ':'"
        width="48"
      />
      <WMInput
        name="apartment"
        type="input-text"
        :highlighted="true"
        :label="$t('address.apartment') + ':'"
        width="48"
      />
      <WMInput
        name="entrance"
        type="input-select"
        :highlighted="true"
        :label="$t('address.entrance') + ':'"
        :options="formUtilsStore.getAlphabet"
        width="48"
      />
    </div>
    <div class="wm-form-row gap-5">
      <WMInputSearch
        name="zip"
        :label="$t('address.zip') + ':'"
        :options="zips"
        width="80"
        :placeholder="$t('select', ['addres.zip'])"
        :option-set="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();

const cities = ref(optionSetsStore.optionSets["service_city"]);
const streets = ref(optionSetsStore.optionSets["service_street"]);
const zips = ref(optionSetsStore.optionSets["zip"]);

const updateStreets = (city) => {
  if (city) {
    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_street", city.value.id)
      .then((data) => {
        streets.value = data;
      });
  }
};
</script>
