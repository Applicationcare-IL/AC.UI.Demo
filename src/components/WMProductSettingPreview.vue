<template>
  <div class="flex gap-5 p-4 border-round-xl justify-content-between" :class="classes">
    <span class="h5"> {{ title }}</span>
    <span> <i class="pi font-bold" :class="iconClass" /> </span>
  </div>
</template>

<script setup>
// IMPORTS
import { computed } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

// REFS

// COMPUTED
const classes = computed(() => {
  return {
    "text-green-900 bg-green-100": props.state === 1,
    "text-gray-900 bg-gray-100 ": props.state === 0 || props.state === null,
  };
});

const iconClass = computed(() => {
  return {
    "pi pi-check": props.state === 1,
    "pi pi-times": props.state === 0 || props.state === null,
  };
});

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
