<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :style="{ width: '90vw' }"
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
      <div class="flex flex-column p-3 existing-related-services-dialog__table">
        <WMExistingServicesTable />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();

const modelValue = defineModel();
</script>
