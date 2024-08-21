<template>
  <Chart type="line" :data="chartData" :options="chartOptions" class="w-full" />
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// REFS
const chartData = ref();
const chartOptions = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const getGraphLabels = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const keys = Object.keys(item).filter((key) => key !== "total");
    const values = keys.map((key) => item[key]);

    return values.join(" - ");
  });
};

const getGraphData = (data) => {
  if (!data) return [];

  let key = Object.keys(data[0])[1];
  return data.map((item) => item[key]);
};

const setChartData = (data) => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: getGraphLabels(data),
    datasets: [
      {
        data: getGraphData(data),
        backgroundColor: [
          documentStyle.getPropertyValue("--orange-200"),
          documentStyle.getPropertyValue("--orange-300"),
          documentStyle.getPropertyValue("--orange-400"),
          documentStyle.getPropertyValue("--orange-500"),
          documentStyle.getPropertyValue("--orange-600"),
          documentStyle.getPropertyValue("--orange-700"),
          documentStyle.getPropertyValue("--orange-800"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => props.data,
  () => {
    chartData.value = setChartData(props.data);
    chartOptions.value = setChartOptions();
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  chartData.value = setChartData(props.data);
  chartOptions.value = setChartOptions();
});
</script>

<style scoped></style>
