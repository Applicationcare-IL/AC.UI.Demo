export const CustomerService = {
    getCustomersData() {
        const customers = [];
        
        for (let i = 0; i < 1000; i++) {
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
            });
        }

        return customers;
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
    getCustomer(id){
        return Promise.resolve(this.getCustomersData().find((customer) => customer.id === id));
    }
};
