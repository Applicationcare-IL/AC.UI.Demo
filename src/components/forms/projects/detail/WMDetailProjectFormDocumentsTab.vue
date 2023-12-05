<template>
  <WMDocumentsTable
    :documents="documents"
    :columns="documentsColumns"
    :hide-title="true"
  />
</template>
<script setup>
import { ref, onMounted } from "vue";

const { getDocuments } = useDocuments();
const documents = ref();

const { getDocumentColumns } = useListUtils();

const documentsColumns = ref(getDocumentColumns());

const fetchData = async () => {
  documents.value = await getDocuments();
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss"></style>
