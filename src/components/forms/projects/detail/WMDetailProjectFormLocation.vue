<template>
  <Card>
    <template #title>
      <div class="flex flex-row justify-content-between">
        <div>{{ $t("project.location_information") }}</div>
        <WMLocationButton :editable="true" />
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
            <div class="wm-form-row flex-wrap gap-5 mt-3">
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
                @blur="handleCityBlur"
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
                :highlighted="true"
                :label="$t('address.house-number') + ':'"
                :disabled="!isCitySelected"
                required
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
            <div class="wm-form-row flex-wrap gap-5 mt-3">
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
// IMPORTS
import { onMounted, provide, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

// REFS
const showCityDataOptions = ref(false);
const showAddressOptions = ref(false);

const isCitySelected = ref(false);

const cities = ref();
const streets = ref();
const neighborhoods = ref();

const location = ref("");

// COMPUTED

// COMPONENT METHODS AND LOGIC
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

const handleCityBlur = () => {
  if (!location.value.city) {
    isCitySelected.value = false;
  }
};

// PROVIDE, EXPOSE
provide("location", { location });

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  cities.value = await optionSetsStore.getOptionSetValues("service_city");
  streets.value = await optionSetsStore.getOptionSetValues("service_street");
  neighborhoods.value = await optionSetsStore.getOptionSetValues("service_neighborhood");

  if (props.project.location?.street && props.project.location?.city) {
    showAddressOptions.value = true;
    isCitySelected.value = true;
  }

  if (props.project.location?.block || props.project.location?.parcel) {
    showCityDataOptions.value = true;
  }

  location.value = props.project.location ? props.project.location : {};
});
</script>

<style scoped lang="scss"></style>
