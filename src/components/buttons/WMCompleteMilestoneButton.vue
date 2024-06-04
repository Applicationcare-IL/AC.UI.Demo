<template>
  <WMButton
    class="m-1 col-6"
    name="done-white"
    icon="done"
    :disabled="!isMilestoneCompletable"
    @click="handleCompleteMilestone"
    @confirm="doCompleteTasks"
  >
    <span v-if="isMilestoneCompleted"> {{ t("milestone.completed") }} </span>
    <span v-else>
      {{ t("buttons.complete") }}
    </span>
  </WMButton>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { completeMilestone } = useProjects();

const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();

const dialog = useDialog();
const toast = useToast();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["milestoneCompleted"]);

// REFS
const selectedElements = ref(0);
const paymentStatusCompleteId = ref();

// COMPUTED
const selectedMilestone = computed(() => {
  return utilsStore.selectedElements["milestone"]?.[0];
});

const isMilestoneCompleted = computed(() => {
  return selectedMilestone.value.milestone_status?.value == "complete";
});

// COMPONENT METHODS AND LOGIC
const isMilestoneCompletable = computed(() => {
  // check if selected milestone status is complete
  if (selectedMilestone.value.milestone_status?.value == "complete") {
    return false;
  }

  // check if selected milestone is of type project and not completed
  if (utilsStore.selectedElements["milestone"].length == 1) {
    if (
      selectedMilestone.value.milestone_type?.value == "project" &&
      selectedMilestone.value.milestone_status?.value !== "completed"
    ) {
      return true;
    }
  }

  const payments = utilsStore.selectedElements["payments"];

  // if milestone is of type payment but we dont have payments
  if (!payments) {
    return false;
  }

  // check if all payments have the status complete
  if (selectedMilestone.value.milestone_type?.value == "payment" && payments.length) {
    return payments.every((payment) => {
      return payment.payment_status == paymentStatusCompleteId.value;
    });
  }

  return false;
});

const updateStates = () => {
  if (!utilsStore.selectedElements["milestone"]) {
    return;
  }

  selectedElements.value = utilsStore.selectedElements["milestone"]?.length;
};

const handleCompleteMilestone = async () => {
  let result = await dialog.confirmCompleteMilestone();

  if (result) {
    completeMilestone(selectedMilestone.value.project.id, selectedMilestone.value.id)
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
onMounted(async () => {
  paymentStatusCompleteId.value = await optionSetsStore.getValueId(
    "payment_status",
    "complete"
  );

  updateStates();
});
</script>

<style scoped></style>
