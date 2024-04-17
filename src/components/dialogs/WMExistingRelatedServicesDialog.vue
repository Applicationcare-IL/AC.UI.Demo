<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ minWidth: '90vw' }"
    class="existing-related-services-dialog"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex">
      <div
        class="flex flex-column border-left-1 existing-related-services-dialog__filters"
      >
        <WMFilterForm
          entity="related-service"
          filter-form-name="related-service"
        />
      </div>
      <div class="flex flex-column">TABLE</div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();

const visible = ref(true);
</script>
