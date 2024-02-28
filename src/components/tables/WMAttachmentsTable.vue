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
          {{ slotProps.data }}
          <div v-if="slotProps.data.is_image === 1" class="overflow-hidden">
            <div
              class="bg-auto bg-no-repeat bg-center bg-primary border-round h-9rem w-16rem"
              :style="{
                backgroundImage: `url(${slotProps.data.thumbnail_url})`,
              }"
            ></div>
          </div>
        </template>
      </Column>
      <Column field="name" :header="$t('filename')"></Column>
      <Column field="id" :header="$t('actions')" style="width: 5rem">
        <template #body="slotProps">
          <div class="flex flex-row gap-2">
            <a
              v-if="slotProps.data.download_url"
              :href="slotProps.data.download_url"
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
import { onMounted, ref } from "vue";

const dropZoneRef = ref(null);
const files = ref();
const fileInput = ref(null);
const fileList = ref([]);

const props = defineProps({
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: Number,
    required: true,
  },
});

const { getAttachmentsFromApi, uploadAttachment, deleteAttachment } =
  useAttachments();

const loadAttachments = () => {
  getAttachmentsFromApi(props.entityType, props.entityId).then((response) => {
    fileList.value = response;
  });
};

onMounted(() => {
  loadAttachments();
});

function openUploadAttachment() {
  fileInput.value.click();
}

function onDrop(filesToUpload) {
  files.value = filesToUpload;
  setTimeout(() => {
    uploadAttachmentToAPI();
  }, 500);
}

const handleFileChange = () => {
  files.value = Array.from(fileInput.value.files);
  uploadAttachmentToAPI();
};

const uploadAttachmentToAPI = () => {
  files.value.forEach((file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("entity_type", props.entityType);
    formData.append("entity_id", props.entityId);

    uploadAttachment(formData).then(() => {
      loadAttachments();
    });
  });
};

const removeAttachment = (id) => {
  const params = {
    entity_type: props.entityType,
    entity_id: props.entityId,
  };

  deleteAttachment(id, params).then(() => {
    loadAttachments();
  });
};

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);
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
