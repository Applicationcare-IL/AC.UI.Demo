<template>
  <WMButton
    class="m-1 col-6"
    name="done-white"
    icon="done"
    :disabled="!isMilestoneCompletable"
    @click="handleCompleteMilestone"
    @confirm="doCompleteTasks"
  >
    <span v-if="isMilestoneCompletable || selectedElements == 0">
      {{ t("buttons.complete") }}
    </span>
    <span v-else> {{ t("milestone.completed") }} </span>
  </WMButton>
  <!--
    <pre>
    isMilestoneCompletable {{ isMilestoneCompletable }}
  {{ selectedElements == 0 || !isMilestoneCompletable }}
  </pre>
  -->
  <!-- <pre> {{ selectedMilestone.milestone_status.value }}</pre> -->
</template>

<script setup>
// IMPORTS
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { completeMilestone } = useProjects();
const utilsStore = useUtilsStore();
const dialog = useDialog();
const toast = useToast();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["milestoneCompleted"]);

// REFS
const selectedElements = ref(0);
const isMilestoneCompletable = ref(false);

// COMPUTED
const selectedMilestone = computed(() => {
  return utilsStore.selectedElements["milestone"]?.[0];
});

// COMPONENT METHODS
const checkIfMilestoneIsCompletable = (payments) => {
  // check if selected milestone status is complete
  if (selectedMilestone.value.milestone_status.value == "complete") {
    return false;
  }

  // check if selected milestone is of type project and not completed
  if (utilsStore.selectedElements["milestone"].length == 1) {
    if (
      selectedMilestone.value.milestone_type.value == "project" &&
      selectedMilestone.value.milestone_status.value !== "completed"
    ) {
      return true;
    }
  }

  // if milestone is of type payment but we dont have payments
  if (!payments) {
    return false;
  }

  // check if all payments are completed

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

const handleCompleteMilestone = async () => {
  let result = await dialog.confirmCompleteMilestone();

  if (result) {
    completeMilestone(
      selectedMilestone.value.project.id,
      selectedMilestone.value.id
    )
      .then(() => {
        toast.successAction("milestone", "completed");
        emit("milestoneCompleted");
      })
      .catch((error) => {
        toast.error(error);
      });
  }
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
