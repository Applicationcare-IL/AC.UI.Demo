<template>
  <WMButton
    class="m-1 col-6"
    name="done-white"
    icon="done"
    @click="completeTasks"
    :disabled="disabled"
    >{{ t("task.complete") }}
  </WMButton>
  <WMCompleteServiceDialog />
</template>

<script setup>
import { ref, watch } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";
import { TasksService } from "@/service/TasksService";

import { useToast } from "@/stores/toast";
import { useI18n } from "vue-i18n";
import { useDialog } from "@/stores/dialog";

const { t, locale } = useI18n();

const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();

const dialog = useDialog();
const toast = useToast();
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const completeTasks = () => {
  console.log(utilsStore.selectedElements["task"].map((x) => x.task_number));
  TasksService.completeTasks(
    utilsStore.selectedElements["task"].map((x) => x.task_number)
  )
    .then(() => {
      toast.successAction("task", "completed");
    })
    .catch((error) => {
      console.log(error.response.status);
      if (error.response.status == 422) {
        dialog.completeService(1);
      } else {
        toast.errorAction("task", "not_completed");
      }
    });
};

const completeService = (id) => {
  TasksService.completeTasks(
    utilsStore.selectedElements["task"].map((x) => x.task_number),
    formUtilsStore.completeServiceReasons
  )
    .then((data) => {
      toast.successAction("service", "completed");
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-completed");
    });
};

formUtilsStore.completeService = completeService;
</script>

<style scoped></style>
