<template>
  <Card>
    <template #title>
      {{ $t("project.contractor-selection-method") }}
    </template>
    <template #content>
      <div class="wm-form-row gap-5">
        <WMInput
          name="contractor-option"
          type="input-select-button"
          :highlighted="true"
          :options="contractorOptions"
          :value="contractorOptions[0]"
          @update:selected-item="handleContractorOptionsChange"
        />
      </div>
      <div
        v-if="contractorSelectedOption.value === 'tender'"
        class="wm-form-row gap-5 align-items-start mt-5"
      >
        <WMInput
          name="quality-committee-required"
          type="input-select-button"
          :highlighted="true"
          :label="$t('project.quality-committee-required') + ':'"
          :options="yesNoOptions"
          :value="yesNoOptions[0]"
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
          id="contractor-option-site-tour-date"
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
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";

const { t } = useI18n();

const optionSetsStore = useOptionSetsStore();

const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");
const isSiteTourNeeded = ref(yesNoOptions[1]);

const contractorOptions = ref([
  {
    value: "competition-process",
    name: t("project.competition-process-by-virtue-of-a-framework"),
    label: t("project.competition-process-by-virtue-of-a-framework"),
  },
  { value: "tender", name: t("project.tender"), label: t("project.tender") },
]);

const contractorSelectedOption = ref(contractorOptions.value[0]);

const handleContractorOptionsChange = (option) => {
  contractorSelectedOption.value = option;
};

const handleSiteTourNeededOptionsChange = (option) => {
  isSiteTourNeeded.value = option;
};
</script>

<style scoped lang="scss"></style>
