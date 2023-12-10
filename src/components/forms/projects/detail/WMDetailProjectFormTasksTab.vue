<template>
  <WMTasksTable
    relatedEntity="project"
    :relatedEntityId="project.id"
    :columns="taskColumns"
    multiselect
    :hide-title="true"
  />
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { getTaskColumns } = useListUtils();
const route = useRoute();

const taskColumns = ref(getTaskColumns());

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss"></style>
