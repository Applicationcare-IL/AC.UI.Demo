<template>
  <WMReportGraphPieChart v-if="visualizationType === 'pie'" :data="reportData" />
  <WMReportGraphDoughnutChart v-if="visualizationType === 'doughnut'" :data="reportData" />
  <WMReportGraphVerticalBarChart v-if="visualizationType === 'vertical_bar'" :data="reportData" />
  <WMReportGraphHorizontalBarChart
    v-if="visualizationType === 'horizontal_bar'"
    :data="reportData"
  />
  <WMReportGraphLineChart v-if="visualizationType === 'line'" :data="reportData" />
  <WMReportGraphPolarChart v-if="visualizationType === 'polar'" :data="reportData" />
  <WMReportGraphRadarChart v-if="visualizationType === 'radar'" :data="reportData" />
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  reportData: {
    type: Array,
    required: true,
  },
  visualizationType: {
    type: Object,
    required: true,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
