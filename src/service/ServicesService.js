export const ServicesService = {
    getServicesData() {
        const services = []; 
        
        for (let i = 0; i < 100; i++) {
            const is_active = Math.random() < 0.5;
            services.push({
                service_number: '469879'+ i,
                contact: 'שלומי שבת',
                open_date: '11/11/22',
                due_date: '11/12/23',
                classification_1: 'בטחון',
                classification_2: 'בטחון',
                classification_3: 'אדם חשוד',
                duration: '01:40:00',
                in_charge: 'Israel Israeli',
                staff: '106 מוקד',
                SLA: is_active ? slas[parseInt(Math.random() * 3)] : slas[parseInt(Math.random() * 2 + 3)],
                priority: parseInt(Math.random() * 3 +1)  ,
                recurrent: 'לא',
                urgent: 'לא דחוף',
                last_change: '11/11/22 10:23',
                closed: '--',
                stage: 'שליחת נציג בטחון',
                team: 'מוקד 106',
                is_active: is_active,
            });
        }

        return services;
    },

    getServicesMini() {
        return Promise.resolve(this.getServicesData().slice(0, 5));
    },

    getServicesSmall() {
        return Promise.resolve(this.getServicesData().slice(0, 10));
    },

    getServices() {
        return Promise.resolve(this.getServicesData());
    },

    getServicesWithOrdersSmall() {
        return Promise.resolve(this.getServicesWithOrdersData().slice(0, 10));
    },

    getServicesWithOrders() {
        return Promise.resolve(this.getServicesWithOrdersData());
    }
    
    
};

const slas = ['10 ימים', '2 ימים', '3 ימים', 'עמד ביעד', 'הסתיים בחריגה'];
