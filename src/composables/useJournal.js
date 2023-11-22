export function useJournal() {
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
  };
}
