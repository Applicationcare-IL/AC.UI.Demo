<template>
  <template v-for="task in tasks" :key="task.id">
    <MobileTaskCardDetail :task="task" class="m-3" />
  </template>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

const authStore = useAuthStore();
const optionSetsStore = useOptionSetsStore();

const { getTasksFromApi } = useTasks();

const tasks = ref([]);

const utilsStore = useUtilsStore();

const OPEN_STATUS = ref();

const fetchTasks = async () => {
  utilsStore.entity = "task";

  const params = {
    employee: authStore.user.id,
    status: OPEN_STATUS.value,
  };

  await getTasksFromApi(params).then(({ data }) => {
    tasks.value = data;
  });
};

onMounted(async () => {
  OPEN_STATUS.value = await optionSetsStore.getValueId("task_status", "open");

  await fetchTasks();
});

fetchTasks();
</script>

<style scoped lang="scss"></style>
