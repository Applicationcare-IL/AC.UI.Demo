<template>
  <p class="p-card-title mt-5">Tender information</p>

  <div class="wm-form-row gap-5">
    <WMInput
      name="quality-committee-required"
      type="input-select-button"
      :highlighted="true"
      :label="'quality committee required' + ':'"
      :options="yesNoOptions"
      :selectedOption="yesNoOptions[1]"
      width="80"
    />

    <WMInput
      name="site-tour-needed"
      type="input-select-button"
      :highlighted="true"
      :label="'site tour needed' + ':'"
      :options="yesNoOptions"
      :value="isSiteTourNeeded"
      @update:selectedItem="handleSiteTourNeededOptionsChange"
      width="80"
    />

    <WMInput
      type="date"
      :label="'Site tour date'"
      id="site-tour-date"
      name="site-tour-date"
      :disabled="!isSiteTourNeeded.value"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");
const isSiteTourNeeded = ref(yesNoOptions[1]);

const handleSiteTourNeededOptionsChange = (option) => {
  isSiteTourNeeded.value = option;
};
</script>

<style scoped lang="scss"></style>
