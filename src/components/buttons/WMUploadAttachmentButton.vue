<template>
  <Button v-if="hasFileUploaded" class="p-button-only-icon p-lightblue-button">
    <a class="p-button-svg" :href="downloadUrl" v-html="FileIcon" />
  </Button>
  <Button
    v-else
    class="p-button-only-icon p-orange-button"
    :disabled="disabled"
    @click="toggleUploadDocumentOverlay"
  >
    <div class="p-button-svg" v-html="AddFileIcon" />
  </Button>
  <input ref="fileInput" style="display: none" type="file" multiple @change="handleFileChange" />

  <OverlayPanel ref="uploadDocumentOverlay">
    <div class="flex gap-3">
      <WMButton :text="$t('documents.new-document')" type="primary" @click="openUploadAttachment" />
      <WMButton
        v-if="uploadExistingDocuments"
        :text="$t('documents.select-document')"
        type="primary"
        @click="openExistingDocumentsDialog"
      />
    </div>
  </OverlayPanel>

  <WMExistingDocumentsDialog
    v-if="showExistingDocumentsDialog"
    v-model="showExistingDocumentsDialog"
    :related-entity="relatedEntity"
    :related-entity-id="relatedEntityId"
    @select-document="handleSelectExistingDocument"
  />
</template>
<script setup>
// IMPORTS
import { ref } from "vue";

import AddFileIcon from "/icons/menu/add_file.svg?raw";
import FileIcon from "/icons/menu/file.svg?raw";

// DEPENDENCIES
const { uploadAttachment } = useAttachments();
const { updateDocument } = useDocuments();

// INJECT

// PROPS, EMITS
const props = defineProps({
  entity: {
    type: String,
    required: true,
  },
  entityId: {
    type: Number,
    required: true,
  },
  relatedEntity: {
    type: String,
    required: false,
  },
  relatedEntityId: {
    type: Number,
    required: false,
  },
  fileName: {
    type: String,
    required: true,
  },
  hasFile: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  downloadUrl: {
    type: String,
    default: "",
  },
  uploadExistingDocuments: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["fileUploaded"]);

// REFS
const uploadDocumentOverlay = ref();
const showExistingDocumentsDialog = ref(false);

const fileInput = ref(null);
const file = ref();
const downloadUrl = ref(props.downloadUrl);

const hasFileUploaded = ref(props.hasFile);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const openUploadAttachment = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  file.value = event.target.files[0];
  uploadAttachmentToAPI();
};

const uploadAttachmentToAPI = () => {
  const formData = new FormData();

  formData.append("file", file.value);
  formData.append("entity_type", props.entity);
  formData.append("entity_id", props.entityId);
  formData.append("field", props.fileName);

  uploadAttachment(formData).then(({ data }) => {
    hasFileUploaded.value = true;
    downloadUrl.value = data.download_url;
    uploadDocumentOverlay.value.toggle();
    emit("fileUploaded");
  });
};

const toggleUploadDocumentOverlay = (event) => {
  uploadDocumentOverlay.value.toggle(event);
};

const openExistingDocumentsDialog = () => {
  showExistingDocumentsDialog.value = true;
};

const handleSelectExistingDocument = (selectedDocument) => {
  if (props.entity !== "document") {
    console.log("This is only available for documents");
    return;
  }

  const params = {
    copy_attachment_from: selectedDocument.id,
  };

  updateDocument(props.entityId, params);

  hasFileUploaded.value = true;
  emit("fileUploaded");
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
