import { useCustomersStore } from "@/stores/customersStore";

export function useCustomers() {
  const customersStore = useCustomersStore();

  // ACTIONS
  const getCustomersFromApi = async (params) => {
    const response = await customersStore.getCustomersFromApi(params);

    const customers = response.data.map((customer) => {
      return mapCustomer(customer);
    });

    const totalRecords = response.meta.total;

    return { data: customers, totalRecords };
  };

  const getCustomerFromApi = async (id) => {
    const response = await customersStore.getCustomerFromApi(id);
    return mapCustomer(response.data);
  };

  const createCustomer = async (customer) => {
    return await customersStore.createCustomer(customer);
  };

  const updateCustomer = async (id, customer) => {
    return await customersStore.updateCustomer(id, customer);
  };

  const updateState = async (id, state) => {
    return await customersStore.updateState(id, state);
  };

  const existsCustomer = async (field, value) => {
    return await customersStore.existsCustomer(field, value);
  };

  const assignContactToCustomer = async (customerId, contact) => {
    return await customersStore.assignContactToCustomer(customerId, contact);
  };

  const unassignContactFromCustomer = async (customerId, contactId) => {
    return await customersStore.unassignContactFromCustomer(
      customerId,
      contactId
    );
  };

  // UTILITIES
  const mapCustomer = (customer) => {
    return {
      name: customer.name,
      type: customer.type,
      state: customer.state?.value,
      status: customer.status?.value,
      open_services: customer.open_services,
      breached_services: customer.breached_services,
      open_tasks: customer.open_tasks,
      breached_tasks: customer.breached_tasks,
      notes: customer.notes,
      rating: customer.rating ? customer.rating : "",
      number: customer.number,
      id: customer.id,
      owner: customer.owner,
      main_contact: customer.main_contact,
      service_areas: customer.service_areas,
      is_provider: customer.is_provider,
      fax: customer.fax,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      location: {
        city: customer.location?.city?.id,
        street: customer.location?.street?.id,
        house_number:
          customer.location?.house_number !== null
            ? parseInt(customer.location?.house_number)
            : null,
        apartment: customer.location?.apartment_number,
        entrance: customer.location?.house_entrance,
        zip: customer.location?.zip?.id,
      },
    };
  };

  const parseCustomer = (customer, contacts) => {
    return {
      name: customer.name,
      number: customer.number,
      project_manager_id: 1,
      project_manager_type: "employee",
      type: customer.type ? customer.type.id : "",
      rating: customer.rating ? customer.rating.id : "",
      is_provider: customer.is_provider ? true : false, // Optional pero si no lo pones peta
      // business: customer.business ? customer.business.id : '',
      service_area: customer.service_area
        ? customer.service_area.map((x) => x.id)
        : "",
      notes: customer.notes,
      contacts: contacts,
      fax: customer.fax,
      phone: customer.phone,
      email: customer.email,
      location: {
        city: customer["city"]?.id,
        street: customer["street"]?.id,
        house_number: parseInt(customer["house-number"]),
        apartment_number: customer["apartment"],
        house_entrance: customer.entrance?.value,
        zip: customer["zip"]?.id,
      },
    };
  };

  return {
    //ACTIONS
    getCustomersFromApi,
    getCustomerFromApi,
    createCustomer,
    updateCustomer,
    updateState,
    existsCustomer,
    assignContactToCustomer,
    unassignContactFromCustomer,

    //UTILITIES
    mapCustomer,
    parseCustomer,
  };
}
