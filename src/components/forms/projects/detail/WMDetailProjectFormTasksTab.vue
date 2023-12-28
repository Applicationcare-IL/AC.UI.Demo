<template>
  <WMTasksTable
    relatedEntity="project"
    :relatedEntityId="project.project_id"
    :columns="taskColumns"
    multiselect
    :hide-title="true"
    :show-filters="false"
    rows="5"
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
