<template>
  <Button
    class="selectable-button border-round-2xl"
    :class="{ completed: completed }"
    :icon="icon"
    @click="toggleCompleted"
    :label="label"
  >
  </Button>
</template>
<script setup>
import { ref, computed } from "vue";

const { label, modelValue } = defineProps(["label", "modelValue"]);
const emit = defineEmits();

const completed = ref(modelValue);

const toggleCompleted = () => {
  completed.value = !completed.value;
  emit("update:modelValue", completed.value);
};

const icon = computed(() => (completed.value ? "pi pi-check" : ""));
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
