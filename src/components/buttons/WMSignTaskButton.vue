<template>
  <WMButton type="sign" :text="$t('buttons.sign-document')" size="small" @click="openDialog">
    <template #customIcon>
      <div class="flex" v-html="InkPenIcon" />
    </template>
  </WMButton>

  <Dialog
    v-model:visible="isOpen"
    modal
    header="Sign Task"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <WMSignTaskForm :signature-id="signatureId" @task-signed="taskSigned" />
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

import InkPenIcon from "/icons/ink_pen.svg?raw";
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

const emit = defineEmits(["taskSigned"]);

const { layoutConfig } = useLayout();

const isOpen = ref(false);

const openDialog = () => {
  isOpen.value = true;
};

const taskSigned = () => {
  emit("taskSigned");
  isOpen.value = false;
};
</script>

<style scoped></style>
