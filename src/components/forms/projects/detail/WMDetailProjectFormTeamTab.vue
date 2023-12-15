<template>
  <WMContactsTable
    :columns="projectTeamColumns"
    :projectId="route.params.id"
    related-entity="project"
  />
</template>
<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const { getProjectTeamColumns } = useListUtils();
const projectTeamColumns = ref(getProjectTeamColumns());
</script>

<style scoped lang="scss"></style>
