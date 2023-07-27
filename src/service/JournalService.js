export const JournalService = {
    getJournalData() {
        const Journal = [];
        const types = ["comment", "file", "call", "chat", "task", "assign"]
        for (let i = 0; i < 100; i++) {
            Journal.push({
                type: types[Math.floor(Math.random()*types.length)],
                date: "11-11-22",
                hour: "12:43",
                content: "Activity Content"
            });
        }

        return Journal;
    },


    getJournalMini() {
        return Promise.resolve(this.getJournalData().slice(0, 5));
    },

    getJournalSmall() {
        return Promise.resolve(this.getJournalData().slice(0, 10));
    },

    getJournal() {
        return Promise.resolve(this.getJournalData());
    },

    getJournalWithOrdersSmall() {
        return Promise.resolve(this.getJournalWithOrdersData().slice(0, 10));
    },

    getJournalWithOrders() {
        return Promise.resolve(this.getJournalWithOrdersData());
    },
    getJournal(id){
        return Promise.resolve(this.getJournalData().find((entry) => entry.id === id));
    }
};
