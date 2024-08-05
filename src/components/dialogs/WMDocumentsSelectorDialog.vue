<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :style="{ width: '90vw' }"
    class="documents-selector-dialog"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex">
      <div class="flex flex-column p-3 documents-selector-dialog__table">
        <WMDocumentsSelectorTable
          :related-entity="relatedEntity"
          :related-entity-id="relatedEntityId"
          @update:selection="onSelectionChanged"
        />
        <div class="flex flex-row w-full justify-content-end gap-3 mt-3">
          <WMButton :text="$t('buttons.cancel')" type="type-3" @click="closeDialog" />
          <WMButton
            :text="$t('buttons.select-document')"
            type="type-4"
            :disabled="!selectedDocuments"
            :is-disabled="!selectedDocuments"
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
defineProps({
  relatedEntity: {
    type: String,
  },
  relatedEntityId: {
    type: Number,
  },
});

const emit = defineEmits(["selectDocuments"]);

// REFS
const modelValue = defineModel();
const selectedDocuments = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const onSelectionChanged = (value) => {
  selectedDocuments.value = value;
};

const closeDialog = () => {
  modelValue.value = false;
};

const handleSelectDocument = () => {
  emit("selectDocuments", selectedDocuments.value);
  closeDialog();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
