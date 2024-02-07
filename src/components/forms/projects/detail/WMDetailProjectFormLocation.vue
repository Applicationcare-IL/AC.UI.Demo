<template>
  <Card>
    <template #title>
      <div class="flex flex-row justify-content-between">
        <div>{{ $t("project.location_information") }}</div>
        <WMLocationButton />
      </div>
    </template>
    <template #content>
      <div class="flex">
        <div class="w-6 pr-4">
          <WMSelectableButton
            v-model="showAddressOptions"
            :label="$t('project.address')"
          />

          <div v-if="showAddressOptions">
            <div class="wm-form-row gap-5 mt-3">
              <WMInputSearch
                v-model="selectedCity"
                name="city"
                :highlighted="true"
                :required="true"
                :label="$t('address.city') + ':'"
                :options="cities"
                width="152"
                :placeholder="$t('select', ['addres.city'])"
                :option-set="true"
                @change="updateStreets($event), updateCityData($event)"
              />

              <div class="flex flex-row gap-5">
                <WMInputSearch
                  v-model="selectedSteet"
                  name="street"
                  :required="true"
                  :highlighted="true"
                  :label="$t('address.street') + ':'"
                  :options="streets"
                  :model-value="selectedSteet"
                  width="152"
                  :placeholder="$t('select', ['address.street'])"
                  :option-set="true"
                  :disabled="!isCitySelected"
                  @change="updateStreetData($event)"
                />
                <!-- <WMInput
                  name="neighborhood"
                  type="info"
                  :highlighted="true"
                  label="שכונה:"
                  value="שם של שכונה"
                  class="is-mocked"
                /> -->
              </div>
              <WMInput
                name="house-number"
                type="input-text"
                :highlighted="true"
                :label="$t('address.house-number') + ':'"
                :disabled="!isCitySelected"
                required
                :value="props.project.location?.house_number"
              />
            </div>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="w-6">
          <WMSelectableButton
            v-model="showCityDataOptions"
            :label="$t('project.city_data')"
          />
          <div v-if="showCityDataOptions">
            <div class="wm-form-row gap-5 mt-3">
              <WMInput
                name="block"
                type="input-text"
                :highlighted="true"
                :label="$t('address.block') + ':'"
                :value="props.project.location?.block"
              />
              <WMInput
                name="parcel"
                type="input-text"
                :highlighted="true"
                :label="$t('address.parcel') + ':'"
                :value="props.project.location?.parcel"
              />
              <WMInput
                name="sub-parcel"
                type="input-text"
                :highlighted="true"
                :label="$t('address.sub-parcel') + ':'"
                :value="props.project.location?.sub_parcel"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";
const utilsStore = useUtilsStore();

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const optionSetsStore = useOptionSetsStore();

const showCityDataOptions = ref(false);
const showAddressOptions = ref(false);

const selectedCity = ref();
const selectedSteet = ref();

const isCitySelected = ref(false);

const cities = ref(optionSetsStore.optionSets["service_city"]);
const streets = ref(optionSetsStore.optionSets["service_street"]);

onMounted(() => {
  if (props.project.location?.street && props.project.location?.city) {
    showAddressOptions.value = true;
    isCitySelected.value = true;

    selectedCity.value = cities.value.find(
      (city) => city.id === props.project.location.city.id
    );

    selectedSteet.value = streets.value.find(
      (street) => street.id === props.project.location.street.id
    );
  }

  if (props.project.location?.block || props.project.location?.parcel) {
    showCityDataOptions.value = true;
  }
});

const updateStreets = (event) => {
  if (event.value) {
    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_street", event.value.id)
      .then((data) => {
        streets.value = data;
      });

    // clear the street value if the city is changed
    selectedSteet.value = "";
    // also clean it in the selected element
    utilsStore.selectedElements[utilsStore.entity][0]["location"].street = "";

    isCitySelected.value = true;
  } else {
    selectedSteet.value = null;
    isCitySelected.value = false;
  }
};

// We use this function to update in "real time" the data of the selected elements,
// that we use in WMLocationButton to show te map
const updateCityData = (event) => {
  utilsStore.selectedElements[utilsStore.entity][0]["location"].city =
    event.value;
};

const updateStreetData = (event) => {
  utilsStore.selectedElements[utilsStore.entity][0]["location"].street =
    event.value;
};
</script>

<style scoped lang="scss"></style>
