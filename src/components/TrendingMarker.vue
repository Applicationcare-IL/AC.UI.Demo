<template>
  <div class="trending-marker" :class="classes">
    <span>{{ percentage }} %</span>
    <div v-if="increment > 0" class="d-flex" v-html="TrendingUp" />
    <div v-else class="d-flex" v-html="TrendingDown" />
  </div>
</template>

<script setup>
// IMPORTS
import { computed } from "vue";

import TrendingDown from "/icons/trending_down.svg?raw";
import TrendingUp from "/icons/trending_up.svg?raw";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  increment: {
    type: Number,
    required: true,
  },
});

// REFS

// COMPUTED
const classes = computed(() => {
  return {
    positive: props.increment > 0,
    negative: props.increment < 0,
    hidden: props.increment === 0,
  };
});

const percentage = computed(() => {
  // redondear a entero
  return Math.abs(Math.round(props.increment));
});

// COMPONENT METHODS

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.trending-marker {
  font-family: Futurism;
  font-size: 1em;
  font-weight: 700;
  padding: 4px 8px;
  display: flex;
  gap: 4px;
  border-radius: 18px;
  direction: ltr;

  &.positive {
    background-color: var(--green-100);
    color: var(--green-900);
  }

  &.negative {
    background-color: var(--red-100);
    color: var(--red-900);
  }
}
</style>
