<template>
  <div class="flex flex-row justify-content-between">
    <!-- DROPDOWN -->
    <WMAutocomplete
      v-if="type == 'dropdown'"
      :placeholder="props.placeholder"
      :multiple="true"
      width="248"
      :options="options"
      @update:modelValue="onDropdownChanged"
    />
    <!-- BUTTONS -->
    <div class="flex flex-row gap-2 p-2" v-if="type == 'buttons'">
      <WMSelectableButton
        v-for="option in options"
        :label="option.value"
        v-model="isSelected"
        @update:modelValue="onButtonChanged($event, option)"
      />
    </div>
    <!-- DATES -->
    <div class="flex flex-row gap-2 p-2" v-if="type == 'date'">
      <Calendar
        v-model="fromDate"
        showIcon
        @update:modelValue="onDateChanged($event, 'from')"
      />
      <Calendar
        v-model="toDate"
        showIcon
        @update:modelValue="onDateChanged($event, 'to')"
      />
    </div>

    <Button>נקה</Button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useDateFormat } from "@vueuse/core";
import { useUtilsStore } from "@/stores/utils";

const emits = defineEmits(["update:filter"]);

const props = defineProps({
  entity: String,
  type: String,
  optionSet: String,
  placeholder: String,
  filterName: String,
});

const utilsStore = useUtilsStore();

const optionSetsStore = useOptionSetsStore();
const options = ref(optionSetsStore.optionSets[props.optionSet]);

const selectedButtons = ref([]);

const fromDate = ref(null);
const toDate = ref(null);

const isSelected = ref(false);

const onDropdownChanged = (value) => {
  console.log("value", value);
  emits("update:filter", {
    name: props.filterName,
    value: value.map((x) => x.id),
  });
};

const onButtonChanged = (value, option) => {
  if (value) selectedButtons.value.push(option.id);
  else
    selectedButtons.value = selectedButtons.value.filter((x) => x != option.id);

  emits("update:filter", {
    name: props.filterName,
    value: selectedButtons.value,
  });
};

const onDateChanged = (value, type) => {
  if (type == "from") fromDate.value = value;
  else toDate.value = value;

  emits("update:filter", {
    name: props.filterName,
    value: [
      fromDate.value
        ? useDateFormat(fromDate.value, utilsStore.dateFormat).value
        : null,
      toDate.value
        ? useDateFormat(toDate.value, utilsStore.dateFormat).value
        : null,
    ],
  });
};
</script>
