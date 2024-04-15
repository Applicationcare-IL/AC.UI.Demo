<template>
  <div
    class="bg-gray-25 border-round-md w-full flex flex-column p-2 justify-content-between"
  >
    <div class="flex w-full justify-content-between mb-3">
      <span>זמן ממוצע של הצוותים</span>
      <i class="pi pi-ellipsis-v cursor-pointer" @click="visible = true"></i>
    </div>

    <div class="flex w-full justify-content-between">
      <div class="flex gap-2">
        <span class="font-bold text-lg">00:10:46</span>
      </div>
      <TrendingMarker :increment="4" />
    </div>
  </div>

  <Dialog
    v-model:visible="visible"
    modal
    header="Team’s average time"
    :style="{ width: '50vw' }"
  >
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem" />
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

const visible = ref(false);

const chartData = ref();
const chartOptions = ref();
const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: documentStyle.getPropertyValue("--cyan-500"),
        tension: 0,
      },
    ],
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>
