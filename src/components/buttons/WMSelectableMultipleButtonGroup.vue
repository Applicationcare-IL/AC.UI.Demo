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
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  options: {
    type: String,
    required: true,
  },
  noIcon: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:selectedOptions"]);

// REFS
const selectedOptions = ref([]);
const selectedValues = ref([]);

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

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
