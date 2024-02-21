<template>
  <div class="flex flex-row flex-wrap gap-4">
    <WMButton
      name="save"
      icon="save"
      type="specialSave"
      icon-position="left"
      @click="saveForm()"
    >
      {{ $t("buttons.save") }}
    </WMButton>
    <WMButton
      name="cancel"
      icon="cancel"
      icon-position="left"
      @click="cancelForm()"
    >
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
