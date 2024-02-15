<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap gap-2 align-items-center">
          <WMButton
            name="save"
            icon="save"
            type="specialSave"
            icon-position="left"
            :disabled="!getFormMeta(formKey)?.dirty"
            @click="saveForm"
          >
            {{ $t("save") }}
          </WMButton>
        </div>
      </div>
    </div>
  </div>
  <WMDetailBudgetItemForm ref="detailBudgetItemForm" :form-key="formKey" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

const formUtilsStore = useFormUtilsStore();

const { getFormMeta } = storeToRefs(formUtilsStore);

useHead({
  title: "Budget item Detail",
});

const formKey = ref("budgetItemDetailForm");

const detailBudgetItemForm = ref(null);

const saveForm = () => {
  detailBudgetItemForm.value.onSave();
};
</script>
