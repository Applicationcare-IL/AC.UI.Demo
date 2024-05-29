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
          :value="contractorSelectedOption"
          :disabled="!isEditable"
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
          :value="qualityCommitteeSelectedOption"
          width="80"
          :disabled="!isEditable"
        />

        <WMInput
          name="site-tour-needed"
          type="input-select-button"
          :highlighted="true"
          :label="$t('project.site-tour-needed') + ':'"
          :options="yesNoOptions"
          :value="siteTourNeededSelectedOption"
          width="80"
          :disabled="!isEditable"
          @update:selected-item="handleSiteTourNeededOptionsChange"
        />

        <WMInput
          id="contractor-option-site-tour-date"
          type="date"
          :label="$t('project.site-tour-date') + ':'"
          name="site-tour-date"
          :value="parseDate(project.config.site_tour_date)"
          :disabled="!siteTourNeededSelectedOption.value || !isEditable"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";

const { t } = useI18n();

const { parseDate } = useDates();

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const isEditable = computed(() => {
  return props.project.status.value === "pending_configuration";
});

const optionSetsStore = useOptionSetsStore();

const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");

const contractorOptions = ref([
  {
    value: "competition-process",
    name: t("project.competition-process-by-virtue-of-a-framework"),
    label: t("project.competition-process-by-virtue-of-a-framework"),
  },
  { value: "tender", name: t("project.tender"), label: t("project.tender") },
]);

// Set initial or selected values
const contractorSelectedOption = ref(
  props.project.config.tender
    ? contractorOptions.value[1]
    : contractorOptions.value[0]
);
const qualityCommitteeSelectedOption = ref(
  props.project.config.quality_commitee ? yesNoOptions[0] : yesNoOptions[1]
);
const siteTourNeededSelectedOption = ref(
  props.project.config.site_tour ? yesNoOptions[0] : yesNoOptions[1]
);

const handleContractorOptionsChange = (option) => {
  if (!option) {
    return;
  }

  contractorSelectedOption.value = option;
};

const handleSiteTourNeededOptionsChange = (option) => {
  if (!option) {
    return;
  }

  siteTourNeededSelectedOption.value = option;
};
</script>

<style scoped lang="scss"></style>
