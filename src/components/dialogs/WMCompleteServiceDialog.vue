<template>
  <ConfirmDialog
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    group="completeService"
  >
    <template #message="slotProps">
      <div class="flex flex-column p-5">
        {{ $t("service.notification-complete-service-message") }}
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

const { layoutConfig } = useLayout();

const optionSetsStore = useOptionSetsStore();
const completeReason1 = ref();
const completeReason2 = ref();
const formUtilsStore = useFormUtilsStore();

onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("service_completion_reason_1")
    .then((data) => (completeReason1.value = data));
});

const onCompleteReason1Change = (value) => {
  formUtilsStore.completeServiceReasons["completion_reason_1"] = value.id;
  optionSetsStore
    .getOptionSetValuesFromApiRaw("service_completion_reason_2", value.id)
    .then((data) => (completeReason2.value = data));
};

const onCompleteReason2Change = (value) => {
  formUtilsStore.completeServiceReasons["completion_reason_2"] = value.id;
};
</script>
