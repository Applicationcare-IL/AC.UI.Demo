import axiosConfig from '@/service/axiosConfig';

export const CustomerService = {
    getCustomersData() {
        const customers = [];

        for (let i = 0; i < 100; i++) {
            const is_active = Math.random() < 0.95;
            customers.push({
                telephone: '45689' + String(i).padStart(4, '0'),
                code: 'f230fh0g3',
                'firstName': 'שלומי',
                'lastName': 'שבת',
                name: 'שם של לקוח כלשהו',
                type: 'עסקי',
                selected_product: 'אליהו הנביא',
                status: 'פעיל',
                address: 'דוד המלך 42, רחובות',
                open_services: parseInt(Math.random() * 4),
                breached_services: parseInt(Math.random() * 4),
                open_tasks: parseInt(Math.random() * 12),
                breached_tasks: parseInt(Math.random() * 12),
                classification1: ["שם של תחום", "שם של תחום"],
                rating: 'רגיל',
                role: 'שם של תפקיד',
                domain: 'שם של תחום',
                number: '0000' + i,
                id: '0000' + i,
                owner: 'Israel Israeli',
                contact_id: '795' + i,
                contact: 'שלומי שבת',
            });
        }

        return customers;
    },

    getCustomersFromApi(params) {
        return axiosConfig.get('/customers', { params })
            .then((response) => {
                const data = response.data.data.map((customer) => {
                    return this.mapCustomer(customer);
                })
                const totalRecords = response.data.meta.total;
                return { data, totalRecords };
            })
            .catch((error) => {
                console.log(error);
            });
    },

    getCustomerFromApi(id) {
        return axiosConfig.get('/customers/' + id)
            .then((response) => {
                console.log(response)
                const customer = response.data.data;
                return this.mapCustomer(customer);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    getCustomersMini() {
        return Promise.resolve(this.getCustomersData().slice(0, 5));
    },

    getCustomersSmall() {
        return Promise.resolve(this.getCustomersData().slice(0, 10));
    },

    getCustomers() {
        return Promise.resolve(this.getCustomersData());
    },

    getCustomersWithOrdersSmall() {
        return Promise.resolve(this.getCustomersWithOrdersData().slice(0, 10));
    },

    getCustomersWithOrders() {
        return Promise.resolve(this.getCustomersWithOrdersData());
    },
    getCustomer(id) {
        return Promise.resolve(this.getCustomersData().find((customer) => customer.id === id));
    },

    mapCustomer(customer) {
        return {
            telephone: customer.phone,
            name: customer.name,
            type: customer.type.value,
            status: customer.status.value,
            address: customer.street ? customer.street + ' ' + customer.street_number + ', ' + customer.city + ' ' + customer.zipcode : '',
            street: customer.street,
            street_number: customer.street_number,
            city: customer.city,
            zipcode: customer.zipcode,
            open_services: parseInt(Math.random() * 4),
            breached_services: parseInt(Math.random() * 4),
            open_tasks: parseInt(Math.random() * 12),
            breached_tasks: parseInt(Math.random() * 12),
            classification1: ["שם של תחום", "שם של תחום"],
            rating: customer.rating ? customer.rating.value : '',
            number: customer.number,
            id: customer.id,
            owner: 'Israel Israeli',
            contact_id: '795',
            contact: 'שלומי שבת',
            area: customer.business ? customer.business.value : '',
        }
    },

    parseCustomer(form) {
        console.log(form)
        return {
            name: form.name,
            number: form.number,
            project_manager_id: 1,
            project_manager_type: 'employee',
            type: form.type.id,
            rating: form.rating.id,
            is_provider: form.is_provider.value, //Optional pero si no lo pones peta
            // business: form.business.id,
            service_area: form.service_area.map(x=>x.id),
            street: form.street.name,
            street_number: form.street_number,
            city: form.city.name,
            zipcode: form.zipcode,
            // "file_folder_link": "et",
            // "account_number": "exercitationem",
            // "registration_area": "voluptatem",
            // "subscription": "possimus",
            // "water_meter": "in"
            // Missing: entrance, house_number, apartment
        }
    },

    createCustomer(customer) {
        return axiosConfig.post('/customers', customer)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    },
};






