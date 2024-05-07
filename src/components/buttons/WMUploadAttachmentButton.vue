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
});

const emit = defineEmits(["fileUploaded"]);

const { uploadAttachment } = useAttachments();

const fileInput = ref(null);
const file = ref();

const hasFileUploaded = ref(props.hasFile);

function openUploadAttachment() {
  fileInput.value.click();
}

function handleFileChange(event) {
  file.value = event.target.files[0];
  uploadAttachmentToAPI();
}

function uploadAttachmentToAPI() {
  const formData = new FormData();

  formData.append("file", file.value);
  formData.append("entity_type", props.entity);
  formData.append("entity_id", props.entityId);
  formData.append("file", props.fileName);

  uploadAttachment(formData).then(() => {
    hasFileUploaded.value = true;
    emit("fileUploaded");
  });
}
</script>

<style scoped></style>
