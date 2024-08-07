<template>
  <WMButton
    :text="textButton"
    type="type-5"
    :is-disabled="isDisabled"
    :disabled="isDisabled"
    @click="handleCompleteTasks"
  >
    <template #customIcon>
      <div class="flex" v-html="DoneIcon" />
    </template>
  </WMButton>

  <WMCompleteServiceDialog />
  <WMCompleteProjectDialog />
</template>

<script setup>
// IMPORTS
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import DoneIcon from "/icons/done.svg?raw";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { completeTasks } = useTasks();
const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();
const dialog = useDialog();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["taskCompleted"]);

// REFS
const selectedElements = ref(0);
const areTaskCompletable = ref(false);

// COMPUTED
const textButton = computed(() => {
  return areTaskCompletable.value || selectedElements.value == 0
    ? t("buttons.complete")
    : t("task.completed");
});

const isDisabled = computed(() => {
  return selectedElements.value == 0 || !areTaskCompletable.value;
});

// COMPONENT METHODS AND LOGIC

const checkIfTasksAreCompletable = (tasks) => {
  if (tasks.length == 0) {
    return false;
  }

  // we cant complete if the selected task is a subproject task
  if (tasks.length == 1 && tasks[0].task_family?.value == "subproject") {
    return false;
  }

  // check if the selected task is active
  if (tasks.length == 1) {
    return tasks[0].state.value == "active";
  }

  // prevent complete when some of the selected tasks are subproject tasks
  if (tasks.lenght > 1 && tasks.some((x) => x.task_family?.value == "subproject")) {
    return false;
  }

  // check if all the selected tasks are active
  return tasks.every((x) => x.state.value == "active");
};

const updateStates = () => {
  if (!utilsStore.selectedElements[props.entity]) {
    return;
  }

  selectedElements.value = utilsStore.selectedElements[props.entity]?.length;
  areTaskCompletable.value = checkIfTasksAreCompletable(utilsStore.selectedElements[props.entity]);
};

updateStates();

const handleCompleteTasks = async () => {
  if (utilsStore.selectedElements["task"].length == 1) doCompleteTasks();

  if (utilsStore.selectedElements["task"].length > 1) {
    let result = await dialog.confirmCompleteTasks();
    if (result) {
      doCompleteTasks();
    }
  }
};

const doCompleteTasks = () => {
  completeTasks(utilsStore.selectedElements["task"].map((x) => x.task_number))
    .then(() => {
      toast.successAction("task", "completed");
      emit("taskCompleted");
      updateStates();
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
};

const completeProject = (id) => {
  completeTasks(
    utilsStore.selectedElements["task"].map((x) => x.task_number),
    formUtilsStore.completeProjectReasons
  )
    .then((data) => {
      toast.successAction("project", "completed");
    })
    .catch((error) => {
      console.error(error);
      toast.error("project", "not-completed");
    });
};

// formUtilsStore.completeService = completeService;

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => utilsStore.selectedElements[props.entity],
  () => {
    updateStates();
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
