import { useServicesStore } from "@/stores/servicesStore";

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

  const getServicesSLADistribution = async (params) => {
    const response = await servicesStore.getSLADistribution(params);
    return response.data;
  };

  const getServicesTrendingAreas = async (params) => {
    const response = await servicesStore.getTrendingAreas(params);
    return response.data.map(mapTrendingAreas);
  };

  const exportServices = async (params) => {
    return await servicesStore.exportServices(params);
  };

  const getServicesSLATableData = async (params) => {
    const response = await servicesStore.getSLATableData(params);
    return response.data;
  };

  const linkServices = async (relatedServicesIds, relationshipId) => {
    console.log({
      service_ids: relatedServicesIds,
      relationship_id: relationshipId,
    });

    return await servicesStore.linkServices({
      service_ids: relatedServicesIds,
      relationship_id: relationshipId,
    });
  };

  // UTILITIES
  const parseService = (service) => {
    return {
      contact_id: service.contact.id,
      customer_id: service.customer.id,
      asset_id: service.asset_id,
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
        zip: service["zip"]?.id,
        neighborhood: service["neighborhood"]?.id,
      },
    };
  };

  const parseMobileService = (service) => {
    return {
      contact_id: service.contact.id,
      customer_id: service.customer.id,
      urgent: service.priority,
      direction: service.direction,
      channel: service.channel,
      priority: service.priority,
      description: service.description,
      area: service.area,
      type: service.subarea,
      request_1: service.request1,
      request_2: service.request2,
      request_3: service.request3,
      location: {
        site: service["site-name"]?.id,
        site_type: service["site-type"],
        site_contact_relationship_role: service["site-contact-role"]?.id,
        site_contact: service["site-contact-id"]?.id,
      },
    };
  };

  const parseUpdateService = (service) => {
    return {
      request_2: service.request2?.id,
      request_3: service.request3?.id,
    };
  };

  const mapService = (service) => {
    return {
      id: service.id,
      title: service.id,
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
      urgency: service.urgent,
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
      status: service.status,
      state: service.state,
      location: {
        house_number: service.location?.house_number,
        appartment: service.location?.apartment,
        entrance: service.location?.entrance,
        street: service.location?.street,
        city: service.location?.city,
        country: service.location?.country,
        zip: service.location?.zip?.id,
        neighborhood: service.location?.neighborhood,
      },
      site: {
        name: service.location?.site,
        contact: service.location?.site_contact,
        contact_id: service.location?.site_contact,
        contact_role: service.location?.site_contact_relationship_role,
        phone: service.location?.site_contact_phone,
        email: service.location?.site_contact_email,
        type: service.location?.site_type?.value || "",
      },
      last_activity: service.last_activity,
      asset: service.asset,
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

  const mapTrendingAreas = (trendingArea) => {
    return {
      ...trendingArea,
      value: trendingArea.area_value,
    };
  };

  return {
    // API
    getServicesFromApi,
    getServiceFromApi,
    createService,
    updateService,
    cancelService,
    getQuickCodes: servicesStore.getQuickCodes,
    getServicesSLADistribution,
    getServicesTrendingAreas,
    exportServices,
    getServicesSLATableData,
    linkServices,
    // UTILITIES
    parseService,
    parseMobileService,
    parseUpdateService,
    mapService,
    mapContactsFromServices,
  };
}
