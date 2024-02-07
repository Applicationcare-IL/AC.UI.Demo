<template>
  <div class="toggle-switch" :class="classes">
    <div class="toggle-switch__header">
      <InputSwitch
        v-model="value"
        @input="$emit('update:modelValue', $event)"
      />
      <span>{{ label }}</span>
    </div>
    <div class="toggle-switch__body">
      <template v-if="value">
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

defineEmits(["update:modelValue"]);

const props = defineProps({
  label: String,
  modelValue: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "blue",
  },
});

const value = ref(props.modelValue);

const isActive = computed(() => (value.value === true ? "is-active" : ""));
const theme = computed(() => `toggle-switch--${props.theme}`);

const classes = computed(() => [isActive.value, theme.value]);
</script>

<style scoped lang="scss">
.toggle-switch {
  background-color: var(--gray-100);
  padding: 1rem;
  gap: 1rem;
  display: flex;
  width: 100%;
  flex-direction: column;

  &__header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  &--blue {
    &.is-active {
      background-color: var(--blue-100);
    }
  }
}
</style>
