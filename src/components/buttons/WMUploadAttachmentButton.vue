<template>
  <Button v-if="hasFileUploaded" class="p-button-only-icon p-lightblue-button">
    <div
      class="p-button-svg"
      @click="handleDownloadFile(documentId)"
      v-html="FileIcon"
    />
  </Button>
  <Button
    v-else
    class="p-button-only-icon p-orange-button"
    :disabled="disabled"
    @click="openUploadAttachment"
  >
    <div class="p-button-svg" v-html="AddFileIcon" />
  </Button>
  <input
    ref="fileInput"
    style="display: none"
    type="file"
    multiple
    @change="handleFileChange"
  />
</template>
<script setup>
import { ref } from "vue";

import AddFileIcon from "/icons/menu/add_file.svg?raw";
import FileIcon from "/icons/menu/file.svg?raw";

const props = defineProps({
  documentId: {
    type: Number,
  },
  hasFile: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const { uploadDocument, handleDownloadFile } = useDocuments();

const fileInput = ref(null);

const hasFileUploaded = ref(props.hasFile);

function openUploadAttachment() {
  fileInput.value.click();
}
</script>

<style scoped></style>
