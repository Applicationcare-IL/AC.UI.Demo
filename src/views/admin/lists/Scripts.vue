<template>
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable :value="scripts.data">
      <Column field="id" :header="$t('scripts.id')" />
      <Column field="name" :header="$t('scripts.name')" />
      <Column field="hash" :header="$t('scripts.hash')" />
      <Column field="is_active" :header="$t('scripts.is-active')" />
      <Column field="flowmaze_id" :header="$t('scripts.flowmaze-id')" />
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { getScripts } = useAdminFlowmaze();

const scripts = ref([]);

const loadLazyData = () => {
  getScripts().then((data) => {
    scripts.value = data;
  });
};

loadLazyData();
</script>

<style scoped lang="scss"></style>
