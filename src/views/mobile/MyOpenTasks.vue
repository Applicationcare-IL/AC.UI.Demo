<template>
  <template v-for="task in tasks" :key="task.id">
    <MobileTaskCardDetail :task="task" class="m-3" />
  </template>
</template>

<script setup>
import { ref } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useUtilsStore } from "@/stores/utils";

import MobileTaskCardDetail from "./MobileTaskCardDetail.vue";

const authStore = useAuthStore();

const { getTasksFromApi } = useTasks();

const tasks = ref([]);

const utilsStore = useUtilsStore();

const OPEN_STATUS = 310;

const fetchTasks = () => {
  utilsStore.entity = "task";

  const params = {
    employee: authStore.user.id,
    status: OPEN_STATUS,
  };

  getTasksFromApi(params).then(({ data }) => {
    tasks.value = data;
  });
};

fetchTasks();
</script>

<style scoped lang="scss"></style>
