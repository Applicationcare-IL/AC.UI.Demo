<template>
  <label v-if="label != ''" class="wm-form-label">
    {{ label }}
  </label>
  <div class="flex flex-row justify-content-between">
    <!-- DROPDOWN -->
    <WMAutocomplete
      v-if="type == 'dropdown'"
      :placeholder="placeholder"
      :multiple="true"
      width="248"
      :options="options"
      v-model="selectedOptions"
      :optionSet="optionSet"
      @update:modelValue="onDropdownChanged"
    />
    <!-- ENTITY -->
    <WMAutocomplete
      v-if="type == 'entity'"
      :placeholder="placeholder"
      :multiple="true"
      width="248"
      v-model="selectedOptions"
      optionLabel="name"
      :searchFunction="searchFunction"
      @update:modelValue="onDropdownChanged"
    />
    <!-- BUTTONS -->
    <div class="flex flex-row gap-2 p-2" v-if="type == 'buttons'">
      <WMSelectableButton
        v-for="(option, index) in options"
        :key="index"
        :label="option[optionLabelWithLang]"
        v-model="isButtonSelected[index]"
        @update:modelValue="onButtonChanged($event, option)"
      />
    </div>
    <!-- DATES -->
    <div class="flex flex-row gap-2 p-2" v-if="type == 'date'">
      <div class="flex flex-column">
        <label v-if="label != ''" class="wm-form-label"> מ: </label>
        <Calendar
          v-model="fromDate"
          showIcon
          @update:modelValue="onDateChanged($event, 'from')"
        />
      </div>
      <div class="flex flex-column">
        <label v-if="label != ''" class="wm-form-label"> עד: </label>
        <Calendar
          v-model="toDate"
          showIcon
          @update:modelValue="onDateChanged($event, 'to')"
        />
      </div>
    </div>

    <Button @click="clear" link>
      {{ $t("buttons.clear") }}
    </Button>
  </div>
  <Divider></Divider>
</template>

<script setup>
import { ref } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useDateFormat } from "@vueuse/core";
import { useUtilsStore } from "@/stores/utils";

const emits = defineEmits(["update:filter"]);

const { entity, type, optionSet, placeholder, filterName, label } = defineProps(
  {
    entity: String,
    type: String,
    optionSet: String,
    placeholder: String,
    filterName: String,
    label: String,
    searchFunction: Function,
  }
);

const { optionLabelWithLang } = useLanguages();

const utilsStore = useUtilsStore();

const optionSetsStore = useOptionSetsStore();
const options = ref(optionSetsStore.optionSets[optionSet]);

const selectedButtons = ref([]);
const isButtonSelected = ref([]);
const componentKey = ref(0);
const selectedOptions = ref([]);

const forceRerender = () => {
  componentKey.value += options.value.length;
};

const fromDate = ref(null);
const toDate = ref(null);

const onDropdownChanged = (value) => {
  emits("update:filter", {
    name: filterName,
    value: value.map((x) => x.id),
  });
};

const onButtonChanged = (value, option) => {
  if (value) selectedButtons.value.push(option.id);
  else
    selectedButtons.value = selectedButtons.value.filter((x) => x != option.id);

  emits("update:filter", {
    name: filterName,
    value: selectedButtons.value,
  });
};

const onDateChanged = (value, type) => {
  if (type == "from") fromDate.value = value;
  else toDate.value = value;

  emits("update:filter", {
    name: filterName,
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

const clear = () => {
  if (type == "date") {
    fromDate.value = null;
    toDate.value = null;
  }
  if (type == "dropdown") {
    selectedOptions.value = [];
  }
  if (type == "buttons") {
    selectedButtons.value = [];
    isButtonSelected.value = [];
    forceRerender();
  }

  emits("update:filter", {
    name: filterName,
    value: null,
  });
};

defineExpose({ clear });
</script>
