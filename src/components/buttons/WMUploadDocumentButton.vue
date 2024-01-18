<template>
  <Button v-if="hasFileUploaded" class="p-button-only-icon p-lightblue-button">
    <div class="p-button-svg" @click="handleDownloadFile(documentId)" v-html="FileIcon" />
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
        accept="image/*,application/pdf"
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
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

  const fileExtension = file.name.split(".").pop();

  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;

    const cleanBase64 = base64data.split(",")[1];

    const params = {
      extension: fileExtension,
      file: cleanBase64,
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

const addFileOverlay = ref();

const toggleAddFileOverlay = (event) => {
  addFileOverlay.value.toggle(event);
};
</script>

<style scoped></style>
