<template>
  <Card>
    <template #title> Tender information </template>
    <template #content>
      <div class="wm-form-row align-items-start gap-5">
        <WMInput
          name="quality-committee-required"
          type="input-select-button"
          :highlighted="true"
          :label="$t('project.quality-committee-required') + ':'"
          :options="yesNoOptions"
          :selected-option="yesNoOptions[1]"
          width="80"
        />

        <WMInput
          name="site-tour-needed"
          type="input-select-button"
          :highlighted="true"
          :label="$t('project.site-tour-needed') + ':'"
          :options="yesNoOptions"
          :value="isSiteTourNeeded"
          width="80"
          @update:selected-item="handleSiteTourNeededOptionsChange"
        />

        <WMInput
          id="site-tour-date"
          type="date"
          :label="$t('project.site-tour-date') + ':'"
          name="site-tour-date"
          :disabled="!isSiteTourNeeded.value"
        />
      </div>
    </template>
  </Card>
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
