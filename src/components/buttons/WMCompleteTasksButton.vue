<template>
  <WMButton
    class="m-1 col-6"
    name="done-white"
    icon="done"
    @click="handleCompleteTasks"
    :disabled="selectedElements == 0 || !areTaskCompletable"
  >
    {{ t("task.complete") }}
  </WMButton>
  <WMCompleteServiceDialog />
</template>

<script setup>
import { ref, watch } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { completeTasks } = useTasks();

const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();

const dialog = useDialog();
const toast = useToast();
const props = defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["taskCompleted"]);

const selectedElements = ref(0);
const areTaskCompletable = ref(false);

watch(
  () => utilsStore.selectedElements[props.entity],
  (value) => {
    selectedElements.value = value.length;
    areTaskCompletable.value = checkIfTasksAreCompletable(value);
  }
);

const checkIfTasksAreCompletable = (tasks) => {
  if (tasks.length == 0) return false;

  if (tasks.length == 1) return tasks[0].state == "active";

  return tasks.every((x) => x.state == "active");
};

const handleCompleteTasks = () => {
  completeTasks(utilsStore.selectedElements["task"].map((x) => x.task_number))
    .then(() => {
      toast.successAction("task", "completed");
      emit("taskCompleted");
    })
    .catch((error) => {
      if (error.response.status == 422) {
        dialog.completeService(1);
      } else {
        toast.errorAction("task", "not_completed");
      }
    });
};

const completeService = (id) => {
  completeTasks(
    utilsStore.selectedElements["task"].map((x) => x.task_number),
    formUtilsStore.completeServiceReasons
  )
    .then((data) => {
      toast.successAction("service", "completed");
    })
    .catch((error) => {
      console.error(error);
      toast.error("service", "not-completed");
    });
};

formUtilsStore.completeService = completeService;
</script>

<style scoped></style>
