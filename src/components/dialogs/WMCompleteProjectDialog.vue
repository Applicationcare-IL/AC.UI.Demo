<template>
  <ConfirmDialog
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    group="completeProject"
  >
    <template #message="slotProps">
      <div class="flex flex-column p-5">
        <p>כדי לבטל את התהליך יש למלא פרטים אחרונים.</p>
        <p>
          פעולה זו תבטל גם את כל המשימות המקושרות לשירות זה! לא ניתן לבטל את
          המשימה מבלי למלא את הפרטים.
        </p>
        <div class="flex flex-row gap-4">
          <WMInput
            name="completeReason1"
            type="input-select"
            :highlighted="true"
            :label="$t('Complete1') + ':'"
            :options="completeReason1"
            @update:selected-item="onCompleteReason1Change"
          />
          <WMInput
            name="completeReason2"
            type="input-select"
            :highlighted="true"
            :label="$t('Complete2') + ':'"
            :options="completeReason2"
            @update:selected-item="onCompleteReason2Change"
          />
        </div>
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
    .getOptionSetValuesFromApiRaw("project_completion_reason_1")
    .then((data) => (completeReason1.value = data));
});

const onCompleteReason1Change = (value) => {
  formUtilsStore.completeProjectReasons["completion_reason_1"] = value.id;
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_completion_reason_2", value.id)
    .then((data) => (completeReason2.value = data));
};

const onCompleteReason2Change = (value) => {
  formUtilsStore.completeProjectReasons["completion_reason_2"] = value.id;
};
</script>
