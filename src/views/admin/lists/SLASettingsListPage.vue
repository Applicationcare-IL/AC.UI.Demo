<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column">
      <div class="flex flex-row justify-content-between align-items-center">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">SLA Settings</h1>
        </div>
      </div>

      <Divider />

      <WMSaveButton
        :is-disabled="!isFormDirty"
        :is-saved="isFormSaved && !isFormDirty"
        @click="handleUpdateSLAValue"
      />
    </div>
  </div>
  <div class="m-5">
    <div class="flex flex-column gap-3">
      <div class="flex gap-2 h5">
        <span> Process entities will change their SLA status from</span>
        <WMSLATag sla="whithin_sla" state="whithin_sla" />
        <span>to</span>
        <WMSLATag sla="near_breach" state="active" />
        <span> according the the selected value</span>
      </div>

      <div class="h5 text-red-600">* This will apply to all EazyMaze entities.</div>

      <div class="flex align-items-center gap-3 mt-5">
        <span class="h5">Date opened</span>
        <div class="slider relative" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
          <div class="absolute marker" :style="{ left: `${value}%` }">
            <InputText v-model.number="value" />
            <span class="marker__icon text-green-600 font-bold">%</span>
          </div>
          <div
            class="slider__bar slider__within-sla bg-green-200 text-gray-900 h5 p-1"
            :style="{ width: `${withinSLAPercentageBar}%` }"
          >
            Within SLA - {{ withinSLAPercentageBar }}%
          </div>
          <div
            class="slider__bar slider__near-sla-bar bg-yellow-200 text-gray-900 h5 p-1"
            :style="{ width: `${nearSLAPercentageBar}%` }"
          >
            Near SLA - {{ nearSLAPercentageBar }}%
          </div>
          <Slider v-model="value" />
        </div>
        <span class="h5">Due date</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { getSLAValue, updateSLAValue } = useAdminSystem();
const toast = useToast();
const { layoutConfig } = useLayout();

// INJECT

// PROPS, EMITS

// REFS
const value = ref(0);
const isFormDirty = ref(true);
const isFormSaved = ref(false);

// COMPUTED
const withinSLAPercentageBar = computed(() => {
  if (layoutConfig.isRTL.value) {
    return 100 - value.value;
  }

  return value.value;
});

const nearSLAPercentageBar = computed(() => {
  if (layoutConfig.isRTL.value) {
    return value.value;
  }

  return 100 - value.value;
});

// COMPONENT METHODS AND LOGIC
useHead({
  title: "SLA Settings",
});

const handleUpdateSLAValue = async () => {
  updateSLAValue(value.value).then(() => {
    toast.success({ message: "SLA updated successfully" });
    isFormSaved.value = true;
    isFormDirty.value = false;
  });
};

// PROVIDE, EXPOSE

// WATCHERS
watch(value, (newValue) => {
  isFormDirty.value = newValue !== 0;
});

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  value.value = await getSLAValue();
});
</script>

<style scoped lang="scss">
.slider {
  max-width: 1000px;
  width: 100%;

  &__bar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
  }

  &__near-sla-bar {
    right: 0;
  }

  &.layout-rtl {
    .slider__near-sla-bar {
      right: unset;
      left: 0;
    }
  }
}

.marker {
  transform: translateX(-50%) translateY(-170%);
  position: absolute;
  border-radius: 5px;
  box-shadow: 0px 0px 16px 0px #00000033;
  background: white;

  .p-inputtext {
    margin: 5px;
    width: 65px;
    font-family: "Open Sans", sans-serif;
    height: 1.5em;
    font-size: 1.1em;
    font-weight: 400;
    line-height: 27.24px;
    text-align: center;
    padding-right: 30px;
  }

  &__icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
  }
}

.p-slider {
  background: none;

  :deep(.p-slider-range) {
    background: none;
  }

  :deep(.p-slider-handle) {
    box-shadow: 0px 0px 8px 0px #00000026;
    border-color: white;
    height: 40px;
    width: 40px;
    transform: translateY(-50%) translateX(-50%);
    margin: 0;

    &:hover {
      background: white;
      border-color: white;
    }
  }
}
</style>
