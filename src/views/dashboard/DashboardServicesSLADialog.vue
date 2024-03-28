<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('dashboard.services-distribution-by-sla')"
    :style="{ minWidth: '30vw' }"
  >
    <div class="flex" :style="{ height: '250px' }">
      <SLAChart v-if="servicesSLAData" :data="servicesSLAData" />
      <!-- <Divider layout="vertical" />
      TABLE -->
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

const { getServicesSLADistribution } = useServices();

const modelValue = defineModel();

const servicesSLAData = ref(null);

onMounted(async () => {
  servicesSLAData.value = await getServicesSLADistribution();
});
</script>

<style scoped></style>
