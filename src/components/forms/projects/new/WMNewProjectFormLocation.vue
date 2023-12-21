<template>
  <h2 class="h2 mb-0">LOCATION</h2>
  <div class="wm-form-row gap-4">
    <WMSelectableButton
      :label="$t('project.address')"
      v-model="showAddressOptions"
    />
    <WMSelectableButton
      :label="$t('project.city_data')"
      v-model="showCityDataOptions"
    />
  </div>
  <div class="wm-form-row gap-5">
    <div v-if="showAddressOptions">
      <h5 class="h5">{{ $t("project.address") }}</h5>
      <div class="wm-form-row gap-5">
        <div class="wm-form-column gap-5">
          <WMInputSearch
            name="city"
            :highlighted="true"
            :required="true"
            :label="$t('address.city') + ':'"
            :options="cities"
            width="152"
            :placeholder="$t('select', ['addres.city'])"
            @change="updateStreets"
            :optionSet="true"
          />
          <div class="flex flex-row gap-5 mt-2 mb-2">
            <WMInputSearch
              name="street"
              :required="true"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :options="streets"
              width="152"
              :placeholder="$t('select', ['address.street'])"
              :optionSet="true"
            />
            <!-- <WMInput
              name="neighborhood"
              type="info"
              :highlighted="true"
              :label="$t('address.neighborhood') + ':'"
              value="שם של שכונה"
              class="is-mocked"
            /> -->
          </div>

          <WMInput
            name="house-number"
            type="input-text"
            :highlighted="true"
            :label="$t('address.house-number') + ':'"
          />
        </div>
        <WMLocationMap />
      </div>
    </div>
  </div>
  <div v-if="showCityDataOptions">
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
import { ref } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const showCityDataOptions = ref(false);
const showAddressOptions = ref(false);

const cities = ref(optionSetsStore.optionSets["service_city"]);
const streets = ref(optionSetsStore.optionSets["service_street"]);

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

<style scoped lang="scss"></style>
