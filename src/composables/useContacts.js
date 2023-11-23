import { useContactsStore } from "@/stores/contactsStore";

export function useContacts() {
  const contactsStore = useContactsStore();

  // ACTIONS
  const getContactsFromApi = async (params) => {
    const response = await contactsStore.getContactsFromApi(params);

    const contacts = response.data.map((contact) => {
      return mapContact(contact);
    });

    const totalRecords = response.meta.total;
    console.log(contacts);
    return { data: contacts, totalRecords };
  };

  const getContactFromApi = async (id) => {
    const response = await contactsStore.getContactFromApi(id);
    return mapContact(response.data);
  };

  const createContact = async (contact) => {
    return await contactsStore.createContact(contact);
  };

  const updateContact = async (id, contact) => {
    return await contactsStore.updateContact(id, contact);
  };

  const updateState = async (id, state) => {
    return await contactsStore.updateState(id, state);
  };
  // UTILITIES
  const mapContact = (contact) => {
    console.log(contact);
    return {
      id: contact.id,
      contact_id: contact.id,
      name: contact.name + " " + contact.surname,
      firstName: contact.name,
      lastName: contact.surname,
      telephone: contact.phone,
      landline: contact.land_line,
      fax: contact.fax,
      email: contact.email,
      address: contact.street
        ? contact.street +
          " " +
          contact.street_number +
          ", " +
          contact.city +
          " " +
          contact.zipcode
        : "",
      open_services: contact.open_services,
      breached_services: contact.breached_services,
      open_tasks: contact.open_tasks,
      breached_tasks: contact.breached_tasks,
      status: contact.status?.value,
      state: contact.state?.value,
      owner: contact.owner,
      gender: contact.gender, //is_male ? 'male' : 'female',
      is_main: contact.main_contact_for,
      role: contact.role,
      notes: contact.notes,
      "contact-number": contact.contact_number,
      created_by: contact.last_activity?.creator?.name,
      created_at: contact.last_activity?.creator?.at,
      updated_by: contact.last_activity?.updater?.name,
      updated_at: contact.last_activity?.updater?.at,
    };
  };

  const parseContact = (contact) => {
    console.log(contact);
    return {
      name: contact["first-name"],
      surname: contact["last-name"],
      phone: contact["mobile-phone"],
      fax: contact["fax"],
      email: contact["email"],
      gender: contact["gender"].id,
      customers: contact["customer"]
        ? contact["customer"].map((x) => x.id)
        : "",
      street: contact["street"],
      street_number: contact["house-number"],
      city: contact["city"],
      zipcode: contact["zipcode"],
      fax: contact["fax"],
      land_line: contact["landline"],
      notes: contact["notes"],
      contact_number: contact["contact-number"],
    };
  };

  // MOCKED DATA
  const getContactsData = () => {
    const contacts = [];

    for (let i = 0; i < 100; i++) {
      const is_active = Math.random() < 0.95;
      const is_male = Math.random() < 0.5;
      const is_main = Math.random() < 0.2;
      contacts.push({
        id: "000" + i,
        contact_id: "795" + i,
        name: "שלומי שבת",
        firstName: "שלומי",
        lastName: "שבת",
        contact: "שלומי שבת",
        customer: "שם של לקוח כלשהו",
        customer_id: "0000" + i,
        telephone: "050-1234567",
        landline: "050-1234567",
        email: "mailmail@mail.com",
        address: "שמעון פרס 15, רחובות",
        open_services: parseInt(Math.random() * 4),
        exception_services: parseInt(Math.random() * 8),
        open_tasks: parseInt(Math.random() * 8),
        exception_tasks: parseInt(Math.random() * 3),
        staff: "106 מוקד",
        status: is_active ? "open" : "closed",
        owner: "Israel Israeli",
        gender: is_male ? "male" : "female",
        is_main: is_main,
        role: "שם של תפקיד",
      });
    }

    return contacts;
  };

  const getContactsMini = () => {
    return Promise.resolve(this.getContactsData().slice(0, 5));
  };

  const getContactsSmall = () => {
    return Promise.resolve(this.getContactsData().slice(0, 10));
  };

  const getContacts = () => {
    return Promise.resolve(this.getContactsData());
  };

  const getContactsWithOrdersSmall = () => {
    return Promise.resolve(this.getContactsWithOrdersData().slice(0, 10));
  };

  const getContactsWithOrders = () => {
    return Promise.resolve(this.getContactsWithOrdersData());
  };
  const getContact = (id) => {
    return Promise.resolve(
      this.getContactsData().find((contact) => contact.contact_id === id)
    );
  };

  return {
    // ACTIONS
    getContactsFromApi,
    getContactFromApi,
    createContact,
    updateContact,
    updateState,

    // UTILITIES
    mapContact,
    parseContact,

    // MOCKED DATA
    getContactsData,
    getContactsMini,
    getContactsSmall,
    getContacts,
    getContactsWithOrdersSmall,
    getContactsWithOrders,
    getContact,
  };
}
