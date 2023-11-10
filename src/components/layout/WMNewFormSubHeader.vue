<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <WMFormButtons @save-form="saveForm()" @cancel-form="cancelForm()" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["saveForm", "cancelForm"]);

const saveForm = () => {
  emit("saveForm");
};

const cancelForm = () => {
  emit("cancelForm");
};
</script>
