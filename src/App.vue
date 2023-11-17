<template>
  <div
    v-if="loading"
    class="flex flex-column justify-content-center h-screen align-items-center"
  >
    <ProgressSpinner />
    <p class="ml-2">Preloading option sets</p>
  </div>
  <router-view v-else />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();
const loading = ref(true);

onMounted(() => {
  if (!optionSetsStore.isOptionSetsPreloaded)
    optionSetsStore.preloadOptionSets().then(() => (loading.value = false));
  else loading.value = false;
});
</script>

<style scoped></style>
