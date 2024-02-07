<template>
  <Story :layout="{ type: 'grid', width: '50%' }">
    <template #controls>
      <HstSelect
        v-model="state.backgroundColor"
        title="Background colors"
        :options="backgroundColorOptions"
      />
    </template>
    <Variant title="Default">
      <WMHighlightedBlock :background-color="state.backgroundColor" />
    </Variant>
    <Variant title="Small">
      <WMHighlightedBlock size="small" />
    </Variant>
    <Variant title="All colors">
      <div class="flex gap-5 flex-wrap">
        <WMHighlightedBlock
          v-for="(color, index) in Object.keys(backgroundColorOptions)"
          :key="index"
          :background-color="color"
        />
      </div>
    </Variant>
    <Variant title="All colors small">
      <div class="flex gap-5 flex-wrap">
        <WMHighlightedBlock
          v-for="(color, index) in Object.keys(backgroundColorOptions)"
          :key="index"
          :background-color="color"
          size="small"
        />
      </div>
    </Variant>
    <Variant title="All colors xsmall">
      <div class="flex gap-5 flex-wrap">
        <WMHighlightedBlock
          v-for="(color, index) in Object.keys(backgroundColorOptions)"
          :key="index"
          :background-color="color"
          size="xsmall"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup>
import { reactive } from "vue";

const state = reactive({
  backgroundColor: "blue-50",
});

const backgroundColorOptions = {
  white: "white",
  "blue-50": "blue-50",
  "blue-100": "blue-100",
  "blue-200": "blue-200",
  "gray-50": "gray-50",
  "gray-100": "gray-100",
  "gray-200": "gray-200",
  "gray-300": "gray-300",
  "gray-400": "gray-400",
  "purple-100": "purple-100",
  "purple-200": "purple-200",
  "green-200": "green-200",
};
</script>
