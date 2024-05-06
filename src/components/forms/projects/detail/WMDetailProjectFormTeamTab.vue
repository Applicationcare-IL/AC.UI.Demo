<template>
  <WMProjectTeamTable
    v-if="can('contacts.read')"
    :columns="projectTeamColumns"
    :project-id="route.params.id"
  />
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { can } = usePermissions();
const { getProjectTeamColumns } = useListUtils();
const projectTeamColumns = ref(getProjectTeamColumns());
</script>

<style scoped lang="scss"></style>
