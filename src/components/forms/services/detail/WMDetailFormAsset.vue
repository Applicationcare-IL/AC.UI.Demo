<template>
  <div class="flex-1 card-container top-info-card">
    <Card>
      <template #title>
        <div class="flex flex-row justify-content-between">
          <div>{{ $t("asset.asset") + " " + asset.id }}</div>
        </div>
      </template>
      <template #content>
        <div class="flex">
          <div class="w-6 pr-4">
            <WMInput
              name="type"
              type="info"
              :highlighted="true"
              :label="$t('asset.type')"
              :value="asset.asset_type"
              option-set
            />
            <WMInput
              name="payer"
              type="info-link"
              :highlighted="true"
              :label="$t('asset.payer') + ':'"
              :value="asset.asset_payer.name"
              :to="'/customer/' + asset.asset_payer.id"
            />
          </div>
          <div class="w-6 pr-4">
            <WMInput
              name="owner"
              type="info-link"
              :highlighted="true"
              :label="$t('asset.owner') + ':'"
              :value="asset.asset_owner.name"
              :to="'/customer/' + asset.asset_owner.id"
            />
            <WMInput
              name="owner"
              type="info-link"
              :highlighted="true"
              :label="$t('asset.owner') + ':'"
              :value="asset.asset_owner.name"
              :to="'/customer/' + asset.asset_owner.id"
            />
          </div>
          <Divider layout="vertical" />
          <div class="w-6">
            <WMInput
              name="water-meter-number"
              type="info"
              :highlighted="true"
              :label="$t('asset.water_meter_number') + ':'"
              :value="asset.water_meter_number"
            />
            <WMInput
              name="water-meter-reading"
              type="info"
              :highlighted="true"
              :label="$t('asset.water_meter_reading') + ':'"
              :value="asset.water_meter_reading"
            />
          </div>
          <div class="w-6">
            <WMInput
              name="water-meter-status"
              type="info"
              :highlighted="true"
              :label="$t('asset.water_meter_status') + ':'"
              :value="asset.water_meter_status"
            />
            <WMInput
              name="water-meter"
              type="info"
              :highlighted="true"
              :label="$t('asset.water_last_meter_reading_date') + ':'"
              :value="asset.water_last_meter_reading_date"
            />
          </div>
          <div class="w-6">
            <WMInput
              name="water-meter-location"
              type="info"
              :highlighted="true"
              :label="$t('asset.water_meter_location') + ':'"
              :value="asset.water_meter_location"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  asset: {
    type: Object,
    required: true,
  },
});
</script>
