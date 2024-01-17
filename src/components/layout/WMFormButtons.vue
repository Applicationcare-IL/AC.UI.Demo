<template>
  <div class="flex flex-row flex-wrap gap-4">
    <WMButton
      name="save"
      icon="save"
      type="specialSave"
      icon-position="left"
      @click="saveForm()"
    >
      שמירה
    </WMButton>
    <WMButton
      name="cancel"
      icon="cancel"
      icon-position="left"
      @click="cancelForm()"
    >
      ביטול
    </WMButton>
  </div>
</template>

<script setup>
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
