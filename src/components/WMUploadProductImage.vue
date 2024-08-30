<template>
  <div ref="dropZoneRef" class="add-image" :class="{ 'dropzone-active': isOverDropZone }">
    <img class="vertical-align-middle" src="/icons/add_image.svg" alt="Add image" />
    <span>{{ $t("product.upload-image-drag-the-photo-here") }}</span>
    <span>
      {{ $t("product.upload-image-or") }}
      <span class="text-blue-600 underline cursor-pointer" @click="openUploadAttachment">
        {{ $t("product.upload-image-click-here") }}
      </span>
    </span>
  </div>

  <input ref="fileInput" style="display: none" type="file" @change="handleFileChange" />
</template>

<script setup>
// IMPORTS
import { useDropZone } from "@vueuse/core";
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const emit = defineEmits(["uploadImage"]);

// REFS
const dropZoneRef = ref(null);

const files = ref();
const fileInput = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const openUploadAttachment = () => {
  fileInput.value.click();
};

const handleFileChange = () => {
  files.value = Array.from(fileInput.value.files);

  emit("uploadImage", files.value[0]);
};

const onDrop = (filesToUpload) => {
  files.value = filesToUpload[0];

  setTimeout(() => {
    emit("uploadImage", files.value);
  }, 500);
};

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.add-image {
  border: 1px dashed var(--gray-600);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-weight: bold;
  line-height: 1.3em;
  width: 100%;
  height: 100%;

  &.dropzone-active {
    border: 1px dashed var(--gray-900);
    background-color: var(--gray-100);
  }
}
</style>
