import { useJournalStore } from "@/stores/journalStore";

export function useJournal() {
  const journalStore = useJournalStore();
  const { parseDate } = useDates();

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
    const hour = journal.date.split(" ")[1].split(":").slice(0, 2).join(":");
    const date = journal.date.split(" ")[0];

    return {
      id: journal.id,
      type: journal.type,
      date: parseDate(date),
      hour: hour,
      data: journal.data,
      content: journal.content,
      caused_by: journal.caused_by,
      task: journal.task,
    };
  };

  return {
    // MOCKED DATA
    getJournalFromApi,
    postJournalInApi,
    mapJournal,
  };
}
