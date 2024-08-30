<template>
  <div class="flex flex-column gap-3">
    <div class="wm-form-label highlighted">{{ $t("message.organization-type") }}:</div>
    <div class="flex gap-3">
      <!-- {{ message.customer_types }} -->
      <WMSelectableMultipleButtonGroup
        v-if="organizationTypes.length"
        :options="organizationTypes"
        :value="Object.keys(message).length ? message.customer_types.map((item) => item.id) : null"
        @update:selected-options="handleOrganizationTypesChanges"
      />
    </div>

    <WMInputSearch
      :model-value="selectedServiceAreas"
      name="customer_service_areas"
      :label="$t('message.service-area') + ':'"
      :placeholder="$t('message.select-service-area')"
      :multiple="true"
      size="md"
      :options="areas"
      :highlighted="true"
      option-set
    />

    <div class="wm-form-label highlighted">{{ $t("rating") }}:</div>
    <div class="flex gap-3">
      <WMSelectableMultipleButtonGroup
        v-if="customerRatingOptions.length"
        :options="customerRatingOptions"
        :value="
          Object.keys(message).length ? message.customer_ratings.map((item) => item.id) : null
        "
        @update:selected-options="handleCustomerRatingsChanges"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { optionLabelWithLang } = useLanguages();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const organizationTypes = ref([]);
const areas = ref([]);
const customerRatingOptions = ref([]);
const selectedServiceAreas = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleChange: handleChangeCustomerTypes, setTouched: setCustomerTypesTouched } = useField(
  "customer_types",
  undefined,
  {
    initialValue: [],
  }
);

const { handleChange: handleChangeCustomerRatings, setTouched: setCustomerRatingsTouched } =
  useField("customer_ratings", undefined, {
    initialValue: [],
  });

const handleOrganizationTypesChanges = (selectedOptions) => {
  handleChangeCustomerTypes(selectedOptions);
  setCustomerTypesTouched(true);
};

const handleCustomerRatingsChanges = (selectedOptions) => {
  handleChangeCustomerRatings(selectedOptions);
  setCustomerRatingsTouched(true);
};

const loadOrganizationTypes = async () => {
  await optionSetsStore.getOptionSetValuesFromApiRaw("customer_type").then((data) => {
    // TEMPORAL FILTER - backend response is dirty
    data = data.filter((item) => item.value === "private" || item.name === "business");

    organizationTypes.value = data.map((item) => ({
      label: item[optionLabelWithLang.value],
      value: item.id,
    }));
  });
};

const loadCustomerRatingOptions = async () => {
  await optionSetsStore.getOptionSetValuesFromApiRaw("customer_rating").then((data) => {
    // TEMPORAL FILTER - backend response is dirty
    data = data.filter((item) => item.value === "regular" || item.name === "vip");

    customerRatingOptions.value = data.map((item) => ({
      label: item[optionLabelWithLang.value],
      value: item.id,
    }));
  });
};

const loadServiceAreas = async () => {
  await optionSetsStore
    .getOptionSetValuesFromApiRaw("service_area")
    .then((data) => (areas.value = data));
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadOrganizationTypes();
  await loadCustomerRatingOptions();
  await loadServiceAreas();

  if (props.message) {
    // filter areas by customer_service_areas ids
    selectedServiceAreas.value = props.message.customer_service_areas;
  }
});
</script>

<style scoped></style>
