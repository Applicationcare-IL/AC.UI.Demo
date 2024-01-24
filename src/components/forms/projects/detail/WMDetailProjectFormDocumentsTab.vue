<template>
  <WMDocumentsTable
    :columns="documentsColumns"
    related-entity="project"
    :related-entity-id="route.params.id"
    :hide-title="true"
  />
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { getProjectDocumentColumns } = useListUtils();

const documentsColumns = ref(getProjectDocumentColumns());
</script>

<style scoped lang="scss"></style>
