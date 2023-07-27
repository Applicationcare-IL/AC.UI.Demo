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
                contact_id: '795'+ i,
                status: is_open ? 'פתוח' : 'סגור',
                due_date: '11/12/23',
                SLA: is_open ? slas[parseInt(Math.random() * 3)] : slas[parseInt(Math.random() * 2 + 3)],
                owner: 'Israel Israeli',
                team: 'אגף רישוי ופיקוח (הנדסה)',
                customer: 'טיילור סוויפט',
                call: 'כן',
                open_date: '11/11/22',
                close_date: is_open ? '':'11/12/23',
                last_change: '11/11/22 10:23',
                remarks: 'תוכן של הערה שכתובה יפה מאוד',
                stage: "קבלת בקשה",
                is_open: is_open,
                service_number: '469879'+ i,
                location: {
                    house_number: '12',
                    apartment: '42',
                    entrance: 'ב',
                    street: 'שמעון פרס',
                    city: 'כוכב יאיר',
                    country: 'ישראל',
                    zip: '1234567',
                },
                site: {
                    name: 'מועצה דתית בית הכנסת',
                    contact: 'שלומי שבת',
                    contact_id: '795'+ i,
                    contact_role: 'אחראי תברואה',
                    phone: '054-1234567',
                    email: 'mailmail@mailmail.com',
                    type: 'ציבורי',

                }
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
    },
    getTask(task_number){
        return Promise.resolve(this.getTasksData().find((task) => task.task_number === task_number));
    }
    
    
    
};

const slas = ['10 ימים', '2 ימים', '3 ימים', 'עמד ביעד', 'הסתיים בחריגה'];

