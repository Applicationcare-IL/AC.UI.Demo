<template>
  <WMTasksTable
    v-if="can('tasks.read')"
    related-entity="project"
    :related-entity-id="project.project_id"
    :columns="taskColumns"
    multiselect
    :hide-title="true"
    :show-filters="true"
    rows="10"
  />
</template>
<script setup>
import { ref } from "vue";

const { getTaskColumns } = useListUtils();
const { can } = usePermissions();

const taskColumns = ref(getTaskColumns());

defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss"></style>
