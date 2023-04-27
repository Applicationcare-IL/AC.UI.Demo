export const CustomerService = {
    getCustomersData() {
        const customers = [];
        
        for (let i = 0; i < 1000; i++) {
            const is_active = Math.random() < 0.95;
            customers.push({
                telephone: '456897853',
                code: 'f230fh0g3',
                name: 'שם של לקוח כלשהו',
                type: 'עסקי',
                selected_product: 'אליהו הנביא',
                status: 'פעיל',
                address: 'דוד המלך 42, רחובות',
                open_processes: parseInt(Math.random() * 4),
                exception_processes: parseInt(Math.random() * 4),
                open_tasks: parseInt(Math.random() * 12),
                exception_tasks: parseInt(Math.random() * 12),
                rating: 'רגיל',
                domain: 'שם של תחום',
                id: '0000' + i,
                in_charge: 'Israel Israeli',
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
    }
};
