<template>
  <ConfirmDialog
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    group="cancelService"
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
            name="cancelReason1"
            type="input-select"
            :highlighted="true"
            :label="$t('Cancel1') + ':'"
            :options="cancelReason1"
            @update:selectedItem="onCancelReason1Change"
          />
          <WMInput
            name="cancelReason2"
            type="input-select"
            :highlighted="true"
            :label="$t('Cancel2') + ':'"
            :options="cancelReason2"
            @update:selectedItem="onCancelReason2Change"
          />
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useLayout } from "@/layout/composables/layout";
import { useFormUtilsStore } from "@/stores/formUtils";

const { layoutConfig } = useLayout();

const optionSetsStore = useOptionSetsStore();
const cancelReason1 = ref();
const cancelReason2 = ref();
const formUtilsStore = useFormUtilsStore();

onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("service_cancelation_reason_1")
    .then((data) => (cancelReason1.value = data));
});

const onCancelReason1Change = (value) => {
  formUtilsStore.cancelServiceReasons["cancelation_reason_1"] = value.id;
  optionSetsStore
    .getOptionSetValuesFromApiRaw("service_cancelation_reason_2", value.id)
    .then((data) => (cancelReason2.value = data));
};

const onCancelReason2Change = (value) => {
  formUtilsStore.cancelServiceReasons["cancelation_reason_2"] = value.id;
  console.log(formUtilsStore.cancelServiceReasons);
};
</script>
