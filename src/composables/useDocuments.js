export function useDocuments() {
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
    // MOCKED DATA
    getDocuments,
  };
}
