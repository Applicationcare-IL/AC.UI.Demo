<template>
  <div class="relative">
    <!-- <pre>appliedFilters {{ appliedFilters }}</pre> -->
    <!-- <pre>selectedOptions {{ selectedOptions }}</pre> -->
    <!-- Toggable label-->
    <div v-if="label != '' && toggable">
      <div class="flex flex-row align-items-center gap-3" @click="toggleContent">
        <div
          class="toggable w-full hover:bg-blue-50"
          :class="isToggled || hasSelectedOptions ? 'bg-blue-50' : 'bg-gray-50'"
        >
          <div class="w-full flex justify-content-between align-items-center">
            <span class="h6">{{ label }}</span>
            <span
              class="text-blue-800 font-normal white-space-nowrap overflow-hidden text-overflow-ellipsis max-w-20rem"
            >
              {{ selectedOptionsPreviewText }}
            </span>
          </div>

          <div class="toggable__icon">
            <div class="p-button-svg flex" v-html="ExpandIcon" />
          </div>
        </div>
        <WMButton :text="$t('buttons.clear')" type="clear mx-0 px-0" @click="clear" />
      </div>
    </div>

    <!-- Non-toggable label -->
    <label v-if="label != '' && !toggable" class="wm-form-label"> {{ label }}</label>
    <div
      class="flex-row justify-content-between"
      :class="!toggable || isToggled ? 'flex' : 'hidden'"
    >
      <!-- DROPDOWNS -->
      <WMAutocomplete
        v-if="type == 'dropdown' && optionSet"
        v-model="selectedOptions"
        :placeholder="placeholder"
        :multiple="true"
        width="248"
        :options="optionSetsOptions"
        :option-set="optionSet"
        @update:model-value="onAutocompleteDropdownChanged"
        @remove="onRemoveEntityDropdownOption"
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
        @remove="onRemoveEntityDropdownOption"
      />

      <!-- AUTOCOMPLETE WITH OPTIONS -->
      <WMAutocomplete
        v-if="type == 'autocomplete' && options"
        v-model="selectedOptions"
        :placeholder="placeholder"
        :multiple="true"
        width="248"
        option-label="name"
        :options="options"
        @update:model-value="onAutocompleteDropdownChanged"
        @remove="onRemoveEntityDropdownOption"
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

      <!-- STATE OPTIONS -->
      <div v-if="type == 'state'" class="flex flex-row gap-2 p-2">
        <div class="flex flex-column">
          <WMStateToggle
            v-model="selectedOption"
            :entity="entity"
            type="event"
            @update:state="onStateChange"
          />
        </div>
      </div>

      <!-- BOOLEAN SWITCH -->
      <div v-if="type == 'toggleButton'" class="flex flex-row gap-2 p-2">
        <div class="flex">
          <!-- <SelectButton
            v-model="selectedOption"
            :options="options"
            option-label="name"
            option-value="value"
            class="flex flex-nowrap"
            :allow-empty="false"
            @change="onChangeBooleanSwitch"
          /> -->
        </div>
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
          <Calendar v-model="toDate" show-icon @update:model-value="onDateChanged($event, 'to')" />
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

      <WMButton
        v-if="!toggable"
        :text="$t('buttons.clear')"
        type="clear mx-0 px-0"
        class="absolute top-0"
        :class="layoutConfig.isRTL.value ? 'left-0' : 'right-0'"
        @click="clear"
      />
    </div>
  </div>
  <Divider></Divider>
</template>

<script setup>
// IMPORTS
import { useDateFormat } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import ExpandIcon from "/icons/expand_default.svg?raw";
import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { t } = useI18n();
const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();
const { layoutConfig } = useLayout();

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
  toggable: Boolean,
});

const emits = defineEmits(["update:filter"]);

// REFS
const isToggled = ref(false);

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
const selectedOptionsPreviewText = computed(() => {
  if (selectedOptions.value.lenght == 0) return "";

  if (props.type == "dropdown" && props.optionSet) {
    return selectedOptions.value.map((x) => x[optionLabelWithLang.value]).join(", ");
  }

  if (props.type == "entity") {
    return selectedOptions.value.map((x) => x.name).join(", ");
  }

  if (props.type === "date" && fromDate.value && toDate.value) {
    return `${useDateFormat(fromDate.value, "YYYY-MM-DD").value} - ${
      useDateFormat(toDate.value, "YYYY-MM-DD").value
    }`;
  }

  return "";
});

const hasSelectedOptions = computed(() => {
  if (selectedOptions.value.length > 0) return true;
  if (fromDate.value || toDate.value) return true;
  if (selectedButtons.value.length > 0) return true;

  return false;
});

// COMPONENT METHODS AND LOGIC
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
  if (value) {
    selectedButtons.value.push(option.id);
  } else {
    selectedButtons.value = selectedButtons.value.filter((x) => x != option.id);
  }

  emits("update:filter", {
    name: props.filterName,
    value: selectedButtons.value,
  });
};

const onStateChange = (value) => {
  emits("update:filter", {
    name: props.filterName,
    value: value,
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

  if (props.type == "entity") {
    selectedOptions.value = [];
  }

  if (props.type == "sla_status") {
    selectedButtons.value = [];
    isButtonSelected.value = [];
    forceRerender();
  }

  emits("update:filter", {
    name: props.filterName,
    value: null,
  });
};

const onRemoveEntityDropdownOption = (option) => {
  selectedOptions.value = selectedOptions.value.filter((x) => x.id != option.id);

  emits("update:filter", {
    name: props.filterName,
    value: selectedOptions.value.map((x) => x.id),
  });
};

const handleSelectedSLAs = () => {
  if (props.appliedFilters && props.type == "sla_status") {
    if (props.appliedFilters[props.filterName]) {
      selectedButtons.value = props.appliedFilters[props.filterName];

      selectedButtons.value.forEach((element) => {
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
  if (props.appliedFilters && props.appliedFilters[props.filterName] && props.type == "buttons") {
    selectedButtons.value = props.appliedFilters[props.filterName];
    selectedButtons.value.forEach((element) => {
      const index = optionSetsOptions.value.findIndex((x) => x.id == element);
      isButtonSelected.value[index] = true;
    });
  }
};

const handleSelectedEntity = () => {
  if (props.appliedFilters && props.appliedFilters[props.filterName] && props.type == "entity") {
    props.searchFunction().then((options) => {
      selectedOptions.value = options.data.filter((x) =>
        props.appliedFilters[props.filterName].includes(x.id)
      );
    });
  }
};

const handleSelectedAutocompleteDropdown = () => {
  if (props.appliedFilters && props.appliedFilters[props.filterName] && props.type == "dropdown") {
    selectedOptions.value = props.appliedFilters[props.filterName];
  }
};

const handleSelectedDropdown = () => {
  if (props.appliedFilters && props.type == "dropdown" && props.options) {
    props.options.forEach((option) => {
      if (props.appliedFilters && props.appliedFilters[option.name]) {
        selectedOption.value = option;
      }
    });
  }

  if (props.appliedFilters && props.type == "dropdown" && props.optionSet) {
    selectedOptions.value = optionSetsOptions.value.filter((x) =>
      props.appliedFilters[props.filterName].includes(x.id)
    );
  }
};

const handleAutocompleteOptions = () => {
  if (
    props.appliedFilters &&
    props.type == "autocomplete" &&
    props.options &&
    props.appliedFilters[props.filterName]
  ) {
    selectedOptions.value = props.options.filter((x) =>
      props.appliedFilters[props.filterName].includes(x.id)
    );
  }
};

const handleSelectedState = () => {
  if (props.appliedFilters && props.appliedFilters[props.filterName] && props.type == "state") {
    selectedOption.value = props.appliedFilters[props.filterName];
  }
};

const handleSelectedFilters = () => {
  handleSelectedSLAs();
  handleSelectedDates();
  handleSelectedButtons();
  handleSelectedEntity();
  handleSelectedAutocompleteDropdown();
  handleSelectedDropdown();
  handleAutocompleteOptions();
  handleSelectedState();
};

const toggleContent = () => {
  isToggled.value = !isToggled.value;
};

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

<style scoped lang="scss">
.toggable {
  display: flex;
  padding: 4px 8px 4px 4px;
  border-radius: 8px;
  justify: space-between;

  &:hover {
    background-color: var(--blue-50);
    cursor: pointer;
  }
}
</style>
