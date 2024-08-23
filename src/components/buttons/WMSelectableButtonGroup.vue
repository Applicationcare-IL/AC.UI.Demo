<template>
  <WMSelectableButton
    v-for="(option, index) in options"
    :key="option"
    v-model="selectedOption[index]"
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
onMounted(() => {
  if (props.value) {
    selectedOption.value = props.options.map((option) => option.value === props.value);
  }
});
</script>

<style scoped></style>
