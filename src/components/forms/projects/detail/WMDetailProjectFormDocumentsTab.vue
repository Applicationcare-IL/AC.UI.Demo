<template>
  <WMDocumentsTable
    :columns="documentsColumns"
    :projectId="route.params.id"
    :hide-title="true"
  />
</template>
<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const { getDocumentColumns } = useListUtils();

const documentsColumns = ref(getDocumentColumns());
</script>

<style scoped lang="scss"></style>
