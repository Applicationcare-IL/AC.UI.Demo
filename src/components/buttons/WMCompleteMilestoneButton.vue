<template>
  <WMButton
    class="m-1 col-6"
    name="done-white"
    icon="done"
    :disabled="!isMilestoneCompletable"
    @click="handleCompleteTasks"
    @confirm="doCompleteTasks"
  >
    <span v-if="isMilestoneCompletable || selectedElements == 0">
      {{ t("buttons.complete") }}
    </span>
    <span v-else> {{ t("milestone.completed") }} </span>
  </WMButton>
  <!-- <pre>
    isMilestoneCompletable {{ isMilestoneCompletable }}
  {{ selectedElements == 0 || !isMilestoneCompletable }}
  {{ utilsStore.selectedElements["milestone"][0].milestone_type.value }}</pre
  > -->
  <!-- <WMCompleteServiceDialog /> -->
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
// const props = defineProps({
//   entity: {
//     type: String,
//     default: "",
//   },
// });

const emit = defineEmits(["milestoneCompleted"]);

// REFS
const selectedElements = ref(0);
const isMilestoneCompletable = ref(false);

// COMPUTED

// COMPONENT METHODS
const checkIfMilestoneIsCompletable = (payments) => {
  if (!payments) {
    return false;
  }

  // check if selected milestone is of type project
  if (utilsStore.selectedElements["milestone"].length == 1) {
    if (
      utilsStore.selectedElements["milestone"][0].milestone_type.value ==
      "project"
    ) {
      return true;
    }
  }

  return false;
};

const updateStates = () => {
  if (!utilsStore.selectedElements["milestone"]) {
    return;
  }

  selectedElements.value = utilsStore.selectedElements["milestone"]?.length;

  isMilestoneCompletable.value = checkIfMilestoneIsCompletable(
    utilsStore.selectedElements["payments"]
  );
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
      emit("milestoneCompleted");
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => utilsStore.selectedElements["payments"],
  () => {
    updateStates();
  },
  { deep: true }
);

watch(
  () => utilsStore.selectedElements["milestone"],
  () => {
    updateStates();
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
