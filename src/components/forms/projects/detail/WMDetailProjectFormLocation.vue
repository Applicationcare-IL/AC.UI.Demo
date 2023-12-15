<template>
  <Card>
    <template #title>
      <div class="flex flex-row justify-content-between">
        <div>נתוני מיקום</div>
        <WMLocationButton></WMLocationButton>
      </div>
    </template>
    <template #content>
      <div class="flex">
        <div class="w-6 pr-4">
          <WMSelectableButton label="כתובת" v-model="showAddressOptions" />
          <div v-if="showAddressOptions">
            <div class="wm-form-row gap-5">
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
              />
              <div class="flex flex-row gap-5">
                <WMInputSearch
                  name="street"
                  :required="true"
                  :highlighted="true"
                  :label="$t('address.street') + ':'"
                  :options="streets"
                  :modelValue="selectedSteet"
                  width="152"
                  :placeholder="$t('select', ['address.street'])"
                />
                <WMInput
                  name="neighborhood"
                  type="info"
                  :highlighted="true"
                  label="שכונה:"
                  value="שם של שכונה"
                  class="is-mocked"
                />
              </div>
              <WMInput
                name="house-number"
                type="input-text"
                :highlighted="true"
                :label="$t('address.house-number') + ':'"
              />
            </div>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="w-6">
          <WMSelectableButton
            label="מידע עירוני"
            v-model="showCityDataOptions"
          />
          <div v-if="showCityDataOptions">
            <div class="wm-form-row gap-5">
              <WMInput
                name="block"
                type="input-text"
                :highlighted="true"
                label="גוש:"
                required
              />
              <WMInput
                name="parcel"
                type="input-text"
                :highlighted="true"
                label="חלקה:"
                required
              />
              <WMInput
                name="sub-parcel"
                type="input-text"
                :highlighted="true"
                label="תת-חלקה:"
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

const cities = ref(optionSetsStore.optionSets["service_city"]);
const streets = ref(optionSetsStore.optionSets["service_street"]);

onMounted(() => {
  if (props.project.location.street && props.project.location.city) {
    showAddressOptions.value = true;
  }

  selectedCity.value = cities.value.find(
    (city) => city.id === props.project.location.city.id
  );

  selectedSteet.value = streets.value.find(
    (street) => street.id === props.project.location.street.id
  );
});

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
