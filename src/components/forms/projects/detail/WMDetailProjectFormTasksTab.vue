<template>
  <WMTasksTable
    :tasks="tasks"
    :columns="taskColumns"
    multiselect
    :hide-title="true"
  />
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { getTasksFromApi } = useTasks();
const { getTaskColumns } = useListUtils();
const route = useRoute();

const tasks = ref();
const taskColumns = ref(getTaskColumns());

const fetchData = async () => {
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
