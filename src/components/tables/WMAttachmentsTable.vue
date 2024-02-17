<template>
  <div>
    <WMButton
      class="mb-3"
      name="new"
      icon="new"
      icon-position="right"
      @click="openUploadAttachment"
    >
      {{ $t("attachments.upload-attachment") }}
    </WMButton>

    <input
      ref="fileInput"
      style="display: none"
      type="file"
      multiple
      @change="handleFileChange"
    />
  </div>
  <div ref="dropZoneRef" :class="{ 'dropzone-active': isOverDropZone }">
    <DataTable :value="fileList" paginator :rows="5">
      <Column field="img_url" header="">
        <template #body="slotProps">
          <div class="overflow-hidden">
            <div
              class="bg-auto bg-no-repeat bg-center bg-primary border-round h-9rem w-16rem"
              :style="{ backgroundImage: `url(${slotProps.data.img_url})` }"
            ></div>
          </div>
        </template>
      </Column>
      <Column field="name" :header="$t('filename')"></Column>
      <Column field="id" :header="$t('actions')" style="width: 5rem">
        <template #body="slotProps">
          <div class="flex flex-row gap-2">
            <a
              :href="slotProps.data.img_url"
              download
              class="no-underline"
              target="_blank"
            >
              <Button
                icon="pi pi-download"
                class="p-button-rounded p-button-success"
              />
            </a>

            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="removeAttachment(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useDropZone } from "@vueuse/core";
import { ref } from "vue";

const dropZoneRef = ref(null);
const files = ref();
const fileInput = ref(null);

function openUploadAttachment() {
  fileInput.value.click();
}

function onDrop(files) {
  console.log(files);
  // upload file
}

const handleFileChange = () => {
  files.value = Array.from(fileInput.value.files);

  uploadAttachmentToAPI();
};

const uploadAttachmentToAPI = () => {
  files.value.forEach((file) => {
    const formData = new FormData();

    formData.append("file", file);

    // addAttachmentToEmail(formData).then((response) => {
    //   attachmentList.value.push({
    //     id: response.data.id,
    //     name: file.name,
    //   });
    // });
  });
};

const removeAttachment = (id) => {
  //   deleteAttachment(id);
};

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

const fileList = ref([
  {
    id: 1,
    img_url: "https://placehold.co/600x400/EEE/31343C",
    name: "File 1",
  },
  {
    id: 2,
    img_url: "https://placehold.co/600x400/EEE/31343C",
    name: "File 2",
  },
  {
    id: 3,
    img_url: "https://placehold.co/600x400/EEE/31343C",
    name: "File 3",
  },
  {
    id: 4,
    img_url: "https://placehold.co/600x400/EEE/31343C",
    name: "File 4",
  },
  {
    id: 5,
    img_url: "https://placehold.co/600x400/EEE/31343C",
    name: "File 5",
  },
]);
</script>

<style scoped lang="scss">
.dropzone-active {
  border: 2px dashed black;
  padding: 1em;
  position: relative;

  &::after {
    content: "Drop files here";
    position: absolute;
    text-align: center;
    z-index: 1;
    background: rgba(255, 255, 255, 0.8);
    top: 0;
    left: 0;
    height: calc(100% - 20px);
    width: 100%;
    font-size: 2rem;
    padding-top: 20px;
  }
}
</style>
