<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('dashboard.tasks-distribution-by-sla')"
    :style="{ minWidth: '30vw' }"
  >
    <div class="flex" :style="{ height: '250px' }">
      <SLAChart v-if="tasksSLAData" :data="tasksSLAData" />
      <!-- <Divider layout="vertical" />
      TABLE -->
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

const { getTasksSLADistribution } = useTasks();

const modelValue = defineModel();

const tasksSLAData = ref(null);

onMounted(async () => {
  tasksSLAData.value = await getTasksSLADistribution();
});
</script>

<style scoped></style>
