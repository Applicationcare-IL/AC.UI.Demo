<template>
  <div class="highlighted-block" :class="styleClasses">
    <div class="font-bold">{{ label }}:</div>
    <WMInputCurrency v-model="modelValue" />
  </div>
</template>

<script setup>
// IMPORTS
import { computed } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

const props = defineProps({
  label: {
    type: String,
    default: "Highlighted Block",
  },
  backgroundColor: {
    type: String,
    default: "white",
    validator: (value) => {
      return [
        "white",
        "blue-50",
        "blue-100",
        "blue-200",
        "gray-50",
        "gray-100",
        "gray-200",
        "gray-300",
        "gray-400",
        "purple-100",
        "purple-200",
        "green-200",
      ].includes(value);
    },
  },
  size: {
    type: String,
    default: "big",
    validator: (value) => {
      return ["big", "small", "xsmall"].includes(value);
    },
  },
  tooltip: {
    type: String,
    default: "",
  },
});

// REFS

// COMPUTED
const styleBackgroundColorClass = computed(() => {
  return `bg-${props.backgroundColor}`;
});

const styleFontSizeClass = computed(() => {
  switch (props.size) {
    case "big":
      return "text-lg";
    case "small":
      return "text-sm";
    case "xsmall":
      return "text-xs";
    default:
      return "text-lg";
  }
});

const paddingClass = computed(() => {
  switch (props.size) {
    case "big":
      return "p-3";
    case "small":
      return "p-2";
    case "xsmall":
      return "p-1";
    default:
      return "p-3";
  }
});

const borderRadiusClass = computed(() => {
  switch (props.size) {
    case "big":
      return "border-round-lg";
    case "small":
      return "border-round-md";
    case "xsmall":
      return "border-round-sm";
    default:
      return "border-round-lg";
  }
});

const styleClasses = computed(() => {
  return `highlighted-block ${styleBackgroundColorClass.value} ${styleFontSizeClass.value} ${paddingClass.value} ${borderRadiusClass.value} `;
});

// COMPONENT METHODS

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped>
.highlighted-block {
  display: flex;
  gap: 6px;
  padding: 16px;
  border-radius: 8px;
  color: var(--gray-800);
}
</style>
