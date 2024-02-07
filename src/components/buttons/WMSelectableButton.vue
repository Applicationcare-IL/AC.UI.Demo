<template>
  <Button
    class="selectable-button border-round-2xl"
    :class="classes"
    :icon="icon"
    :label="label"
    @click="toggleCompleted"
  >
  </Button>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const toggleCompleted = () => {
  emit("update:modelValue", !props.modelValue);
};

const classes = computed(() => (props.modelValue ? "completed" : ""));
const icon = computed(() => (props.modelValue ? "pi pi-check" : ""));
</script>

<style scoped>
.selectable-button {
  color: var(--blue-700);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: 1px solid var(--blue-700);
  background-color: white;

  display: flex;
  height: 32px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 50px;

  &:hover {
    background-color: var(--blue-100);
    color: var(--blue-700);
  }

  &.completed {
    background-color: var(--blue-100);
  }
}

:deep(.p-button-icon-left) {
  margin-right: 0;
}
</style>
