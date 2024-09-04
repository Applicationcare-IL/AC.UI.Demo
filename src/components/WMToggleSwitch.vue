<template>
  <div class="toggle-switch" :class="classes">
    <div class="toggle-switch__header">
      <InputSwitch v-model="value" @input="$emit('update:modelValue', $event)" />
      <span class="font-bold" :class="`text-${labelSize}`">{{ label }}</span>
    </div>

    <div v-if="slots['default']" class="toggle-switch__body">
      <template v-if="value">
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, ref, useSlots, watch } from "vue";

// DEPENDENCIES
const slots = useSlots();

// INJECT

// PROPS, EMITS
const props = defineProps({
  label: String,
  labelSize: {
    type: String,
    default: "md",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "blue",
  },
});

defineEmits(["update:modelValue"]);

// REFS
const value = ref(props.modelValue);

// COMPUTED
const isActive = computed(() => (value.value === true ? "is-active" : ""));
const theme = computed(() => `toggle-switch--${props.theme}`);

const classes = computed(() => [isActive.value, theme.value]);

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.toggle-switch {
  background-color: var(--gray-100);
  padding: 1rem;
  gap: 1rem;
  display: flex;
  width: 100%;
  flex-direction: column;
  border: 1px solid var(--gray-100);

  &__header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  &--blue {
    border-radius: 10px;
    &.is-active {
      background-color: var(--blue-50);
      border: 1px solid var(--blue-300);
    }
  }
}
</style>
