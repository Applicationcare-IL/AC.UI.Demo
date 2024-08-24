<template>
  <div class="flex-1 card-container">
    <Card class="p-card--first-top-card">
      <template #title>
        <div class="flex flex-row justify-content-between">
          {{ $t("address.address") }}
          <WMLocationButton :editable="false" />
        </div>
      </template>
      <template #content>
        <div v-if="location" class="flex flex-auto flex-column gap-5">
          <div class="wm-form-row gap-5 align-items-start">
            <WMInput
              name="country"
              :type="formType"
              :highlighted="true"
              :label="$t('address.country') + ':'"
              :value="location.country ? location.country[optionLabelWithLang] : ''"
            />
            <WMInput
              name="city"
              :type="formType"
              :highlighted="true"
              :label="$t('address.city') + ':'"
              :value="location.city ? location.city[optionLabelWithLang] : ''"
            />

            <WMInput
              name="street"
              :type="formType"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :value="location.street ? location.street[optionLabelWithLang] : ''"
            />

            <WMInput
              name="house-number"
              :type="formType"
              :label="$t('address.house-number') + ':'"
              width="48"
              :value="location.house_number"
            ></WMInput>
          </div>
          <div class="wm-form-row gap-5 align-items-start">
            <WMInput
              name="floor"
              :type="formType"
              :label="$t('address.floor') + ':'"
              width="48"
              :value="location.floor"
            />
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
              name="neighborhood"
              :type="formType"
              :highlighted="true"
              :label="$t('address.neighborhood') + ':'"
              :value="location.neighborhood ? location.neighborhood[optionLabelWithLang] : ''"
            />
            <WMInput
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
  <div class="flex-1 card-container">
    <Card>
      <template #title>
        <div class="flex flex-row justify-content-between">
          {{ $t("address.city-information") }}
        </div>
      </template>
      <template #content>
        <div v-if="location" class="flex flex-auto flex-column gap-5">
          <div class="wm-form-row gap-5 align-items-start">
            <WMInput
              name="block"
              :type="formType"
              :highlighted="true"
              :label="$t('address.block') + ':'"
              :value="location.block"
            />
            <WMInput
              name="city"
              :type="formType"
              :highlighted="true"
              :label="$t('address.city') + ':'"
              :value="location.city ? location.city[optionLabelWithLang] : ''"
            />

            <WMInput
              name="street"
              :type="formType"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :value="location.street ? location.street[optionLabelWithLang] : ''"
            />
          </div>
          <div class="wm-form-row gap-5 align-items-start">
            <WMInput
              name="floor"
              :type="formType"
              :label="$t('address.floor') + ':'"
              width="48"
              :value="location.floor"
            />
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
          <Divider />
          <div class="wm-form-row gap-5 align-items-start">
            <WMInput
              name="size"
              :type="formType"
              :label="$t('address.size') + ':'"
              width="48"
              :value="location.size"
            />
            <WMInput
              name="net-size"
              :type="formType"
              :label="$t('address.net-size') + ':'"
              width="48"
              :value="location.net_size"
            />
            <WMInput
              name="last-measurement-date"
              :type="formType"
              :highlighted="true"
              :label="$t('address.last-measurement-date') + ':'"
              :value="location.last_measurement_date"
            />
          </div>
        </div>
        <div v-else>No location Data</div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { provide, ref } from "vue";

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
});

const location = ref(props.location);

provide("location", { location });
</script>
