export const ContactsService = {
    getContactsData() {
        const contacts = []; 
        
        for (let i = 0; i < 100; i++) {
            const is_active = Math.random() < 0.95;
            const is_male = Math.random() < 0.5;
            contacts.push({
                id: '000'+ i,
                contact_id: '795'+ i,
                name: 'שלומי שבת',
                'firstName': 'שלומי',
                'lastName': 'שבת',
                contact: 'שלומי שבת',
                customer: 'שם של לקוח כלשהו',
                customer_id: '0000' + i,
                telephone: '050-1234567',
                landline: '050-1234567',
                email: 'mailmail@mail.com',
                address: 'שמעון פרס 15, רחובות',
                open_processes: parseInt(Math.random() * 4),
                exception_processes: parseInt(Math.random() * 8),
                open_tasks: parseInt(Math.random() * 8),
                exception_tasks:  parseInt(Math.random() * 3),
                staff: '106 מוקד',
                status: is_active ? 'open' : 'closed',
                in_charge: 'Israel Israeli', 
                gender: is_male ? 'male' : 'female'
            });
        }

        return contacts;
    },

    getContactsMini() {
        return Promise.resolve(this.getContactsData().slice(0, 5));
    },

    getContactsSmall() {
        return Promise.resolve(this.getContactsData().slice(0, 10));
    },

    getContacts() {
        return Promise.resolve(this.getContactsData());
    },

    getContactsWithOrdersSmall() {
        return Promise.resolve(this.getContactsWithOrdersData().slice(0, 10));
    },

    getContactsWithOrders() {
        return Promise.resolve(this.getContactsWithOrdersData());
    },
    getContact(id){
        return Promise.resolve(this.getContactsData().find((contact) => contact.contact_id === id));
    }
    
    
};
