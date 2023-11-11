<template>
  <WMButton
    class="m-1 col-6"
    name="done-white"
    icon="done"
    @click="completeTasks"
    :disabled="selectedElements == 0"
    >{{ t("task.complete") }}
  </WMButton>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { TasksService } from "@/service/TasksService";

import { useToast } from "@/stores/toast";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

const utilsStore = useUtilsStore();

const toast = useToast();

const completeTasks = () => {
  utilsStore.selectedElements["task"].forEach((task) => {
    TasksService.completeTask(task.task_number).then(() => {
      toast.successAction("task", "completed");
    });
  });
};

const selectedElements = ref(0);
watch(
  () => utilsStore.selectedElements["task"],
  (value) => {
    selectedElements.value = value.length;
  }
);
</script>

<style scoped></style>
