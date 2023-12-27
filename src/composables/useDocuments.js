import { useDocumentsStore } from "@/stores/documentsStore";

export function useDocuments() {
  const documentsStore = useDocumentsStore();

  // ACTIONS
  const getDocumentsFromApi = async (params) => {
    const response = await documentsStore.getDocumentsFromApi(params);

    const documents = response.data.map((document) => {
      return mapDocument(document);
    });

    const totalRecords = response.meta.total;

    return { data: documents, totalRecords };
  };

  const createDocument = async (document) => {
    return await documentsStore.createDocument(document);
  };

  const updateDocument = async (id, document) => {
    return await documentsStore.updateDocument(id, document);
  };

  const deleteDocument = async (id) => {
    return await documentsStore.deleteDocument(id);
  };

  const uploadDocument = async (id, document) => {
    return await documentsStore.uploadDocument(id, document);
  };

  const downloadDocument = async (id) => {
    return await documentsStore.downloadDocument(id);
  };

  const handleDownloadFile = (documentId) => {
    downloadDocument(documentId)
      .then((response) => {
        var reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = function () {
          let imageDataUrl = reader.result;

          let link = document.createElement("a");
          link.download = "file";
          link.href = imageDataUrl;
          link.click();
        };
      })
      .catch((error) => {
        console.error("Error al descargar el archivo", error);
      });
  };

  // UTILITIES
  const parseUpdateDocument = (document) => {
    let parsedDocument = {
      name: document.name,
    };

    // send only if document_type id is not null
    if (document.document_type?.id) {
      parsedDocument.document_type_id = document.document_type.id;
    }

    // send only if document_detail id is not null
    if (document.document_detail?.id) {
      parsedDocument.document_detail_id = document.document_detail.id;
    }

    return parsedDocument;
  };

  const parseCreateDocument = (document) => {
    return {
      name: document.name,
      project_id: document.project_id,
      document_type_id: document.document_type,
      document_detail_id: document.document_detail,
    };
  };

  /**
   * Maps document object to a new object with the required properties
   * We need the document_type and document_detail to be empty objects in order to work with the dropdowns
   * @param {*} document
   * @returns mapped document
   */
  const mapDocument = (document) => {
    return {
      id: document.id,
      name: document.name,
      document_type: document.document_type
        ? document.document_type
        : { id: null },
      document_detail: document.document_detail
        ? document.document_detail
        : { id: null },
      uploaded_from: document.uploaded_from,
      upload_date: document.upload_date,
      owner: document.owner.name,
      task: document.task,
      file_name: document.file_name,
      has_file: document.file_name ? true : false,
      mode: "saved",
    };
  };

  // MOCKED DATA
  const getDocumentsFakeData = () => {
    const Documents = [];
    const randomBoolean = () => Math.random() >= 0.5;
    const id = Math.floor(Math.random() * 1000);

    for (let i = 0; i < 100; i++) {
      Documents.push({
        has_file: randomBoolean(),
        file_url: "https://www.google.com",
        uploaded_on: "11-11-22",
        owner: "Israel Israeli",
        task_id: "123",
        uploaded_from: "שם של פרויקט",
        name: "אישור מנהל מחוז",
        detail: "כיבוי אש",
        type: "אישור",
        id: id + i,
        mode: "saved",
      });
    }

    return Documents;
  };

  const getDocuments = () => {
    return Promise.resolve(getDocumentsFakeData());
  };

  return {
    // ACTIONS
    getDocumentsFromApi,
    createDocument,
    updateDocument,
    deleteDocument,
    uploadDocument,
    downloadDocument,
    handleDownloadFile,

    // UTILITIES
    mapDocument,
    parseUpdateDocument,
    parseCreateDocument,

    // MOCKED DATA
    getDocuments,
  };
}
