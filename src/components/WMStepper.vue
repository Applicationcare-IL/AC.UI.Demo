<template>
  <div class="flex flex-row justify-content-around">
    <div v-for="(step, index) in steps" :key="index" class="flex-1">
      <div class="step-container flex flex-column align-items-center flex-auto">
        <div
          v-if="showConnector(index)"
          class="connector"
          :class="getStatus(index)"
        ></div>
        index {{ index }} currentStep {{ currentStep }}
        <div class="step" :class="getStatus(index)">
          <svg
            v-if="getStatus(index) == 'completed'"
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            width="32"
            height="32"
            viewBox="-8 -2 40 26"
          >
            <path
              d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"
            />
          </svg>
        </div>
        <div class="label" :class="getStatus(index)">{{ step.label }}</div>
        <div class="date" :class="getStatus(index)">{{ step.date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLayout } from "@/layout/composables/layout";
const { layoutConfig } = useLayout();

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
    default: 0,
  },
});

function showConnector(index) {
  return layoutConfig.isRTL.value ? index > 0 : index < props.steps.length - 1;
}

function getStatus(index) {
  if (index < props.currentStep) {
    return "completed";
  } else if (index === props.currentStep) {
    return "active";
  } else {
    return "pending";
  }
}
</script>

<style scoped lang="scss">
.completed.step,
.completed.connector {
  background: var(--teal-600, #7eb8ff);
}

.completed.label,
.completed.date {
  color: var(--teal-900, #7eb8ff);
}

.active.step,
.active.connector {
  background: var(--blue-100, #7eb8ff);
}

.active.label,
.active.date {
  color: var(--blue-600, #7eb8ff);
  font-weight: bold;
}

.pending.step,
.pending.connector {
  background: var(--gray-300, #7eb8ff);
}

.pending.label,
.pending.date {
  color: var(--gray-600, #7eb8ff);
}

.step-container {
  position: relative;
  width: 100%;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.connector {
  height: 2px;
  top: 14px;
  width: calc(100% - 48px);
  left: calc(50% + 24px);
  position: absolute;
  box-sizing: border-box;
  border-radius: 2px;
}
</style>
