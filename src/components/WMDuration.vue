<template>
  <div class="flex">
    {{ minutes }}
    <Divider layout="vertical" />
    {{ hours }}
    <Divider layout="vertical" />
    {{ days }}
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  duration: {
    type: Number,
    default: 0,
  },
});

// REFS
const minutes = ref(0);
const hours = ref(0);
const days = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  days.value = Math.floor(props.duration / (3600 * 24));
  hours.value = Math.floor((props.duration % (3600 * 24)) / 3600);
  minutes.value = Math.floor((props.duration % 3600) / 60);
  //   const seconds = seconds % 60;
});
</script>

<style scoped></style>
