<template>
  <Card>
    <template #title> Location information </template>
    <template #content>
      <div class="flex">
        <div class="w-6">
          <WMSelectableButton label="city" v-model="showCityDataOptions" />
          <span v-if="showCityDataOptions"> CITY FIELDS </span>
        </div>

        <div class="w-6 pr-4 address-section">
          <WMSelectableButton label="address" v-model="showAddressOptions" />
          <span v-if="showAddressOptions"> ADDRESS FIELDS </span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";

const showCityDataOptions = ref(false);
const showAddressOptions = ref(false);
</script>

<style scoped lang="scss">
.address-section {
  border-right: 1px solid var(--gray-400);
}
</style>
