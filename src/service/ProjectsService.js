import axiosConfig from '@/service/axiosConfig';

export const ProjectsService = {

    getProjectsData() {
        const projects = [];

        for (let i = 0; i < 1000; i++) {
            const is_active = Math.random() < 0.5;
            projects.push({
                project_id: i,
                project_number: '003-02-' + i,
                project_name: 'שכונת הבוכרים',
                city_data:  'גוש 1234, חלקה 456',
                address: "שמעון פרס 15, רחובות",
                project_type: 'בנייה ציבורית',
                project_area: 'בנייה ציבורית',
                project_detail: 'בנייה ציבורית',
                open_tasks: '12',
                breached_tasks: '0',
                stage: 'תכנון',
                status: 'פעיל',

            });
        }

        
        // const data = projects;
        return { data: projects, totalRecords: 1000 };
    },

    getServicesMini() {
        return Promise.resolve(this.getServicesData().slice(0, 5));
    },

    getServicesSmall() {
        return Promise.resolve(this.getServicesData().slice(0, 10));
    },

    getProjectList() {
        return Promise.resolve(this.getProjectsData());
    },

    getServicesWithOrdersSmall() {
        return Promise.resolve(this.getServicesWithOrdersData().slice(0, 10));
    },

    getServicesWithOrders() {
        return Promise.resolve(this.getServicesWithOrdersData());
    },
    getProjects(service_number) {
        return Promise.resolve(this.getProjectsData().find((service) => service.service_number === service_number));
    },

    getProjectsFromApi(params) {
        console.log(params)
        return axiosConfig.get('/projects')
            .then((response) => {
                console.log(response)
                const data = response.data.data.map((project) => {
                    return this.mapProject(project);
                })
                const totalRecords = response.data.meta.total;
                console.log(data, totalRecords)
                return { data, totalRecords };
            })
            .catch((error) => {
                console.log(error);
            });
    },

    getProjectFromApi(id) {

        return axiosConfig.get('/projects/' + id)
            .then((response) => {
                console.log(response)
                const project = response.data.data;
                return this.mapService(project);
            })
            .catch((error) => {
                console.log(error);
            });
    },
    createService(project) {
        return axiosConfig.post('/projects', project)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
    },

    updateService(id, project) {
        console.log(project)
        return axiosConfig.patch('/projects/' + id, project)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
    },

    parseProject(project) {
        console.log(project.direction.id)
        return {
            "contact_id": project.contact.id,
            "customer_id": project.customer.id,
            "urgent": project.priority.id,
            "direction": project.direction.id,
            "channel": project.channel.id,
            "priority": project.priority.id,
            "process_definition_id": 1,
            "description": project.description,
            "address" : "Address",
            "area_id" : project.area?.id,
            "type_id" : project.type?.id,
        }
    },

    mapService(project) {
        return {
            name: project.id,
            // service_number: service.id,
            // contact: service.contact.name,
            // contact_id: service.contact.id,
            // customer: service.customer.name,
            // customer_id: service.customer.id,
            // open_date: service.process.opened,
            // due_date: service.process.sla.due_date,
            // classification_1: service.area?.value,
            // classification_2: service.type?.value,
            // classification_3: service.request_1?.value,
            // classification_4: service.request_2?.value,
            // classification_5: service.request_3?.value,
            // duration: '',
            // owner: '',//'Israel Israeli',
            // staff: '', //'106 מוקד',
            // SLA: service.process.sla.sla ,
            // priority: '',
            // recurring: service.recurring == 0 ? 'no' : 'yes',
            // urgency: service.urgent.value,
            // last_change: '', // '11/11/22 10:23',
            // closed: service.process.closed ? service.process.closed : '--',
            // days_for_closing: service.process.sla.days_for_closing,
            // days_from_opening_date: service.process.sla.days_from_opening_date,
            // stages: service.process.stages,
            // current_stage: service.process.current_stage,
            // stage: service.process.current_stage?.name,
            // team: 'אגף רישוי ופיקוח (הנדסה)',
            // is_active: true, //is_active,
            // description: service.description,
            // location: {
            //     house_number: '12',
            //     apartment: '42',
            //     entrance: 'ב',
            //     street: 'שמעון פרס',
            //     city: 'כוכב יאיר',
            //     country: 'ישראל',
            //     zip: '1234567',
            // },
            // site: {
            //     name: 'מועצה דתית בית הכנסת',
            //     contact: 'שלומי שבת',
            //     contact_id: '795',
            //     contact_role: 'אחראי תברואה',
            //     phone: '054-1234567',
            //     email: 'mailmail@mailmail.com',
            //     type: 'ציבורי',
            // }
        }
    }
};

const slas = ['10 ימים', '2 ימים', '3 ימים', 'עמד ביעד', 'הסתיים בחריגה'];
