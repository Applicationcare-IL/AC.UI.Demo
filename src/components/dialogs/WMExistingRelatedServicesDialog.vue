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
        <WMExistingServicesTable @update:selection="onSelectionChanged" />
        <div class="flex flex-row w-full justify-content-end gap-3 mt-3">
          <WMTempButton
            :text="$t('buttons.cancel')"
            type="type-3"
            @click="closeDialog"
          />
          <WMTempButton
            :text="$t('buttons.link-service')"
            type="type-4"
            :disabled="!selectedService"
            :is-disabled="!selectedService"
            @click="handleLinkService"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();

const modelValue = defineModel();

const selectedService = ref();

const onSelectionChanged = (value) => {
  selectedService.value = value;
};

const closeDialog = () => {
  modelValue.value = false;
};

const handleLinkService = () => {
  console.log("Linking services", selectedService.value);
};
</script>
