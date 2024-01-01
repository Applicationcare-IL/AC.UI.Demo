import { useServicesStore } from "@/stores/servicesStore";
import { SLAS } from "@/constants";

export function useServices() {
  const servicesStore = useServicesStore();
  const toast = useToast();

  // ACTIONS
  const getServicesFromApi = async (params) => {
    const response = await servicesStore.getServicesFromApi(params);

    if (!response) {
      toast.error("Error getting services from API");
      return { data: [], totalRecords: 0 };
    }

    const services = response.data.map((service) => {
      return mapService(service);
    });

    const totalRecords = response.meta.total;

    return { data: services, totalRecords };
  };

  const getServiceFromApi = async (id) => {
    const response = await servicesStore.getServiceFromApi(id);
    return mapService(response.data);
  };

  const createService = async (service) => {
    return await servicesStore.createService(service);
  };

  const updateService = async (id, service) => {
    return await servicesStore.updateService(id, service);
  };

  const cancelService = async (id, reasons) => {
    return await servicesStore.cancelService(id, reasons);
  };

  // UTILITIES
  const parseService = (service) => {
    console.log("parseService", service);

    return {
      contact_id: service.contact.id,
      customer_id: service.customer.id,
      urgent: service.priority?.id,
      direction: service.direction?.id,
      channel: service.channel?.id,
      priority: service.priority?.id,
      process_definition_id: 3,
      description: service.description,
      area: service.area?.id,
      type: service.type?.id,
      request_1: service.request1?.id,
      request_2: service.request2?.id,
      request_3: service.request3?.id,
      location: {
        site: service["site-name"]?.id,
        site_type: service["site-type"]?.id,
        site_contact_relationship_role: service["site-contact-role"]?.id,
        site_contact: service["site-contact-id"]?.id,
        city: service["city"]?.id,
        street: service["street"]?.id,
        house_number: parseInt(service["house-number"]),
        apartment: service["apartment"],
        entrance: service["entrance"]?.value,
        zip: service["zip"],
      },
    };
  };

  const parseUpdateService = (service) => {
    return {
      request_2: service.request1?.id,
      request_3: service.request2?.id,
    };
  };

  const mapService = (service) => {
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
      duration: service.process.sla.days_from_opening_date,
      owner: service.owner,
      staff: "",
      sla: service.process.sla.sla,
      priority: "1",
      recurring: service.recurring == 0 ? "no" : "yes",
      urgency: service.urgent.value,
      last_change: service.last_activity?.updater.at,
      closed: service.process.closed ? service.process.closed : "--",
      days_for_closing: service.process.sla.days_for_closing,
      days_from_opening_date: service.process.sla.days_from_opening_date,
      stages: service.process.stages,
      current_stage: service.process.current_stage,
      stage: service.process.current_stage?.name,
      team: service.owner.default_team,
      is_active: service.state?.value == "active" ? true : false,
      description: service.description,
      status: service.status?.value,
      state: service.state?.value,
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
  };

  /**
   * This function maps contacts from services array (or single service) to array of unique contacts
   * @param {*} services
   * @returns array of mapped unique contacts or single mapped contact
   */
  const mapContactsFromServices = (services) => {
    let contacts = [];

    if (Array.isArray(services)) {
      contacts = services.map((service) => {
        return {
          id: service.contact_id,
          contact_id: service.contact_id,
          name: service.contact,
        };
      });
    } else {
      return {
        id: services.contact_id,
        contact_id: services.contact_id,
        name: services.contact,
      };
    }

    const uniqueContacts = contacts.filter(
      (contact, index, self) =>
        index === self.findIndex((t) => t.id === contact.id)
    );

    return uniqueContacts;
  };

  // MOCKED DATA
  const getServicesData = () => {
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
          ? SLAS[parseInt(Math.random() * 3)]
          : SLAS[parseInt(Math.random() * 2 + 3)],
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
  };

  const getServicesMini = () => {
    return Promise.resolve(getServicesData().slice(0, 5));
  };

  const getServicesSmall = () => {
    return Promise.resolve(getServicesData().slice(0, 10));
  };

  const getServices = () => {
    return Promise.resolve(getServicesData());
  };

  const getServicesWithOrdersSmall = () => {
    return Promise.resolve(getServicesWithOrdersData().slice(0, 10));
  };

  const getServicesWithOrders = () => {
    return Promise.resolve(getServicesWithOrdersData());
  };

  const getService = (service_number) => {
    return Promise.resolve(
      getServicesData().find(
        (service) => service.service_number === service_number
      )
    );
  };

  return {
    // API
    getServicesFromApi,
    getServiceFromApi,
    createService,
    updateService,
    cancelService,
    // UTILITIES
    parseService,
    parseUpdateService,
    mapService,
    mapContactsFromServices,
    // MOCKED DATA
    getService,
    getServices,
    getServicesMini,
    getServicesSmall,
    getServicesWithOrders,
    getServicesWithOrdersSmall,
  };
}
