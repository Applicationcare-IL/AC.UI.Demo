<template>
  <WMSelectableButton
    v-for="(option, index) in options"
    :key="option"
    v-model="selectedOptions[index]"
    :label="option.label"
    :no-icon="noIcon"
    @click="handleSelectedOption(option, index)"
  />
</template>
<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  options: {
    type: String,
    required: true,
  },
  noIcon: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:selectedOptions"]);

// REFS
const selectedOptions = ref([]); // used to keep track of selected options internally
const selectedValues = ref([]); // used to return the correct selected values

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleSelectedOption = (option, selectedIndex) => {
  if (selectedOptions.value[selectedIndex] !== true) {
    selectedValues.value = selectedValues.value.filter((value) => value !== option.value);
  } else {
    selectedValues.value.push(option.value);
  }

  emit("update:selectedOptions", selectedValues.value);
};

const setSelectedOptions = (options, selectedOptionsFromValueProp) => {
  for (let i = 0; i < options.length; i++) {
    if (selectedOptionsFromValueProp.includes(options[i].value)) {
      selectedOptions.value.push(true);
      continue;
    }

    selectedOptions.value.push(false);
  }
};

const setSelectedValues = (options, selectedOptionsFromValueProp) => {
  for (let i = 0; i < options.length; i++) {
    if (selectedOptionsFromValueProp.includes(options[i].value)) {
      selectedValues.value.push(options[i].value);
    }
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (props.value) {
    setSelectedOptions(props.options, props.value);
    setSelectedValues(props.options, props.value);
  }
});
</script>

<style scoped></style>
