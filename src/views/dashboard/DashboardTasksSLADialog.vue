<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('dashboard.tasks-distribution-by-sla')"
    :style="{ width: '1200px' }"
  >
    <div class="flex" :style="{ minHeight: '350px' }">
      <div class="w-6 flex">
        <SLAChart v-if="tasksSLAData" :data="tasksSLAData" />
      </div>
      <Divider layout="vertical" />
      <div class="w-6">
        <WMSLATable />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

const { getTasksSLADistribution } = useTasks();

const modelValue = defineModel();

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

const tasksSLAData = ref(null);

onMounted(async () => {
  tasksSLAData.value = await getTasksSLADistribution(props.filters);
});
</script>

<style scoped></style>
