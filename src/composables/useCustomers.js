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
    console.log(customers);
    return { data: customers, totalRecords };
  };

  const getCustomerFromApi = async (id) => {
    const response = await customersStore.getCustomerFromApi(id);
    return mapCustomer(response.data);
  };

  const createCustomer = async (customer) => {
    return await customersStore.createCustomer(customer);
  };

  const updateCustomer = async (customer) => {
    return await customersStore.updateCustomer(customer);
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
      telephone: customer.phone,
      name: customer.name,
      type: customer.type,
      state: customer.state?.value,
      status: customer.status?.value,
      address: customer.street
        ? customer.street +
          " " +
          customer.street_number +
          ", " +
          customer.city +
          " " +
          customer.zipcode
        : "",
      street: customer.street,
      street_number: customer.street_number,
      city: customer.city ? customer.city : "",
      zipcode: customer.zipcode,
      open_services: customer.open_services,
      breached_services: customer.breached_services,
      open_tasks: customer.open_tasks,
      breached_tasks: customer.breached_tasks,
      // classification1: ["שם של תחום", "שם של תחום"],
      rating: customer.rating ? customer.rating : "",
      number: customer.number,
      id: customer.id,
      owner: customer.owner,
      main_contact: customer.main_contact,
      service_areas: customer.service_areas,
      is_provider: customer.is_provider,
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
      is_provider: customer.is_provider.value, //Optional pero si no lo pones peta
      // business: customer.business ? customer.business.id : '',
      service_area: customer.service_area
        ? customer.service_area.map((x) => x.id)
        : "",
      //   street: customer.street.name,
      //   street_number: customer.street_number,
      //   city: customer.city.name,
      //   zipcode: customer.zipcode,
      // "file_folder_link": "et",
      // "account_number": "exercitationem",
      // "registration_area": "voluptatem",
      // "subscription": "possimus",
      // "water_meter": "in"
      // Missing: entrance, house_number, apartment
      notes: customer.notes,
      contacts: contacts,
      location: {
        city: customer["city"]?.id,
        street: customer["street"]?.id,
        house_number: parseInt(customer["house-number"]),
        apartment: customer["apartment"],
        entrance: customer["entrance"]?.value,
        zip: customer["zip"],
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
