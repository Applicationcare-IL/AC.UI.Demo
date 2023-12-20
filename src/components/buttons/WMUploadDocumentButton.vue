<template>
  <Button v-if="hasFile" class="p-button-only-icon p-lightblue-button">
    <div class="p-button-svg" v-html="FileIcon" @click="handleDownloadFile" />
  </Button>
  <Button
    v-else
    class="p-button-only-icon p-orange-button"
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
        customUpload
        @uploader="customBase64Uploader($event, documentId)"
      />
      <!-- <Button label="File folder" /> -->
    </div>
  </OverlayPanel>
</template>
<script setup>
import { ref } from "vue";

import FileIcon from "/icons/menu/file.svg?raw";
import AddFileIcon from "/icons/menu/add_file.svg?raw";

const props = defineProps({
  documentId: {
    type: Number,
    required: true,
  },
  hasFile: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["documentUploaded"]);

const { uploadDocument, downloadDocument } = useDocuments();

const handleDownloadFile = () => {
  downloadDocument(props.documentId)
    .then((response) => {
      console.log("response", response);

      const base64Data = response.data;

      // Determinar el tipo de archivo basado en la respuesta de la API
      const contentType = response.headers["content-type"];
      let fileExtension = "";

      if (contentType.includes("image/jpeg")) {
        fileExtension = "jpeg";
      } else if (contentType.includes("application/pdf")) {
        fileExtension = "pdf";
      } else {
        console.error("Tipo de archivo no soportado");
        return;
      }

      // Crear un enlace temporal
      const link = document.createElement("a");

      // Configurar el enlace con el contenido base64 y la extensión adecuada
      link.href = `data:${contentType};base64,${base64Data}`;
      link.download = `archivo.${fileExtension}`;

      // Añadir el enlace al DOM y simular un clic para iniciar la descarga
      document.body.appendChild(link);

      console.log("link", link);
      link.click();

      // Eliminar el enlace del DOM después de la descarga
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("Error al descargar el archivo", error);
    });
};

const customBase64Uploader = async (event, id) => {
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

    uploadDocument(id, params)
      .then((data) => {
        emit("documentUploaded");
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
