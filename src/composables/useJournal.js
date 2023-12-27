import { useJournalStore } from "@/stores/journalStore";

export function useJournal() {
  const journalStore = useJournalStore();

  const getJournalFromApi = async (entityType, entityId) => {
    const params = {
      entity_type: entityType,
      entity_id: entityId,
    };

    const response = await journalStore.getJournalFromApi(params);

    return response.data.data;
  };

  const postJournalInApi = async (entityType, entityId, content) => {
    const params = {
      entity_type: entityType,
      entity_id: entityId,
      content: content,
    };

    await journalStore.postJournalInApi(params);
  };

  const mapJournal = (journal) => {
    const date = journal.date.split(" ")[0].split("-").reverse().join("-");
    const hour = journal.date.split(" ")[1].split(":").slice(0, 2).join(":");

    return {
      id: journal.id,
      type: journal.type,
      date: date,
      hour: hour,
      data: journal.data,
      content: journal.content,
      caused_by: journal.caused_by,
      task: journal.task,
    };
  };

  // MOCKED DATA
  const getJournalData = () => {
    const Journal = [];
    const types = ["comment", "file", "call", "chat", "task", "assign"];
    for (let i = 0; i < 100; i++) {
      Journal.push({
        type: types[Math.floor(Math.random() * types.length)],
        date: "11-11-22",
        hour: "12:43",
        content: "Activity Content",
      });
    }

    return Journal;
  };

  const getJournalMini = () => {
    return Promise.resolve(getJournalData().slice(0, 5));
  };

  const getJournalSmall = () => {
    return Promise.resolve(getJournalData().slice(0, 10));
  };

  const getJournalWithOrdersSmall = () => {
    return Promise.resolve(getJournalWithOrdersData().slice(0, 10));
  };

  const getJournalWithOrders = () => {
    return Promise.resolve(getJournalWithOrdersData());
  };
  const getJournal = (id) => {
    return Promise.resolve(getJournalData().find((entry) => entry.id === id));
  };

  return {
    // MOCKED DATA
    getJournalData,
    getJournalMini,
    getJournalSmall,
    getJournalWithOrdersSmall,
    getJournalWithOrders,
    getJournal,
    getJournalFromApi,
    postJournalInApi,
    mapJournal,
  };
}
