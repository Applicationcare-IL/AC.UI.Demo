<template>
  <div class="service-address flex flex-auto flex-column gap-5">
    <h2 class="h2 mb-0">{{ $t("address.address") }}</h2>

    <div class="wm-form-row gap-5">
      <WMInputSearch
        name="city"
        :highlighted="true"
        :label="$t('address.city') + ':'"
        :options="cities"
        :placeholder="$t('select', ['address.city'])"
        :option-set="true"
        :required="isCityRequired"
        :data-test-id="entity + '.form.city'"
        @change="updateStreets"
      />

      <WMInputSearch
        name="street"
        :highlighted="true"
        :label="$t('address.street') + ':'"
        :options="streets"
        :placeholder="$t('select', ['address.street'])"
        :option-set="true"
        :required="isStreetRequired"
        :data-test-id="entity + '.form.street'"
      />

      <WMInputSearch
        name="neighborhood"
        :highlighted="true"
        :label="$t('address.neighborhood') + ':'"
        :options="neighborhoods"
        :placeholder="$t('select', ['address.neighborhood'])"
        :option-set="true"
        :data-test-id="entity + '.form.neighborhood'"
      />
    </div>
    <div class="wm-form-row gap-5">
      <WMInput
        name="house-number"
        type="input-text"
        :highlighted="true"
        :label="$t('address.house-number') + ':'"
        size="xs"
        value="1"
        :data-test-id="entity + '.form.house-number'"
      />
      <WMInput
        name="apartment"
        type="input-text"
        :highlighted="true"
        :label="$t('address.apartment') + ':'"
        size="xs"
        :data-test-id="entity + '.form.apartment'"
      />
      <WMInput
        name="entrance"
        type="input-select"
        :highlighted="true"
        :label="$t('address.entrance') + ':'"
        :options="formUtilsStore.getAlphabet"
        size="xs"
        :data-test-id="entity + '.form.entrance'"
      />
    </div>
    <div class="wm-form-row gap-5">
      <WMInputSearch
        name="zip"
        :label="$t('address.zip') + ':'"
        :options="zips"
        :placeholder="$t('select', ['address.zip'])"
        :option-set="true"
        size="sm"
        :data-test-id="entity + '.form.zip'"
      />

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();

const props = defineProps({
  requiredFields: {
    type: Array,
    default: () => [],
  },
  entity: {
    type: String,
    default: '',
  }
});

const isCityRequired = computed(() => {
  return props.requiredFields?.includes("city");
});

const isStreetRequired = computed(() => {
  return props.requiredFields?.includes("street");
});

const cities = ref();
const streets = ref();
const neighborhoods = ref();

const zips = ref();

onMounted(async () => {
  cities.value = await optionSetsStore.getOptionSetValues("service_city");
  streets.value = await optionSetsStore.getOptionSetValues("service_street");
  neighborhoods.value = await optionSetsStore.getOptionSetValues("service_neighborhood");
  zips.value = await optionSetsStore.getOptionSetValues("zip");
});

const updateStreets = (city) => {
  if (city) {
    optionSetsStore.getOptionSetValuesFromApiRaw("service_street", city.value.id).then((data) => {
      streets.value = data;
    });

    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_neighborhood", city.value.id)
      .then((data) => {
        neighborhoods.value = data;
      });
  }
};
</script>
