<template>
  <div class="bg-gray-25 border-round-md w-full flex flex-column p-2 justify-content-between">
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

  <Dialog v-model:visible="visible" modal header="Team’s average time" :style="{ width: '50vw' }">
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem" />
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

const visible = ref(false);

const chartData = ref();
const chartOptions = ref();

const exampleDataThisWeek = [
  {
    x: "Monday",
    y: 155,
  },
  {
    x: "Tuesday",
    y: 487,
  },
  {
    x: "Wednesday",
    y: 289,
  },
  {
    x: "Thursday",
    y: 674,
  },
  {
    x: "Friday",
    y: 458,
  },
  {
    x: "Saturday",
    y: 396,
  },
  {
    x: "Sunday",
    y: 712,
  },
];

const exampleData = exampleDataThisWeek;

const mapX = exampleData.map((data) => data.x);

// Convertir minutos totales a formato HH:MM
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours < 10 ? "0" : ""}${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
}

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: mapX,
    datasets: [
      {
        label: "testing",
        data: exampleData,
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

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return minutesToTime(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            // Mostrar horas en formato HH:MM
            return minutesToTime(value);
          },
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
