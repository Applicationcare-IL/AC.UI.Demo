<template>
  <div class="flex flex-row flex-wrap gap-2">
    <WMSaveButton @click="saveForm()" />
    <WMCancelButton @click="cancelForm()" />
  </div>
</template>

<script setup>
const emit = defineEmits(["saveForm", "cancelForm"]);

const saveForm = () => {
  emit("saveForm");
};

const cancelForm = () => {
  emit("cancelForm");
};
</script>
