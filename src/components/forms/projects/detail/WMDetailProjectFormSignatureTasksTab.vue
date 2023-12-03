<template>
  <WMSignatureTasksTable
    :tasks="tasks"
    :columns="taskColumns"
    multiselect
    :hide-title="true"
  />
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { getTasksFromApi, getTasks } = useTasks();
const { getSignatureTaskColumns } = useListUtils();
const route = useRoute();

const tasks = ref();
const taskColumns = ref(getSignatureTaskColumns());

const fetchData = async () => {
  tasks.value = await getTasks();
  return;

  const tasksData = await getTasksFromApi({
    entity_type: "project",
    entity_id: route.params.id,
  });
  tasks.value = tasksData.data;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss"></style>
