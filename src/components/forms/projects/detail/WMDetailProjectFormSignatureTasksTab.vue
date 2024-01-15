<template>
  <WMSignatureTasksTable
    related-entity="project"
    :related-entity-id="project.project_id"
    :columns="signatureTasksColumns"
    multiselect
    :hide-title="true"
    :show-filters="true"
    rows="10"
  />
</template>
<script setup>
import { ref } from "vue";

const { getSignatureTaskColumns } = useListUtils();
const signatureTasksColumns = ref(getSignatureTaskColumns());

defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss"></style>
