<template>
  <label v-if="label != ''" class="wm-form-label">
    {{ label }}
  </label>
  <div class="flex flex-row justify-content-between">
    <!-- DROPDOWN -->
    <WMAutocomplete
      v-if="type == 'dropdown' && optionSet"
      v-model="selectedOptions"
      :placeholder="placeholder"
      :multiple="true"
      width="248"
      :options="optionSetsOptions"
      :option-set="optionSet"
      @update:model-value="onAutocompleteDropdownChanged"
    />

    <Dropdown
      v-if="type == 'dropdown' && options"
      v-model="selectedOption"
      :options="options"
      option-label="label"
      class="w-full md:w-14rem"
      @update:model-value="onDropdownChanged"
    />

    <!-- ENTITY -->
    <WMAutocomplete
      v-if="type == 'entity'"
      v-model="selectedOptions"
      :placeholder="placeholder"
      :multiple="true"
      width="248"
      option-label="name"
      :search-function="searchFunction"
      @update:model-value="onAutocompleteDropdownChanged"
    />

    <!-- BUTTONS -->
    <div v-if="type == 'buttons'" class="flex flex-row gap-2 p-2">
      <WMSelectableButton
        v-for="(option, index) in optionSetsOptions"
        :key="index"
        v-model="isButtonSelected[index]"
        :label="option[optionLabelWithLang]"
        @update:model-value="onButtonChanged($event, option)"
      />
    </div>

    <!-- DATES -->
    <div v-if="type == 'date'" class="flex flex-row gap-2 p-2">
      <div class="flex flex-column">
        <label v-if="label != ''" class="wm-form-label"> {{ $t("from") }}: </label>
        <Calendar
          v-model="fromDate"
          show-icon
          @update:model-value="onDateChanged($event, 'from')"
        />
      </div>
      <div class="flex flex-column">
        <label v-if="label != ''" class="wm-form-label"> {{ $t("to") }}: </label>
        <Calendar
          v-model="toDate"
          show-icon
          @update:model-value="onDateChanged($event, 'to')"
        />
      </div>
    </div>

    <!-- SLA -->
    <div v-if="type == 'sla_status'" class="flex flex-row gap-2 p-2">
      <WMSelectableButton
        v-for="(option, index) in SLAoptions"
        :key="index"
        v-model="isButtonSelected[index]"
        :label="option[optionLabelWithLang]"
        @update:model-value="onButtonChanged($event, option)"
      />
    </div>

    <!-- CREATED/ASSIGNED BY ME -->
    <div v-if="type == 'created_assigned'" class="flex flex-row gap-2 p-2">
      <WMSelectableButton
        v-for="(option, index) in createdAssignedOptions"
        :key="index"
        v-model="isButtonSelected[index]"
        :label="option[optionLabelWithLang]"
        @update:model-value="onButtonChanged($event, option)"
      />
    </div>

    <Button link @click="clear">
      {{ $t("buttons.clear") }}
    </Button>
  </div>
  <Divider></Divider>
</template>

<script setup>
// IMPORTS
import { useDateFormat } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";
// DEPENDENCIES
const { t } = useI18n();
const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  entity: String,
  type: String,
  optionSet: String,
  options: Array,
  placeholder: String,
  filterName: String,
  label: String,
  searchFunction: Function,
  filterData: Object,
  appliedFilters: Object,
});

const emits = defineEmits(["update:filter"]);

// REFS
const optionSetsOptions = ref();
const selectedOption = ref(null);

const selectedButtons = ref([]);
const isButtonSelected = ref([]);
const componentKey = ref(0);
const selectedOptions = ref([]);

const fromDate = ref(null);
const toDate = ref(null);

const SLAoptions = [
  { id: "breached", value_en: t("sla.breached"), value_he: t("sla.breached") },
  {
    id: "near_breach",
    value_en: t("sla.near_breach"),
    value_he: t("sla.near_breach"),
  },
  {
    id: "no_breach",
    value_en: t("sla.no_breach"),
    value_he: t("sla.no_breach"),
  },
];

const createdAssignedOptions = [
  {
    id: "created_by_me",
    value_en: t("created_by_me"),
    value_he: t("created_by_me"),
  },
  {
    id: "assigned_to_me",
    value_en: t("assigned_to_me"),
    value_he: t("assigned_to_me"),
  },
];

// COMPUTED

// COMPONENT METHODS
const forceRerender = () => {
  componentKey.value += componentKey.value;
};

const onAutocompleteDropdownChanged = (value) => {
  emits("update:filter", {
    name: props.filterName,
    value: value.map((x) => x.id),
  });
};

const onDropdownChanged = (value) => {
  emits("update:filter", {
    name: value.name,
    value: value.value,
  });

  removeUnselectedOptionsFromFilter(value.name);
};

const removeUnselectedOptionsFromFilter = (selectedOption) => {
  props.options.forEach((option) => {
    if (option.name == selectedOption) {
      return;
    }

    emits("update:filter", {
      name: option.name,
      value: null,
    });
  });
};

const onButtonChanged = (value, option) => {
  if (value) selectedButtons.value.push(option.id);
  else selectedButtons.value = selectedButtons.value.filter((x) => x != option.id);

  emits("update:filter", {
    name: props.filterName,
    value: selectedButtons.value,
  });
};

const onDateChanged = (value, type) => {
  let dateFilterName;
  let date;

  if (type == "from") {
    dateFilterName = props.filterData.from;
    fromDate.value = value;
    date = fromDate.value;
  } else {
    dateFilterName = props.filterData.to;
    toDate.value = value;
    date = toDate.value;
  }

  emits("update:filter", {
    name: dateFilterName,
    value: useDateFormat(date, "YYYY-MM-DD").value,
  });
};

const clear = () => {
  if (props.type == "date") {
    fromDate.value = null;
    toDate.value = null;
  }

  if (props.type == "dropdown") {
    selectedOptions.value = [];
  }

  if (props.type == "dropdown" && props.options) {
    selectedOption.value = props.options[0];
  }

  if (props.type == "buttons") {
    selectedButtons.value = [];
    isButtonSelected.value = [];
    forceRerender();
  }

  emits("update:filter", {
    name: props.filterName,
    value: null,
  });
};

const handleSelectedSLAs = () => {
  if (props.appliedFilters && props.type == "sla_status") {
    if (props.appliedFilters[props.filterName]) {
      const selected = props.appliedFilters[props.filterName];
      selected.forEach((element) => {
        const index = SLAoptions.findIndex((x) => x.id == element);
        isButtonSelected.value[index] = true;
      });
    }
  }
};

const handleSelectedDates = () => {
  if (props.appliedFilters && props.type == "date") {
    if (props.appliedFilters[props.filterData.from]) {
      fromDate.value = props.appliedFilters[props.filterData.from];
    }

    if (props.appliedFilters[props.filterData.to]) {
      toDate.value = props.appliedFilters[props.filterData.to];
    }
  }
};

const handleSelectedButtons = () => {
  if (props.appliedFilters && props.type == "buttons") {
    if (props.appliedFilters[props.filterName]) {
      selectedButtons.value = props.appliedFilters[props.filterName];
      selectedButtons.value.forEach((element) => {
        const index = optionSetsOptions.value.findIndex((x) => x.id == element);
        isButtonSelected.value[index] = true;
      });
    }
  }
};

const handleSelectedEntity = () => {
  if (props.appliedFilters && props.type == "entity") {
    if (props.appliedFilters[props.filterName]) {
      selectedOptions.value = props.appliedFilters[props.filterName];
    }
  }
};

const handleSelectedAutocompleteDropdown = () => {
  if (props.appliedFilters && props.type == "dropdown") {
    if (props.appliedFilters[props.filterName]) {
      selectedOptions.value = props.appliedFilters[props.filterName];
    }
  }
};

const handleSelectedDropdwon = () => {
  if (props.appliedFilters && props.type == "dropdown" && props.options) {
    props.options.forEach((option) => {
      if (props.appliedFilters && props.appliedFilters[option.name]) {
        selectedOption.value = option;
      }
    });
  }
};

function handleSelectedFilters() {
  handleSelectedSLAs();
  handleSelectedDates();
  handleSelectedButtons();
  handleSelectedEntity();
  handleSelectedAutocompleteDropdown();
  handleSelectedDropdwon();
}

// PROVIDE, EXPOSE
defineExpose({ clear });

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  if (props.optionSet) {
    optionSetsOptions.value = await optionSetsStore.getOptionSetValues(props.optionSet);
  }

  if (props.options) {
    selectedOption.value = props.options[0];
  }

  handleSelectedFilters();
});
</script>
