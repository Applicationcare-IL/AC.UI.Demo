<template>
  <div class="flex-1 card-container top-info-card">
    <Card>
      <template #title>
        <div class="flex flex-row justify-content-between">
          {{ $t("address.address") }}
          <WMLocationButton />
        </div>
      </template>
      <template #content>
        <div class="flex flex-auto flex-column gap-5">
          <div class="wm-form-row gap-5">
            <WMInputSearch
              v-if="editable"
              name="city"
              :highlighted="true"
              :label="$t('address.city') + ':'"
              :options="cities"
              width="152"
              :placeholder="$t('select', ['address.city'])"
              :modelValue="location.city"
              :option-set="true"
              @change="updateStreets"
            />
            <WMInput
              v-else
              name="city"
              :type="formType"
              :highlighted="true"
              :label="$t('address.city') + ':'"
              :value="location.city"
            />
            <WMInputSearch
              v-if="editable"
              name="street"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :options="streets"
              width="152"
              :placeholder="$t('select', ['address.street'])"
              :option-set="true"
              :modelValue="location.street"
            />
            <WMInput
              v-else
              name="street"
              :type="formType"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :value="location.street"
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
              name="entrance"
              :type="formType"
              :highlighted="true"
              :label="$t('address.entrance') + ':'"
              :value="location.entrance"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="zip"
              :type="formType"
              :label="$t('address.zip') + ':'"
              width="80"
              :value="location.zip"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";

const { location, editable } = defineProps({
  location: {
    type: Object,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const optionSetsStore = useOptionSetsStore();

const formType = computed(() => {
  return editable ? "input-text" : "info";
});

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
