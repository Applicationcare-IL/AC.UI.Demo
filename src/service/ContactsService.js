import axiosConfig from '@/service/axiosConfig';

export const ContactsService = {
    getContactsData() {
        const contacts = [];

        for (let i = 0; i < 100; i++) {
            const is_active = Math.random() < 0.95;
            const is_male = Math.random() < 0.5;
            const is_main = Math.random() < 0.2;
            contacts.push({
                id: '000' + i,
                contact_id: '795' + i,
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
                open_services: parseInt(Math.random() * 4),
                exception_services: parseInt(Math.random() * 8),
                open_tasks: parseInt(Math.random() * 8),
                exception_tasks: parseInt(Math.random() * 3),
                staff: '106 מוקד',
                status: is_active ? 'open' : 'closed',
                owner: 'Israel Israeli',
                gender: is_male ? 'male' : 'female',
                is_main: is_main,
                role: 'שם של תפקיד',
            });
        }

        return contacts;
    },

    getContactsFromApi(params) {
        console.log(params)
        return axiosConfig.get('/contacts', { params })
            .then((response) => {
                console.log(response)
                const contacts = response.data.data.map((contact) => {
                    return this.mapContact(contact);
                })
                const totalRecords = response.data.meta.total;
                console.log(contacts)
                return { contacts, totalRecords };
            })
            .catch((error) => {
                console.log(error);
            });
    },

    getContactFromApi(id) {
        return axiosConfig.get('/contacts/' + id)
            .then((response) => {
                console.log(response)
                const contact = response.data.data;
                return this.mapContact(contact);
            })
            .catch((error) => {
                console.log(error);
            });
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
    getContact(id) {
        return Promise.resolve(this.getContactsData().find((contact) => contact.contact_id === id));
    },
    mapContact(contact) {
        return {
            id: contact.id,
            contact_id: contact.id,
            name: contact.name + ' ' + contact.surname,
            'firstName': contact.name,
            'lastName': contact.surname,
            contact: 'שלומי שבת',
            customer: 'שם של לקוח כלשהו',
            customer_id: '0000',
            telephone: contact.phone,
            landline: contact.land_line,
            email: contact.email,
            address: contact.street ? contact.street + ' ' + contact.street_number + ', ' + contact.city + ' ' + contact.zipcode : '',
            open_services: contact.open_services,
            breached_services: contact.breached_services,
            open_tasks: contact.open_tasks,
            breached_tasks: contact.breached_tasks,
            staff: '106 מוקד',
            status: 'open',
            owner: 'Israel Israeli',
            gender: true,//is_male ? 'male' : 'female',
            is_main: contact.is_main,
            role: contact.role?.value,
        }
    }


};
