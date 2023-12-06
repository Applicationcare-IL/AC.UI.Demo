<template>
  <WMDocumentsTable :columns="documentsColumns" :hide-title="true" />
</template>
<script setup>
import { ref, onMounted } from "vue";

const { getDocumentColumns } = useListUtils();

const documentsColumns = ref(getDocumentColumns());
</script>

<style scoped lang="scss"></style>
