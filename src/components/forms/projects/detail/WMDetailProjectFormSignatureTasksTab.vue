<template>
  <WMSignatureTasksTable
    related-entity="project"
    :related-entity-id="project.project_id"
    :columns="signatureTasksColumns"
    multiselect
    :hide-title="true"
    :show-filters="true"
    rows="10"
    @document-signed="onDocumentSigned"
  />
</template>
<script setup>
import { ref } from "vue";

const { getSignatureTaskColumns } = useListUtils();
const signatureTasksColumns = ref(getSignatureTaskColumns());
const emit = defineEmits(["documentSigned"]);

defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const onDocumentSigned = () => {
  emit("documentSigned");
};
</script>

<style scoped lang="scss"></style>
