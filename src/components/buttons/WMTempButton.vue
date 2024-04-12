<template>
  <Button
    class="wm-button gap-2 align-items-center justify-content-center"
    :class="classes"
  >
    <i v-if="icon" class="pi" :class="icon"></i>
    <slot name="customIcon"></slot>
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
  isDisabled: Boolean,
});

const classes = computed(() => {
  return `${props.type}
  ${props.isActive ? "is-active" : ""}
  ${props.isDisabled ? "is-disabled" : ""}`;
});
</script>

<style scoped lang="scss">
.wm-button :deep(svg) {
  display: flex;
  max-height: 1.3em;
}

.wm-button,
.wm-button.type-1 {
  font-weight: 700;
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
    outline: 0;
    box-shadow: none;
  }
}

.type-5 {
  background-color: var(--blue-100);
  color: var(--blue-700);
  border: none;

  :deep(svg path) {
    fill: var(--blue-700);
  }

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

.save {
  background-color: var(--green-600);
  color: white;
  border: none;
  font-weight: 700;

  :deep(svg path) {
    fill: white;
  }

  &:hover {
    background-color: var(--green-500);
  }

  &:focus {
    background-color: var(--green-700);
  }

  &.is-disabled {
    background-color: var(--gray-200);
    color: var(--gray-500);
    cursor: not-allowed;
    outline: 0;
    box-shadow: none;

    :deep(svg path) {
      fill: var(--gray-500);
    }
  }
}

.saved {
  background-color: var(--green-50);
  color: var(--green-700);
  border: none;
  font-weight: 700;
  cursor: not-allowed;

  &:hover,
  &:focus {
    background-color: var(--green-50);
    color: var(--green-700);
    outline: 0;
    box-shadow: none;
  }

  :deep(svg path) {
    fill: var(--green-700);
  }
}
</style>
