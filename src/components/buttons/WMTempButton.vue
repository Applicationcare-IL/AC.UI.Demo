<template>
  <Button class="gap-2" :class="classes">
    <i class="pi" :class="icon"></i>
    <span>{{ text }}</span>
  </Button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: String,
  text: String,
  type: String,
  isActive: Boolean,
});

const classes = computed(() => {
  return `${props.type} ${props.isActive ? "is-active" : ""}`;
});
</script>

<style scoped lang="scss">
.type-1 {
  background-color: var(--gray-50);
  color: var(--blue-700);
  border: none;

  &:hover {
    background-color: var(--gray-100);
    color: var(--blue-700);
  }

  &:focus {
    background-color: var(--gray-200);
    color: var(--blue-700);
  }
}

.filter-blue {
  background-color: var(--blue-100);
  color: var(--blue-700);
  border: none;
  font-weight: 700;

  &:hover {
    background-color: var(--blue-200);
    color: var(--blue-700);
  }

  &:focus {
    background-color: var(--blue-300);
    color: var(--blue-800);
  }

  &.is-active {
    border: 1px solid var(--blue-700);
  }
}
</style>
