<template>
  <div class="flex-1 card-container top-info-card">
    <Card>
      <template #title>
        <div class="flex flex-row justify-content-between">
          {{ $t("address.address") }}
          <WMLocationButton :editable="false" />
        </div>
      </template>
      <template #content>
        <div v-if="location" class="flex flex-auto flex-column gap-5">
          <div class="wm-form-row gap-5">
            <WMInputSearch
              v-if="editable"
              v-model="location.city"
              name="city"
              :highlighted="true"
              :label="$t('address.city') + ':'"
              :options="cities"
              width="152"
              :placeholder="$t('select', ['address.city'])"
              :option-set="true"
              @change="updateStreets"
            />
            <WMInput
              v-else
              name="city"
              :type="formType"
              :highlighted="true"
              :label="$t('address.city') + ':'"
              :value="location.city ? location.city[optionLabelWithLang] : ''"
            />

            <WMInputSearch
              v-if="editable"
              v-model="location.street"
              name="street"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :options="streets"
              width="152"
              :placeholder="$t('select', ['address.street'])"
              :option-set="true"
              :disabled="!isCitySelected"
            />

            <WMInput
              v-else
              name="street"
              :type="formType"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :value="
                location.street ? location.street[optionLabelWithLang] : ''
              "
            />

            <WMInputSearch
              v-if="editable"
              v-model="location.neighborhood"
              name="neighborhood"
              :highlighted="true"
              :label="$t('address.neighborhood') + ':'"
              :options="neighborhoods"
              width="152"
              :placeholder="$t('select', ['address.neighborhood'])"
              :option-set="true"
            />

            <WMInput
              v-else
              name="neighborhood"
              :type="formType"
              :highlighted="true"
              :label="$t('address.neighborhood') + ':'"
              :value="
                location.neighborhood
                  ? location.neighborhood[optionLabelWithLang]
                  : ''
              "
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="house-number"
              :type="formType"
              :label="$t('address.house-number') + ':'"
              width="48"
              :value="location.house_number"
            ></WMInput>
            <WMInput
              name="apartment"
              :type="formType"
              :label="$t('address.apartment') + ':'"
              width="48"
              :value="location.apartment"
            />
            <WMInput
              v-if="editable"
              name="entrance"
              type="input-select"
              :label="$t('address.entrance') + ':'"
              :options="alphabet"
              width="60"
              :value="location.entrance"
            />
            <WMInput
              v-else
              name="entrance"
              :type="formType"
              :highlighted="true"
              :label="$t('address.entrance') + ':'"
              :value="location.entrance"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInputSearch
              v-if="editable"
              name="zip"
              :label="$t('address.zip') + ':'"
              :options="zips"
              width="80"
              :placeholder="$t('select', ['address.zip'])"
              :option-set="true"
            />
            <WMInput
              v-else
              name="zip"
              :type="formType"
              :highlighted="true"
              :label="$t('address.zip') + ':'"
              :value="location.zip"
            />
          </div>
        </div>
        <div v-else>No location Data</div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

const formUtilsStore = useFormUtilsStore();

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const location = ref(props.location);

provide("location", { location });

const optionSetsStore = useOptionSetsStore();
const alphabet = ref(formUtilsStore.getAlphabet);

const formType = computed(() => {
  return props.editable ? "input-text" : "info";
});

const cities = ref(optionSetsStore.optionSets["service_city"]);
const streets = ref(optionSetsStore.optionSets["service_street"]);
const neighborhoods = ref(optionSetsStore.optionSets["service_neighborhood"]);
const zips = ref(optionSetsStore.optionSets["zip"]);

const selectedCity = ref();
const selectedSteet = ref();
const isCitySelected = ref(false);
const selectedZip = ref();

const { optionLabelWithLang } = useLanguages();

const selectedEntrance = computed(() => {
  return alphabet.value.find(
    (letter) => letter.value === props.location.entrance
  );
});

onMounted(() => {
  if (props.location?.street && props.location?.city) {
    isCitySelected.value = true;

    // selectedCity.value = cities.value.find(
    //   (city) => city.id === props.location.city?.id
    // );

    // selectedSteet.value = streets.value.find(
    //   (street) => street.id === props.location.street?.id
    // );

    // selectedZip.value = zips.value.find((zip) => zip.id === props.location.zip);
  }
});

const updateStreets = (city) => {
  if (city) {
    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_street", city.value.id)
      .then((data) => {
        streets.value = data;
      });

    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_neighborhood", city.value.id)
      .then((data) => {
        neighborhoods.value = data;
      });

    isCitySelected.value = true;
  } else {
    isCitySelected.value = false;
  }
};
</script>
