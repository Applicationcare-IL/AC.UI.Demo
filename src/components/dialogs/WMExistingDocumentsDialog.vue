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
        <WMFilterForm entity="existing-document" filter-form-name="existing-document" />
      </div> -->
      <div class="flex flex-column p-3 existing-documents-dialog__table">
        <WMExistingDocumentsTable
          :related-entity="relatedEntity"
          :related-entity-id="relatedEntityId"
          @update:selection="onSelectionChanged"
        />
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
// IMPORTS
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
// DEPENDENCIES
const { layoutConfig } = useLayout();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["selectDocument"]);

defineProps({
  relatedEntity: {
    type: String,
    required: false,
  },
  relatedEntityId: {
    type: Number,
    required: false,
  },
});

// REFS
const modelValue = defineModel();

const selectedDocument = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
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

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
