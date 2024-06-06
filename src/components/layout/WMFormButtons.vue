<template>
  <div class="flex flex-row flex-wrap gap-4">
    <WMSaveButton @click="saveForm()" />

    <WMButton name="cancel" icon="cancel" icon-position="left" @click="cancelForm()">
      {{ $t("buttons.cancel") }}
    </WMButton>
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
