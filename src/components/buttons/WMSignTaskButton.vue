<template>
  <WMButton name="edit" icon="edit" @click="openDialog" />

  <Dialog
    v-model:visible="isOpen"
    modal
    header="Sign Task"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <WMSignTaskForm :signature-id="signatureId" />
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

defineProps({
  entity: {
    type: String,
    default: "",
  },
  signatureId: {
    type: Number,
    default: null,
  },
});

const { layoutConfig } = useLayout();

const isOpen = ref(false);

const openDialog = () => {
  isOpen.value = true;
};
</script>

<style scoped></style>
