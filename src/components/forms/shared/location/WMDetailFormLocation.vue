<template>
  <div class="flex-1 card-container top-info-card">
    <Card>
      <template #title>
        <div class="flex flex-row justify-content-between">
          {{ $t("address.address") }}
          <WMButton name="location" icon="location" @click="">{{
            $t("location")
          }}</WMButton>
        </div>
      </template>
      <template #content>
        <div class="flex flex-auto flex-column gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
              name="city"
              type="info"
              :highlighted="true"
              :label="$t('address.city') + ':'"
              :value="location.city"
            />
            <WMInput
              name="street"
              type="info"
              :highlighted="true"
              :label="$t('address.street') + ':'"
              :value="location.street"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="house-number"
              type="info"
              :label="$t('address.house-number') + ':'"
              width="48"
              :value="location.house_number"
            ></WMInput>
            <WMInput
              name="apartment"
              type="info"
              :label="$t('address.apartment') + ':'"
              width="48"
              :value="location.apartment"
            />
            <WMInput
              name="entrance"
              type="info"
              :highlighted="true"
              :label="$t('address.entrance') + ':'"
              :value="location.entrance"
            />
            <WMInput
              name="zip"
              type="info"
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
const { location } = defineProps({
  location: {
    type: Object,
    required: true,
  },
});
</script>
