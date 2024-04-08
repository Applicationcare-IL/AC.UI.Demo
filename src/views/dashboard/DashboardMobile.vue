<template>
  <div v-if="loadingBadges" class="w-full flex justify-content-center mt-5">
    <ProgressSpinner />
  </div>
  <div v-else class="flex flex-column gap-2 m-3 mt-4">
    <div class="open-tasks-mobile">
      <router-link :to="{ name: 'myOpenTasksMobile' }">
        <Button
          :label="$t('navigation.my-open-tasks')"
          size="large"
          class="w-full p-5"
        />
      </router-link>
      <div class="open-tasks-mobile__badges flex gap-2">
        <Badge :value="numberOfTasksWithNoBreachSLA" severity="success" />
        <Badge :value="numberOfTasksWithNearBreachedSLA" severity="warning" />
        <Badge :value="numberOfTasksWithBreachedSLA" severity="danger" />
      </div>
    </div>
    <router-link :to="{ name: 'myClosedTasksMobile' }">
      <Button
        :label="$t('navigation.my-closed-tasks')"
        size="large"
        class="w-full p-5"
      />
    </router-link>
    <router-link :to="{ name: 'newServiceMobile' }">
      <Button
        :label="$t('navigation.new-service')"
        size="large"
        class="w-full p-5"
        severity="success"
      />
    </router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { getTasksFromApi } = useTasks();

const tasks = ref([]);
const numberOfTasksWithBreachedSLA = ref(0);
const numberOfTasksWithNearBreachedSLA = ref(0);
const numberOfTasksWithNoBreachSLA = ref(0);

const loadingBadges = ref(true);

const fetchTasks = () => {
  const params = {
    employee: authStore.user.id,
    per_page: 9999,
  };

  getTasksFromApi(params).then(({ data }) => {
    tasks.value = data;
    loadingBadges.value = false;

    numberOfTasksWithBreachedSLA.value = data.filter(
      (task) => task.sla.sla === "breached"
    ).length;

    numberOfTasksWithNearBreachedSLA.value = data.filter(
      (task) => task.sla.sla === "near_breach"
    ).length;

    numberOfTasksWithNoBreachSLA.value = data.filter(
      (task) => task.sla.sla === "no_breach"
    ).length;
  });
};

fetchTasks();
</script>

<style scoped lang="scss">
.open-tasks-mobile {
  position: relative;

  &__badges {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
