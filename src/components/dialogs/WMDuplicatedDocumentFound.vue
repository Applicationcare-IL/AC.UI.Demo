<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="mb-5">
      <h4 class="h4">Duplicates found</h4>
      <p class="p2">
        There are documents with identical classification in this project. Is
        this a new one?
      </p>
      <p class="p2">This document:</p>

      <p class="p2">Existing document:</p>
    </div>
    <template #footer>
      <Button
        label="Ok"
        icon="pi pi-check"
        autofocus
        @click="visible = false"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();

const visible = ref(true);
</script>
