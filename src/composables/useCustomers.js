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

  const activateCustomer = async (id) => {
    return await customersStore.activateCustomer(id);
  };

  const deactivateCustomer = async (id) => {
    return await customersStore.deactivateCustomer(id);
  };

  const existsCustomer = async (field, value) => {
    return false;
    // TODO: implement this funcionality
    // return await customersStore.existsCustomer(field, value);
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

  const assignAssetToCustomer = async (customerId, asset) => {
    return await customersStore.assignAssetToCustomer(customerId, asset);
  };

  const unassignAssetFromCustomer = async (customerId, assetId) => {
    return await customersStore.unassignAssetFromCustomer(customerId, assetId);
  };

  // UTILITIES
  const mapCustomer = (customer) => {
    return {
      name: customer.name,
      title: customer.name,
      type: customer.type,
      state: customer.state,
      status: customer.status,
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
      asset_role: customer.asset_role,
      location: {
        city: customer.location?.city,
        street: customer.location?.street,
        house_number:
          customer.location?.house_number !== null
            ? parseInt(customer.location?.house_number)
            : null,
        apartment: customer.location?.apartment_number,
        entrance: customer.location?.house_entrance,
        zip: customer.location?.zip?.id,
        neighborhood: customer.location?.neighborhood,
      },
      last_activity: customer.last_activity,
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
        neighborhood: customer["neighborhood"]?.id,
      },
    };
  };

  return {
    //ACTIONS
    getCustomersFromApi,
    getCustomerFromApi,
    createCustomer,
    updateCustomer,
    activateCustomer,
    deactivateCustomer,
    existsCustomer,
    assignContactToCustomer,
    unassignContactFromCustomer,
    assignAssetToCustomer,
    unassignAssetFromCustomer,

    //UTILITIES
    mapCustomer,
    parseCustomer,
  };
}
