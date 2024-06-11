<template>
  <WMTempButton
    :text="completeButtonText"
    type="type-5"
    :is-disabled="!isMilestoneCompletable"
    :disabled="!isMilestoneCompletable"
    @click="handleCompleteMilestone"
  >
    <template #customIcon>
      <div class="flex" v-html="DoneIcon" />
    </template>
  </WMTempButton>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import DoneIcon from "/icons/done.svg?raw";
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
const completeButtonText = computed(() => {
  return isMilestoneCompleted.value ? t("milestone.completed") : t("buttons.complete");
});

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
  if (!isMilestoneCompletable.value) {
    return;
  }

  let result = await dialog.confirmCompleteMilestone();

  if (result) {
    completeMilestone(selectedMilestone.value.id)
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
