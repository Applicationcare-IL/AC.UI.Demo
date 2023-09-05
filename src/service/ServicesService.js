import axiosConfig from '@/service/axiosConfig';

export const ServicesService = {
    getServicesData() {
        const services = []; 
        
        for (let i = 0; i < 100; i++) {
            const is_active = Math.random() < 0.5;
            services.push({
                service_number: '469879'+ i,
                contact: 'שלומי שבת',
                contact_id: '795'+ i,
                customer: 'מועצה דתית בית הכנסת',
                customer_id: '0000' + i,
                open_date: '11/11/22',
                due_date: '11/12/23',
                classification_1: 'בטחון',
                classification_2: 'בטחון',
                classification_3: 'אדם חשוד',
                classification_4: 'אדם חשוד',
                classification_5: 'אדם חשוד',
                duration: '01:40:00',
                owner: 'Israel Israeli',
                staff: '106 מוקד',
                SLA: is_active ? slas[parseInt(Math.random() * 3)] : slas[parseInt(Math.random() * 2 + 3)],
                priority: parseInt(Math.random() * 3 +1)  ,
                recurring: 'לא',
                urgency: 'לא דחוף',
                last_change: '11/11/22 10:23',
                closed: '--',
                stage: 'שליחת נציג בטחון',
                team: 'אגף רישוי ופיקוח (הנדסה)',
                is_active: is_active,
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
    },
    getService(service_number){
        return Promise.resolve(this.getServicesData().find((service) => service.service_number === service_number));
    },

    getServicesFromApi(params) {
        console.log(params)
        return axiosConfig.get('/services', { params })
            .then((response) => {
                console.log(response)
                const services = response.data.data.map((service) => {
                    return this.mapService(service);
                })
                const totalRecords = response.data.meta.total;
                console.log(services)
                return { services, totalRecords };
            })
            .catch((error) => {
                console.log(error);
            });
    },

    getServiceFromApi(id) {

        return axiosConfig.get('/services/' + id)
            .then((response) => {
                console.log(response)
                const service = response.data.data;
                return this.mapService(service);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    mapService(service){
        return {
            service_number: service.id,
            contact: 'שלומי שבת',
            contact_id: '795',
            customer: 'מועצה דתית בית הכנסת',
            customer_id: '0000' ,
            open_date: '11/11/22',
            due_date: '11/12/23',
            classification_1: 'בטחון',
            classification_2: 'בטחון',
            classification_3: 'אדם חשוד',
            classification_4: 'אדם חשוד',
            classification_5: 'אדם חשוד',
            duration: '01:40:00',
            owner: 'Israel Israeli',
            staff: '106 מוקד',
            SLA: true,//is_active ? slas[parseInt(Math.random() * 3)] : slas[parseInt(Math.random() * 2 + 3)],
            priority: parseInt(Math.random() * 3 +1)  ,
            recurring: 'לא',
            urgency: 'לא דחוף',
            last_change: '11/11/22 10:23',
            closed: '--',
            stage: 'שליחת נציג בטחון',
            team: 'אגף רישוי ופיקוח (הנדסה)',
            is_active: true, //is_active,
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
                contact_id: '795',
                contact_role: 'אחראי תברואה',
                phone: '054-1234567',
                email: 'mailmail@mailmail.com',
                type: 'ציבורי',
            }
        }
    }
};

const slas = ['10 ימים', '2 ימים', '3 ימים', 'עמד ביעד', 'הסתיים בחריגה'];
