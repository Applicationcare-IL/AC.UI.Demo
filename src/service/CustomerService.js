import axiosConfig from "@/service/axiosConfig";
import { useOptionSetsStore } from "@/stores/optionSets";
const optionSetsStore = useOptionSetsStore();

export const CustomerService = {
  getCustomersData() {
    const customers = [];

    for (let i = 0; i < 100; i++) {
      const is_active = Math.random() < 0.95;
      customers.push({
        telephone: "45689" + String(i).padStart(4, "0"),
        code: "f230fh0g3",
        firstName: "שלומי",
        lastName: "שבת",
        name: "שם של לקוח כלשהו",
        type: "עסקי",
        selected_product: "אליהו הנביא",
        status: "פעיל",
        address: "דוד המלך 42, רחובות",
        open_services: parseInt(Math.random() * 4),
        breached_services: parseInt(Math.random() * 4),
        open_tasks: parseInt(Math.random() * 12),
        breached_tasks: parseInt(Math.random() * 12),
        classification1: ["שם של תחום", "שם של תחום"],
        rating: "רגיל",
        role: "שם של תפקיד",
        domain: "שם של תחום",
        number: "0000" + i,
        id: "0000" + i,
        owner: "Israel Israeli",
        contact_id: "795" + i,
        contact: "שלומי שבת",
      });
    }

    return customers;
  },

  getCustomersFromApi(params) {
    return axiosConfig
      .get("/customers", { params })
      .then((response) => {
        const data = response.data.data.map((customer) => {
          return this.mapCustomer(customer);
        });
        const totalRecords = response.data.meta.total;
        return { data, totalRecords };
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getCustomerFromApi(id) {
    return axiosConfig
      .get("/customers/" + id)
      .then((response) => {
        const customer = response.data.data;
        return this.mapCustomer(customer);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  //Add Field when the API is ready
  existsCustomer(field, value) {
    return axiosConfig
      .get("/customers?search=" + value)
      .then((response) => {
        return response.data.data.length > 0;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  assignContactToCustomer(customerId, contact) {
    const params = {
      contact_id: contact.id,
      customer_id: customerId,
      main: contact.main,
      role: contact.role,
    };
    return axiosConfig
      .post("/customers/contacts/", params)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  unassignContactFromCustomer(customerId, contactId) {
    const params = {
      contact_id: contactId,
      customer_id: customerId,
    };
    return axiosConfig
      .delete("/customers/contacts/", params)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
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
  },
  getCustomer(id) {
    return Promise.resolve(
      this.getCustomersData().find((customer) => customer.id === id)
    );
  },

  mapCustomer(customer) {
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
  },

  parseCustomer(customer, contacts) {
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
    };
  },

  createCustomer(customer) {
    return axiosConfig
      .post("/customers", customer)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  updateCustomer(id, customer) {
    console.log(customer);
    return axiosConfig
      .patch("/customers/" + id, customer)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  updateState(id, state) {
    const params = {
      state: optionSetsStore.getId("state", state),
    };
    return axiosConfig
      .patch("/customers/" + id, params)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },
};
