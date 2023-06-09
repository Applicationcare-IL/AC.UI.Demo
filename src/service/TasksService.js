export const TasksService = {
    getTasksData() {
        const tasks = []; 
        
        for (let i = 0; i < 100; i++) {
            const is_open = Math.random() < 0.5;
            tasks.push({
                task_number: '469879'+ i,
                process_number: '687984'+ i,
                task_type: 'תשאול לקוח',
                family: 'מוקד',
                contact: 'שלומי שבת',
                status: is_open ? 'פתוח' : 'סגור',
                due_date: '11/12/23',
                SLA: is_open ? slas[parseInt(Math.random() * 3)] : slas[parseInt(Math.random() * 2 + 3)],
                in_charge: 'Israel Israeli',
                customer: 'טיילור סוויפט',
                call: 'כן',
                open_date: '11/11/22',
                close_date: is_open ? '':'11/12/23',
                last_change: '11/11/22 10:23',
                remarks: 'תוכן של הערה שכתובה יפה מאוד',
                stage: "קבלת בקשה",
                is_open: is_open,
            });
        }

        return tasks;
    },

    getTasksMini() {
        return Promise.resolve(this.getTasksData().slice(0, 5));
    },

    getTasksSmall() {
        return Promise.resolve(this.getTasksData().slice(0, 10));
    },

    getTasks() {
        return Promise.resolve(this.getTasksData());
    },

    getTasksWithOrdersSmall() {
        return Promise.resolve(this.getTasksWithOrdersData().slice(0, 10));
    },

    getTasksWithOrders() {
        return Promise.resolve(this.getTasksWithOrdersData());
    }
    
    
};

const slas = ['10 ימים', '2 ימים', '3 ימים', 'עמד ביעד', 'הסתיים בחריגה'];

