<template>
  <div class="flex flex-column gap-5">
    <div class="wm-form-row gap-5 align-items-baseline">
      <WMInput
        :value="selectedFrequency"
        name="frecuency"
        type="input-select"
        :highlighted="true"
        :label="$t('frecuency') + ':'"
        :options="frequencyOptions"
        @update:selected-item="onFrequencyChange"
      />
    </div>
    <div
      v-if="selectedFrequency.value === 'daily'"
      class="wm-form-row gap-5 align-items-baseline"
    >
      <WMInput
        name="repeat_until"
        type="input-select-button"
        :highlighted="true"
        :label="$t('repeat-until') + ':'"
        :options="repeatUntilOptions"
        :value="repeatUntil"
        width="80"
        @update:selected-item="onChangeRepeatUntil"
      />

      <WMInput
        v-if="repeatUntil.value === 'date'"
        id="end_date"
        type="date"
        :label="$t('end-date') + ':'"
        name="end_date"
        :value="parseDate(today)"
      />

      <WMInput
        v-if="repeatUntil.value === 'times'"
        id="times_to_repeat"
        type="input-number"
        :label="$t('times-to-repeat') + ':'"
        name="times_to_repeat"
        :value="1"
        :width="40"
      />
    </div>

    <div
      v-if="selectedFrequency.value === 'weekly'"
      class="wm-form-row gap-5 align-items-baseline"
    >
      <WMSelectableButton
        v-for="(day, index) in daysOfTheWeek"
        :key="index"
        v-model="isDayOfTheWeekSelected[index]"
        :label="day.name"
        @update:model-value="toggleSelectedDayOfTheWeek(day)"
      />
      selectedDaysOfTheWeek {{ selectedDaysOfTheWeek }}
    </div>

    <div
      v-if="selectedFrequency.value === 'monthly'"
      class="wm-form-row gap-5 align-items-baseline"
    >
      MONTHLY
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { parseDate } = useDates();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  relatedEntity: String,
});

// REFS
const today = ref(new Date().toISOString().slice(0, 10));

const repeatUntilOptions = ref([
  { name: t("date"), value: "date" },
  { name: t("times"), value: "times" },
]);

const repeatUntil = ref(repeatUntilOptions.value[0]);

const frequencyOptions = ref([
  { label: t("daily"), value: "daily" },
  { label: t("weekly"), value: "weekly" },
  { label: t("monthly"), value: "monthly" },
]);

const selectedFrequency = ref(frequencyOptions.value[0]);

const daysOfTheWeek = ref([
  { name: t("days-of-the-week.monday"), value: "monday" },
  { name: t("days-of-the-week.tuesday"), value: "tuesday" },
  { name: t("days-of-the-week.wednesday"), value: "wednesday" },
  { name: t("days-of-the-week.thursday"), value: "thursday" },
  { name: t("days-of-the-week.friday"), value: "friday" },
  { name: t("days-of-the-week.saturday"), value: "saturday" },
  { name: t("days-of-the-week.sunday"), value: "sunday" },
]);

const isDayOfTheWeekSelected = ref(
  Array.from({ length: daysOfTheWeek.value.length }, () => false)
);

const selectedDaysOfTheWeek = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
if (props.relatedEntity) {
  repeatUntilOptions.value.push({
    name: t("end-of") + " " + t(props.relatedEntity),
    value: "end_of_entity",
  });
}

const onChangeRepeatUntil = (value) => {
  repeatUntil.value = value;
};

const onFrequencyChange = (value) => {
  selectedFrequency.value = value;
};

const toggleSelectedDayOfTheWeek = (day) => {
  if (selectedDaysOfTheWeek.value.includes(day.value)) {
    selectedDaysOfTheWeek.value = selectedDaysOfTheWeek.value.filter(
      (selectedDay) => selectedDay !== day.value
    );
    return;
  }

  selectedDaysOfTheWeek.value.push(day.value);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
