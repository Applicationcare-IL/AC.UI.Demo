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

const fetchTasks = () => {
  utilsStore.entity = "task";

  const params = {
    employee: authStore.user.id,
  };

  getTasksFromApi(params).then(({ data }) => {
    tasks.value = data;
  });
};

fetchTasks();

// const tasks = ref([
//   {
//     id: 1,
//     contact: "test",
//     address: "test",
//     close_date: "test",
//     request_1: "test",
//     image: "test",
//     type: "open",
//     days_till_closure: 1,
//     due_date: "test",
//   },
//   {
//     id: 2,
//     contact: "test",
//     address: "test",
//     close_date: "test",
//     request_1: "test",
//     image: "test",
//     type: "closed",
//     days_till_closure: 1,
//     due_date: "test",
//   },
// ]);
</script>

<style scoped lang="scss"></style>
