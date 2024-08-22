<template>
  <div class="flex flex-column gap-3">
    <div class="wm-form-label highlighted">{{ $t("message.organization-type") }}:</div>
    <div class="flex gap-3">
      <WMSelectableMultipleButtonGroup
        :options="organizationTypes"
        @update:selected-options="handleChangeCustomerTypes"
      />
    </div>

    <WMInputSearch
      name="customer_service_areas"
      :label="$t('message.service-area') + ':'"
      :placeholder="$t('message.select-service-area')"
      :multiple="true"
      size="md"
      :options="areas"
      :highlighted="true"
    />

    <div class="wm-form-label highlighted">{{ $t("rating") }}:</div>
    <div class="flex gap-3">
      <WMSelectableMultipleButtonGroup
        :options="customerRatingOptions"
        @update:selected-options="handleChangeCustomerRatings"
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

// REFS
const organizationTypes = ref([]);
const areas = ref([]);
const customerRatingOptions = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleChange: handleChangeCustomerTypes } = useField("customer_types", undefined, {
  initialValue: [],
});

const { handleChange: handleChangeCustomerRatings } = useField("customer_ratings", undefined, {
  initialValue: [],
});

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await optionSetsStore.getOptionSetValuesFromApiRaw("customer_type").then((data) => {
    // TEMPORAL FILTER - backend response is dirty
    data = data.filter((item) => item.value === "private" || item.name === "business");

    organizationTypes.value = data.map((item) => ({
      label: item[optionLabelWithLang.value],
      value: item.id,
    }));
  });

  await optionSetsStore.getOptionSetValuesFromApiRaw("customer_rating").then((data) => {
    // TEMPORAL FILTER - backend response is dirty
    data = data.filter((item) => item.value === "regular" || item.name === "vip");

    customerRatingOptions.value = data.map((item) => ({
      label: item[optionLabelWithLang.value],
      value: item.id,
    }));
  });

  // const serviceAreaOptions = optionSetsStore
  //   .getOptionSetValuesFromApiRaw("service_area")
  //   .then((data) => (areas.value = data));
});
</script>

<style scoped></style>
