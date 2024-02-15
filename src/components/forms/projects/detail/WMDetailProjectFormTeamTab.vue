<template>
  <WMContactsTable
    v-if="can('contacts.read')"
    :columns="projectTeamColumns"
    :project-id="route.params.id"
    related-entity="project"
    :show-title="false"
    :show-filters="true"
    :multiselect="true"
  />
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { getProjectTeamColumns } = useListUtils();
const projectTeamColumns = ref(getProjectTeamColumns());
</script>

<style scoped lang="scss"></style>
