<template>
  <WMButton
    class="m-1 col-6"
    name="done-white"
    icon="done"
    :disabled="selectedElements == 0 || !areTaskCompletable"
    @click="handleCompleteTasks"
  >
    <span v-if="areTaskCompletable || selectedElements == 0">
      {{ t("buttons.complete") }}
    </span>
    <span v-else> {{ t("task.completed") }} </span>
  </WMButton>
  <WMCompleteServiceDialog />
  <WMCompleteProjectDialog />
</template>

<script setup>
// IMPORTS
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

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

// COMPONENT METHODS

const checkIfTasksAreCompletable = (tasks) => {
  if (tasks.length == 0) {
    return false;
  }

  // we cant complete if the selected task is a subproject task
  if (tasks.length == 1 && tasks[0].task_family.value == "subproject") {
    return false;
  }

  // check if the selected task is active
  if (tasks.length == 1) {
    return tasks[0].state == "active";
  }

  // prevent complete when some of the selected tasks are subproject tasks
  if (
    tasks.lenght > 1 &&
    tasks.some((x) => x.task_family.value == "subproject")
  ) {
    return false;
  }

  // check if all the selected tasks are active
  return tasks.every((x) => x.state == "active");
};

const updateStates = () => {
  if (!utilsStore.selectedElements[props.entity]) {
    return;
  }

  selectedElements.value = utilsStore.selectedElements[props.entity]?.length;
  areTaskCompletable.value = checkIfTasksAreCompletable(
    utilsStore.selectedElements[props.entity]
  );
};

updateStates();

const handleCompleteTasks = () => {
  // We need to assume that all the tasks to be completed share the same related entity type (service or project at the moment)
  const relatedEntity = utilsStore.selectedElements["task"][0].related_entity;

  completeTasks(utilsStore.selectedElements["task"].map((x) => x.task_number))
    .then(() => {
      toast.successAction("task", "completed");
      emit("taskCompleted");
    })
    .catch((error) => {
      if (error.response.status == 422) {
        if (relatedEntity.type == "service")
          dialog.completeService(relatedEntity.id);
        if (relatedEntity.type == "project")
          dialog.completeProject(relatedEntity.id);
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

formUtilsStore.completeService = completeService;

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
