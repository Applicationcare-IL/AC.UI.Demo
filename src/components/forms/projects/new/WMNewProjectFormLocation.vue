<template>
  <h2 class="h2 mb-0">LOCATION</h2>
  <div class="wm-form-row gap-4">
    <WMSelectableButton label="city" v-model="showCityDataOptions" />
    <WMSelectableButton label="address" v-model="showAddressOptions" />
  </div>
  <div class="wm-form-row gap-5">
    <span v-if="showCityDataOptions"> CITY FIELDS </span>
    <span v-if="showAddressOptions"> ADDRESS FIELDS </span>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showCityDataOptions = ref(false);
const showAddressOptions = ref(false);
</script>

<style scoped lang="scss"></style>
