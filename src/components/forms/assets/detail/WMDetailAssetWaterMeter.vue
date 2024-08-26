<template>
  <div class="flex-1 card-container">
    <Card class="p-card--first-top-card">
      <template #title>
        <div class="flex flex-row justify-content-between">
          {{ $t("asset.water-meter") }}
        </div>
      </template>
      <template #content>
        <div class="flex flex-auto flex-column gap-5">
          <div class="wm-form-row gap-5 align-items-start">
            <WMInput
              name="water-meter-number"
              type="info"
              :highlighted="true"
              :label="$t('asset.water-meter-number') + ':'"
              :value="asset.water_meter_number"
            />
            <WMInput
              name="water-meter-type"
              type="info"
              :highlighted="true"
              :label="$t('asset.water-meter-type') + ':'"
              :value="asset.water_meter_type"
            />
            <WMInput
              name="water-meter-installation-date"
              type="info"
              :highlighted="true"
              :label="$t('asset.water-meter-installation-date') + ':'"
              :value="asset.water_meter_installation_date"
            />
            <div class="wm-input flex flex-column">
              <label class="wm-form-label highlighted">
                {{ $t("asset.water-meter-status") }}
              </label>
              <WMStatusTag :status="asset.water_meter_status" />
            </div>
          </div>
          <div class="wm-form-row gap-5 align-items-start">
            <WMInput
              name="water-meter-reading"
              type="info"
              :highlighted="true"
              :label="$t('asset.water-meter-reading') + ':'"
              :value="asset.water_meter_reading"
            />
            <WMInput
              name="water-meter-reading-date"
              type="info"
              :highlighted="true"
              :label="$t('asset.water-meter-reading-date') + ':'"
              :value="asset.water_meter_reading_date"
            />
            <WMInput
              name="water-meter-brand"
              type="info"
              :highlighted="true"
              :label="$t('asset.water-meter-brand') + ':'"
              :value="asset.water_meter_brand"
            />
            <WMInput
              name="water-meter-location"
              type="info"
              :highlighted="true"
              :label="$t('asset.water-meter-location') + ':'"
              :value="asset.water_meter_location"
            />
          </div>
          <div class="wm-form-row gap-5"></div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { provide, ref } from "vue";

const props = defineProps({
  asset: {
    type: Object,
    required: true,
  },
});

const asset = ref(props.asset);

provide("asset", { asset });
</script>
