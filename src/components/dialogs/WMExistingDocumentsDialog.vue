<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :style="{ width: '90vw' }"
    class="existing-documents-dialog"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex">
      <!-- <div class="flex flex-column border-left-1 existing-documents-dialog__filters">
        <WMFilterForm entity="related-service" filter-form-name="related-service" />
      </div> -->
      <div class="flex flex-column p-3 existing-documents-dialog__table">
        <WMExistingDocumentsTable @update:selection="onSelectionChanged" />
        <div class="flex flex-row w-full justify-content-end gap-3 mt-3">
          <WMButton :text="$t('buttons.cancel')" type="type-3" @click="closeDialog" />
          <WMButton
            :text="$t('buttons.select-document')"
            type="type-4"
            :disabled="!selectedDocument"
            :is-disabled="!selectedDocument"
            @click="handleSelectDocument"
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

const emit = defineEmits(["selectDocument"]);

const selectedDocument = ref();

const onSelectionChanged = (value) => {
  selectedDocument.value = value;
};

const closeDialog = () => {
  modelValue.value = false;
};

const handleSelectDocument = () => {
  emit("selectDocument", selectedDocument.value);
  closeDialog();
};
</script>
