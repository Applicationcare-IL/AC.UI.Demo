<template>
  <WMSelectableButton
      v-for="(option, index) in options"
      :key="option"
      v-model="selectedOption[index]"
      :label="option.label"
      no-icon
      @click="handleSelectedOption(option, index)"
  />
</template>
<script setup>
// IMPORTS
import {ref} from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  options: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:selectedOption"]);

// REFS
const selectedOption = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleSelectedOption = (option, selectedIndex) => {
  selectedOption.value.forEach((_, index) => {
    selectedOption.value[index] = false;
  });

  selectedOption.value[selectedIndex] = true;

  emit("update:selectedOption", option);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
