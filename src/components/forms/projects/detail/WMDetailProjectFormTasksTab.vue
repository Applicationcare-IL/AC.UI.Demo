<template>
  <WMTasksTable
    relatedEntity="project"
    :relatedEntityId="project.project_id"
    :columns="taskColumns"
    multiselect
    :hide-title="true"
    :show-filters="false"
  />
</template>
<script setup>
import { ref } from "vue";

const { getTaskColumns } = useListUtils();

const taskColumns = ref(getTaskColumns());

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss"></style>
