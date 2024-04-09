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
    @click="toggleAddFileOverlay"
  >
    <div class="p-button-svg" v-html="AddFileIcon" />
  </Button>
  <OverlayPanel ref="addFileOverlay">
    <div class="flex gap-3">
      <FileUpload
        mode="basic"
        name="demo[]"
        accept=".png, .jpg, .jpeg, .pdf, .dwf, .dwg, .msg, .zip, .rar, .doc, .docx, .xls, .xlsx, .pptx"
        custom-upload
        :auto="true"
        @uploader="customBase64Uploader($event)"
      />
      <!-- <Button label="File folder" /> -->
    </div>
  </OverlayPanel>
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

const hasFileUploaded = ref(props.hasFile);

const customBase64Uploader = async (event) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);

  reader.onloadend = function () {
    const arrayBuffer = reader.result;
    const base64data = arrayBufferToBase64(arrayBuffer);

    const params = {
      extension: file.name.split(".").pop(),
      file: base64data,
    };

    uploadDocument(props.documentId, params)
      .then(() => {
        hasFileUploaded.value = true;
        addFileOverlay.value.toggle();
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

const addFileOverlay = ref();

const toggleAddFileOverlay = (event) => {
  addFileOverlay.value.toggle(event);
};
</script>

<style scoped></style>
