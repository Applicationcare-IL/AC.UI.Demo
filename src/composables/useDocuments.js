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

  // UTILITIES
  const parseUpdateDocument = (document) => {
    return {
      name: document.name,
    };
  };

  const parseCreateDocument = (document) => {
    return {
      name: document.name,
      project_id: document.project_id,
      document_type_id: document.document_detail,
      document_detail_id: document.document_type,
    };
  };

  const mapDocument = (document) => {
    return {
      id: document.id,
      name: document.name,
      document_type: document.document_type,
      document_detail: document.detail_type,
      uploaded_from: document.uploaded_from,
      upload_date: document.upload_date,
      owner: document.owner,
      task_id: document.task_id,
      file_path: document.file_path,
      has_file: document.file_path ? true : false,
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

    // UTILITIES
    mapDocument,
    parseUpdateDocument,
    parseCreateDocument,

    // MOCKED DATA
    getDocuments,
  };
}
