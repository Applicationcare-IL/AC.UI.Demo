<template>
  <div class="flex flex-row flex-wrap gap-4">
    <ConfirmDialog
      :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    ></ConfirmDialog>
    <WMButton
      @click="saveForm()"
      name="save"
      icon="save"
      type="specialSave"
      iconPosition="left"
    >
      שמירה
    </WMButton>
    <WMButton
      @click="cancelForm()"
      name="cancel"
      icon="cancel"
      iconPosition="left"
    >
      ביטול
    </WMButton>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
import { useLayout } from "@/layout/composables/layout";

const emit = defineEmits(["saveForm", "cancelForm"]);
const { layoutConfig } = useLayout();

const saveForm = () => {
  emit("saveForm");
};

const cancelForm = () => {
  emit("cancelForm");
};
</script>
