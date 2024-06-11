<template>
  <WMTempButton :text="viewMapTextButton" type="secondary" size="small" @click="toggle">
    <template #customIcon>
      <div class="flex" v-html="MapIcon" />
    </template>
  </WMTempButton>

  <OverlayPanel ref="isOpen">
    <div class="flex mb-4">
      <div v-if="showAddressData" class="flex-1">
        <h4 class="h4">{{ $t("address.address") }}</h4>
        <div class="flex flex-auto gap-5 mb-4 flex-row">
          <WMInput
            :value="location.city"
            type="info"
            name="map-city"
            :label="$t('address.city')"
            :option-set="true"
          />
          <WMInput
            :value="location.street"
            type="info"
            name="map-street"
            :label="$t('address.street')"
            :option-set="true"
          />
        </div>
        <div class="flex flex-auto gap-5 flex-row">
          <WMInput
            :value="location.neighborhood"
            type="info"
            name="map-neighborhood"
            :label="$t('address.neighborhood')"
            :option-set="true"
          />
          <WMInput
            :value="location.house_number"
            type="info"
            name="map-house_number"
            :label="$t('address.house-number')"
          />
        </div>
      </div>
      <Divider v-if="showAddressData && showCityData" layout="vertical" />
      <div v-if="showCityData" class="flex-1">
        <h4 class="h4">{{ $t("address.city_data") }}</h4>
        <div class="flex flex-auto gap-5 mb-4 flex-row">
          <WMInput
            :value="location.block"
            type="info"
            name="map-block"
            :label="$t('address.block')"
          />
          <WMInput
            :value="location.parcel"
            type="info"
            name="map-parcel"
            :label="$t('address.parcel')"
          />
        </div>
        <div class="flex flex-auto gap-5 flex-row">
          <WMInput
            :value="location.sub_parcel"
            type="info"
            name="map-sub-parcel"
            :label="$t('address.sub-parcel')"
          />
        </div>
      </div>
    </div>
    <WMLocationMap :editable="props.editable" size="large" />
  </OverlayPanel>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { useI18n } from "vue-i18n";

import MapIcon from "/icons/location_on_default.svg?raw";

const { t } = useI18n();

const { location } = inject("location", {});

const isOpen = ref();

const toggle = (event) => {
  isOpen.value.toggle(event);
};

const viewMapTextButton = computed(() => {
  if (props.label) {
    return props.label;
  }

  return t("buttons.view_map");
});

const showAddressData = computed(() => {
  if (location.value.city && location.value.street) {
    return true;
  }

  return false;
});

const showCityData = computed(() => {
  if (location.value.block || location.value.parcel || location.value.sub_parcel) {
    return true;
  }

  return false;
});

const props = defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
});
</script>
