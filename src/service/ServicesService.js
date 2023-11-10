import axiosConfig from "@/service/axiosConfig";

export const ServicesService = {
  getServicesData() {
    const services = [];

    for (let i = 0; i < 100; i++) {
      const is_active = Math.random() < 0.5;
      services.push({
        service_number: "469879" + i,
        contact: "שלומי שבת",
        contact_id: "795" + i,
        customer: "מועצה דתית בית הכנסת",
        customer_id: "0000" + i,
        open_date: "11/11/22",
        due_date: "11/12/23",
        classification_1: "בטחון",
        classification_2: "בטחון",
        classification_3: "אדם חשוד",
        classification_4: "אדם חשוד",
        classification_5: "אדם חשוד",
        duration: "01:40:00",
        owner: "Israel Israeli",
        staff: "106 מוקד",
        SLA: is_active
          ? slas[parseInt(Math.random() * 3)]
          : slas[parseInt(Math.random() * 2 + 3)],
        priority: parseInt(Math.random() * 3 + 1),
        recurring: "לא",
        urgency: "לא דחוף",
        last_change: "11/11/22 10:23",
        closed: "--",
        stage: "שליחת נציג בטחון",
        team: "אגף רישוי ופיקוח (הנדסה)",
        is_active: is_active,
        location: {
          house_number: "12",
          apartment: "42",
          entrance: "ב",
          street: "שמעון פרס",
          city: "כוכב יאיר",
          country: "ישראל",
          zip: "1234567",
        },
        site: {
          name: "מועצה דתית בית הכנסת",
          contact: "שלומי שבת",
          contact_id: "795" + i,
          contact_role: "אחראי תברואה",
          phone: "054-1234567",
          email: "mailmail@mailmail.com",
          type: "ציבורי",
        },
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
  getService(service_number) {
    return Promise.resolve(
      this.getServicesData().find(
        (service) => service.service_number === service_number
      )
    );
  },

  getServicesFromApi(params) {
    console.log(params);
    return axiosConfig
      .get("/services", { params })
      .then((response) => {
        console.log(response);
        const data = response.data.data.map((service) => {
          return this.mapService(service);
        });
        const totalRecords = response.data.meta.total;
        console.log(data, totalRecords);
        return { data, totalRecords };
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getServiceFromApi(id) {
    return axiosConfig
      .get("/services/" + id)
      .then((response) => {
        console.log(response);
        const service = response.data.data;
        return this.mapService(service);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  createService(service) {
    return axiosConfig
      .post("/services", service)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  updateService(id, service) {
    console.log(service);
    return axiosConfig
      .patch("/services/" + id, service)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  parseService(service) {
    return {
      contact_id: 1, //service.contact.id,
      customer_id: 1, //service.customer.id,
      urgent: service.priority?.id,
      direction: service.direction?.id,
      channel: service.channel?.id,
      priority: service.priority?.id,
      process_definition_id: 3,
      description: service.description,
      area: service.service_area?.id,
      type: service.service_type?.id,
      request_1: service.request1?.id,
      request_2: service.request2?.id,
      request_3: service.request2?.id,
    };
  },

  parseUpdateService(service) {
    console.log(service);
    return {
      request_2: service.request1?.id,
      request_3: service.request2?.id,
    };
  },

  mapService(service) {
    return {
      id: service.id,
      name: service.id,
      service_number: service.id,
      contact: service.contact.name,
      contact_id: service.contact.id,
      customer: service.customer.name,
      customer_id: service.customer.id,
      open_date: service.process.opened,
      due_date: service.process.sla.due_date,
      area: service.area,
      type: service.type,
      request1: service.request_1,
      request2: service.request_2,
      request3: service.request_3,
      duration: "",
      owner: service.owner, //'Israel Israeli',
      staff: "", //'106 מוקד',
      SLA: service.process.sla.sla,
      priority: "",
      recurring: service.recurring == 0 ? "no" : "yes",
      urgency: service.urgent.value,
      last_change: "", // '11/11/22 10:23',
      closed: service.process.closed ? service.process.closed : "--",
      days_for_closing: service.process.sla.days_for_closing,
      days_from_opening_date: service.process.sla.days_from_opening_date,
      stages: service.process.stages,
      current_stage: service.process.current_stage,
      stage: service.process.current_stage?.name,
      team: "אגף רישוי ופיקוח (הנדסה)",
      is_active: true, //is_active,
      description: service.description,
      status: service.status?.value,
      location: {
        house_number: "12",
        apartment: "42",
        entrance: "ב",
        street: "שמעון פרס",
        city: "כוכב יאיר",
        country: "ישראל",
        zip: "1234567",
      },
      site: {
        name: "מועצה דתית בית הכנסת",
        contact: "שלומי שבת",
        contact_id: "795",
        contact_role: "אחראי תברואה",
        phone: "054-1234567",
        email: "mailmail@mailmail.com",
        type: "ציבורי",
      },
    };
  },
};

const slas = ["10 ימים", "2 ימים", "3 ימים", "עמד ביעד", "הסתיים בחריגה"];
