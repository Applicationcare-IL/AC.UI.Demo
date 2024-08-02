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
        :text="$t('documents.existing-document')"
        type="primary"
        @click="openDocumentSelector"
      />
    </div>
  </OverlayPanel>
</template>
<script setup>
// IMPORTS
import { ref } from "vue";

import AddFileIcon from "/icons/menu/add_file.svg?raw";
import FileIcon from "/icons/menu/file.svg?raw";

// DEPENDENCIES
const { uploadAttachment } = useAttachments();

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
});

const emit = defineEmits(["fileUploaded"]);

// REFS
const uploadDocumentOverlay = ref();

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

const openDocumentSelector = () => {
  console.log("openDocumentSelector");
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
