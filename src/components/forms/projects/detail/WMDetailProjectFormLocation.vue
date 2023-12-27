<template>
  <Card>
    <template #title>
      <div class="flex flex-row justify-content-between">
        <div>{{ $t("project.location_information") }}</div>
        <WMLocationButton></WMLocationButton>
      </div>
    </template>
    <template #content>
      <div class="flex">
        <div class="w-6 pr-4">
          <WMSelectableButton
            :label="$t('project.address')"
            v-model="showAddressOptions"
          />

          <div v-if="showAddressOptions">
            <div class="wm-form-row gap-5 mt-3">
              <WMInputSearch
                name="city"
                :highlighted="true"
                :required="true"
                :label="$t('address.city') + ':'"
                :options="cities"
                :modelValue="selectedCity"
                width="152"
                :placeholder="$t('select', ['addres.city'])"
                @change="updateStreets"
                :optionSet="true"
              />

              <div class="flex flex-row gap-5">
                <WMInputSearch
                  name="street"
                  :required="true"
                  :highlighted="true"
                  :label="$t('address.street') + ':'"
                  :options="streets"
                  :modelValue="selectedSteet"
                  v-model="selectedSteet"
                  width="152"
                  :placeholder="$t('select', ['address.street'])"
                  :optionSet="true"
                  :disabled="!isCitySelected"
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
                :value="props.project.location.house_number"
              />
            </div>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="w-6">
          <WMSelectableButton
            :label="$t('project.city_data')"
            v-model="showCityDataOptions"
          />
          <div v-if="showCityDataOptions">
            <div class="wm-form-row gap-5 mt-3">
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
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";

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
});

const updateStreets = (event) => {
  if (event.value) {
    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_street", event.value.id)
      .then((data) => {
        streets.value = data;
      });

    isCitySelected.value = true;
  } else {
    selectedSteet.value = null;
    isCitySelected.value = false;
  }
};
</script>

<style scoped lang="scss"></style>
