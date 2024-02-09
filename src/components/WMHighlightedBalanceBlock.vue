<template>
  <WMHighlightedBlock
    v-model="quantityRef"
    :label="label"
    :size="size"
    :background-color="backgroundColor"
    :tooltip="tooltip"
  />
</template>

<script setup>
// IMPORTS
import { computed, toRef } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  quantity: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Highlighted Block",
  },
  size: {
    type: String,
    default: "big",
    validator: (value) => {
      return ["big", "small", "xsmall"].includes(value);
    },
  },
});

const quantityRef = toRef(props, "quantity");

// REFS
const positiveBackgroundClass = "green-200";
const negativeBackgroundClass = "red-200";
const neutralBackgroundClass = "yellow-200";

// COMPUTED
const backgroundColor = computed(() => {
  if (quantityRef.value > 0) {
    return positiveBackgroundClass;
  }

  if (quantityRef.value < 0) {
    return negativeBackgroundClass;
  }

  return neutralBackgroundClass;
});

const tooltip = computed(() => {
  if (quantityRef.value > 0) {
    return "plus";
  }

  if (quantityRef.value < 0) {
    return "minus";
  }

  return "";
});

// COMPONENT METHODS

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
