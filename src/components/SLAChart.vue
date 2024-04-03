<template>
  <div class="w-full">
    <Chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      :plugins="[ChartDataLabels]"
      class="w-full h-full"
    />
  </div>
</template>

<script setup>
// IMPORTS
import ChartDataLabels from "chartjs-plugin-datalabels";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const documentStyle = getComputedStyle(document.body);
const { t } = useI18n();

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
const availableStatus = ref(["breached", "near_breach", "no_breach"]);

// COMPUTED

// COMPONENT METHODS
const chartOptions = ref({
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 30,
      bottom: 30,
    },
  },
  cutout: "60%",
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      onClick: (e) => e.stopPropagation(), // disable default onclick behaviour
      position: "right",
      labels: {
        boxWidth: 20,
        boxHeight: 16,
        usePointStyle: true,
        pointStyle: "rectRounded",
        padding: 10,
      },
    },
    datalabels: {
      align: "end",
      anchor: "end",
      color: (context) => {
        return context.dataset.backgroundColor;
      },
      formatter: (value) => {
        return value + "%";
      },
      padding: 6,
      labels: {
        value: {
          font: {
            weight: "bold",
            size: 16,
          },
        },
      },
    },
  },
});

const translateStatus = (status) => {
  return t(`sla.${status}`);
};

const getSLAStatusLabels = (data) => {
  const SLAStatus = data.map((item) => item.sla_status);

  const filteredSLAStatus = SLAStatus.filter((item) =>
    availableStatus.value.includes(item)
  );

  const translatedSLAStatus = filteredSLAStatus.map((status) =>
    translateStatus(status)
  );

  return translatedSLAStatus;
};

const calculateSLAPercentages = (data) => {
  const breached = data.filter((item) => item.sla_status === "breached")[0];
  const nearBreach = data.filter(
    (item) => item.sla_status === "near_breach"
  )[0];
  const noBreach = data.filter((item) => item.sla_status === "no_breach")[0];

  const totalValue =
    (breached ? breached.value : 0) +
    (nearBreach ? nearBreach.value : 0) +
    (noBreach ? noBreach.value : 0);

  const percentages = {
    breached: breached ? ((breached.value / totalValue) * 100).toFixed(2) : 0,
    nearBreach: nearBreach
      ? ((nearBreach.value / totalValue) * 100).toFixed(2)
      : 0,
    noBreach: noBreach ? ((noBreach.value / totalValue) * 100).toFixed(2) : 0,
  };

  const filteredPercetagesWithZero = Object.entries(percentages).reduce(
    (acc, [key, value]) => {
      if (value !== 0) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  return Object.values(filteredPercetagesWithZero);
};

const getBackgroundColorsByStatus = (data) => {
  const SLAStatus = data.map((item) => item.sla_status);

  const filteredSLAStatus = SLAStatus.filter((item) =>
    availableStatus.value.includes(item)
  );

  return filteredSLAStatus.map((status) => {
    switch (status) {
      case "breached":
        return documentStyle.getPropertyValue("--red-400");
      case "near_breach":
        return documentStyle.getPropertyValue("--yellow-300");
      case "no_breach":
        return documentStyle.getPropertyValue("--green-500");
      default:
        return false;
    }
  });
};

const setChartData = (data) => {
  return {
    labels: [...getSLAStatusLabels(data)],
    datasets: [
      {
        data: calculateSLAPercentages(data),
        backgroundColor: [...getBackgroundColorsByStatus(data)],
        hoverBackgroundColor: [...getBackgroundColorsByStatus(data)],
      },
    ],
  };
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  chartData.value = setChartData(props.data);
});
</script>

<style scoped lang="scss"></style>
