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
      v-if="selectedFrequency.value === 'weekly'"
      class="wm-form-row gap-2 align-items-baseline"
    >
      <WMSelectableButton
        v-for="(day, index) in daysOfTheWeek"
        :key="index"
        v-model="isDayOfTheWeekSelected[index]"
        :label="day.name"
        @update:model-value="toggleSelectedDayOfTheWeek(day)"
      />
    </div>

    <div
      v-if="selectedFrequency.value === 'monthly'"
      class="wm-form-row gap-5 align-items-baseline"
    >
      MONTHLY
    </div>

    <div class="wm-form-row gap-5 align-items-baseline">
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
        v-model="endDate"
        type="date"
        :label="$t('end-date') + ':'"
        name="end_date"
        :value="parseDate(today)"
      />

      <WMInput
        v-if="repeatUntil.value === 'times'"
        id="times_to_repeat"
        v-model="repetitions"
        :value="repetitions"
        type="input-number"
        :label="$t('times-to-repeat') + ':'"
        name="times_to_repeat"
        :width="40"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { formatDate } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { parseDate } = useDates();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  relatedEntity: String,
});

const emit = defineEmits(["update:selectedOptions"]);

// REFS
const today = ref(new Date().toISOString().slice(0, 10));

const repeatUntilOptions = ref([
  { name: t("date"), value: "date" },
  { name: t("times"), value: "times" },
]);

const repeatUntil = ref(repeatUntilOptions.value[0]);

const repetitions = ref(1);

const frequencyOptions = ref([
  { label: t("daily"), value: "daily" },
  { label: t("weekly"), value: "weekly" },
  // { label: t("monthly"), value: "monthly" },
]);

const selectedFrequency = ref(frequencyOptions.value[0]);

const daysOfTheWeek = ref([
  { name: t("week-days.monday-short"), value: "monday" },
  { name: t("week-days.tuesday-short"), value: "tuesday" },
  { name: t("week-days.wednesday-short"), value: "wednesday" },
  { name: t("week-days.thursday-short"), value: "thursday" },
  { name: t("week-days.friday-short"), value: "friday" },
  { name: t("week-days.saturday-short"), value: "saturday" },
  { name: t("week-days.sunday-short"), value: "sunday" },
]);

const isDayOfTheWeekSelected = ref(
  Array.from({ length: daysOfTheWeek.value.length }, () => false)
);

const selectedDaysOfTheWeek = ref([]);

const endDate = ref(today.value);

// const monthlyFrequencyOptions = ref([
//   { label: t("same-day-ech-month"), value: "same_day_each_month" },
//   { label: t("first-day-of-month"), value: "first_day_of_month" },
//   { label: t("last-day-of-month"), value: "last_day_of_month" },
// ]);

// COMPUTED
const selectedOptions = computed(() => {
  let options = {
    repeat_each: getRepeatEachValue(),
    ends: repeatUntil.value.value,
    repeat_each_times: 1, // TEMPORAL
  };

  if (repeatUntil.value.value === "date") {
    options.ends_at = getEndsAtValue();
  }

  if (repeatUntil.value.value === "times") {
    options.repetitions = repetitions.value;
  }

  if (selectedFrequency.value.value === "weekly") {
    options.repeat_each_time_days = selectedDaysOfTheWeek.value;
  }

  return options;
});

const getEndsAtValue = () => {
  if (endDate.value === today.value) {
    return today.value;
  }

  if (repeatUntil.value.value === "date") {
    return formatDate(endDate.value, "YYYY-MM-DD");
  }

  return null;
};

const getRepeatEachValue = () => {
  if (selectedFrequency.value.value === "weekly") {
    return "week";
  }

  if (selectedFrequency.value.value === "monthly") {
    return "month";
  }

  return "day";
};

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
watch(
  () => selectedOptions.value,
  (newValue) => {
    emit("update:selectedOptions", newValue);
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  selectedFrequency.value = frequencyOptions.value[1];
  selectedFrequency.value = frequencyOptions.value[0];
});
</script>

<style scoped lang="scss"></style>
