import { useProjectsStore } from "@/stores/projectsStore";

export function useProjects() {
  const projectsStore = useProjectsStore();

  // ACTIONS
  const getProjectsFromApi = async (params) => {
    const response = await projectsStore.getProjectsFromApi(params);

    const projects = response.data.map((project) => {
      return mapProject(project);
    });

    const totalRecords = response.meta.total;

    return { projects, totalRecords };
  };

  const getProjectFromApi = async (id) => {
    const response = await projectsStore.getProjectFromApi(id);

    return mapProject(response.data);
  };

  const createProject = async (project) => {
    return await projectsStore.createProject(project);
  };

  const updateProject = async (id, project) => {
    return await projectsStore.updateProject(id, project);
  };

  const updateProjectConfig = async (id, config) => {
    return await projectsStore.updateProjectConfig(id, config);
  };

  const assignContactToProject = async (projectId, contact) => {
    return await projectsStore.assignContactToProject(projectId, contact);
  };

  const unassignContactFromProject = async (projectId, contactId) => {
    return await projectsStore.unassignContactFromProject(projectId, contactId);
  };

  const addServiceArea = async (projectId, serviceArea) => {
    return await projectsStore.addServiceArea(projectId, serviceArea);
  };

  const removeServiceArea = async (projectId, serviceArea) => {
    return await projectsStore.removeServiceArea(projectId, serviceArea);
  };

  const getProjectCustomers = async (projectId, params) => {
    return await projectsStore.getProjectCustomers(projectId, params);
  };

  const createProjectCustomer = async (projectId, data) => {
    return await projectsStore.createProjectCustomer(projectId, data);
  };

  const updateProjectCustomer = async (projectId, data) => {
    return await projectsStore.updateProjectCustomer(projectId, data);
  };

  const deleteProjectCustomer = async (
    projectId,
    customerId,
    serviceAreaId
  ) => {
    const data = {
      customer: customerId,
      service_area: serviceAreaId,
    };

    return await projectsStore.deleteProjectCustomer(projectId, data);
  };

  // BUDGETS
  const getProjectBudget = async (projectId) => {
    const response = await projectsStore.getProjectBudget(projectId);

    return response.data;
  };

  const updateBudget = async (projectId, data) => {
    return await projectsStore.updateBudget(projectId, data);
  };

  const getBudgetItems = async (projectId, params) => {
    const response = await projectsStore.getBudgetItems(projectId, params);

    const budgetItems = response.data.map((budgetItem) => {
      return mapBudgetItem(budgetItem);
    });

    const totalRecords = response.meta.total;

    return { budgetItems, totalRecords };
  };

  const getBudgetItem = async (projectId, budgetItemId) => {
    const response = await projectsStore.getBudgetItem(projectId, budgetItemId);

    return mapBudgetItem(response.data);
  };

  const createBudgetItem = async (projectId, data) => {
    return await projectsStore.createBudgetItem(projectId, data);
  };

  const updateBudgetItem = async (projectId, budgetItemId, data) => {
    return await projectsStore.updateBudgetItem(projectId, budgetItemId, data);
  };

  // PAYMENTS
  const getProjectPayments = async (projectId, params) => {
    const response = await projectsStore.getProjectPayments(projectId, params);

    const payments = response.data;
    const totalRecords = response.meta.total;

    return { payments, totalRecords };
  };

  // UTILITIES
  const parseProject = (project) => {
    return {
      name: project["project-name"],
      description: project["project-description"],
      project_type: project.project_type?.id,
      project_area: project.project_area?.id,
      project_detail: project.project_detail?.id,
      customer_id: "",
      contacts: project.team_members.map((teamMember) => {
        return {
          id: teamMember.id,
          role: teamMember.role_project,
        };
      }),
      location: {
        city: project.city?.id,
        street: project.street?.id,
        house_number: project["house-number"],
        block: project.block,
        parcel: project.parcel,
        sub_parcel: project["sub-parcel"],
      },
    };
  };

  const parseUpdateProject = (project) => {
    return {
      name: project["project-name"],
      project_type: project.project_type?.id,
      project_area: project.project_area?.id,
      project_detail: project.project_detail?.id,
      description: project["project-description"],
      location: {
        city: project.city?.id,
        street: project.street?.id,
        house_number: project["house-number"],
        block: project.block,
        parcel: project.parcel,
        sub_parcel: project["sub-parcel"],
      },
      tbr_number: project["tbr-number"],
      request_number: project["request-number"],
      network_folder: project["network-folder"],
    };
  };

  const parseBudget = (budget) => {
    return {
      tbr_number: budget.tbr_number,
    };
  };

  const parseUpdateBudgetItem = (budgetItem) => {
    return {
      name: budgetItem["budget-item-name"],
      description: budgetItem.description,
      estimate: budgetItem.estimate,
      planned_contract: budgetItem.planned_contract,
      executed_payments: budgetItem["executed-payments"],
      planned_non_contract: budgetItem.planned_non_contract,
      approved_ministry: budgetItem.approved_ministry,
      approved_council: budgetItem.approved_council,
      unexpected: budgetItem.unexpected,
      management_fee: budgetItem.management_fee,
      total: budgetItem.total,
      balance: budgetItem.balance,
    };
  };

  const getISODate = (fromDate) => {
    let date = new Date(fromDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let ISOdate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return ISOdate;
  };

  const parseUpdateProjectConfig = (project) => {
    return {
      tender: project["contractor-option"]?.value === "tender" ? true : false,
      site_tour: project["site-tour-needed"]?.value === "yes" ? true : false,
      site_tour_date: getISODate(project["site-tour-date"]),
      quality_commitee:
        project["quality-committee-required"]?.value === "yes" ? true : false,
    };
  };

  const parseDate = (date) => {
    // return today date in format YYYY-MM-DD
    if (!date) {
      return new Date().toISOString().split("T")[0];
    }

    if (typeof date === "object") {
      return formatDate(date);
    }

    return date;
  };

  // return date in format YYYY-MM-DD
  function formatDate(date) {
    const newDate = new Date(date);

    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Note: months are 0-based
    const day = newDate.getDate();

    const dateISO = `
    ${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}
    `;

    return dateISO;
  }

  const parseProjectCustomer = (customer, serviceAreaId) => {
    let result = {
      customer: customer.customer_id,
      service_area: serviceAreaId,
      offer_refusal_to_win: customer.offer_refusal_to_win ? true : false,
      offer_second: customer.offer_second ? true : false,
      customer_project_status: customer.customer_project_status.id,
      offer_amount: customer.offer_amount ? customer.offer_amount : 0,
      offer_received_at: parseDate(customer.offer_received_at),
      offer_requested_at: parseDate(customer.offer_requested_at),
    };

    return result;
  };

  const mapProject = (project) => {
    return {
      id: project.id,
      title: project.name,
      name: project.name,
      project_id: project.id,
      project_number: project.number,
      project_name: project.name,
      project_description: project.description,
      city_data: project.location?.city?.value,
      address: project.location?.street?.value,
      project_type: project.project_type,
      project_area: project.project_area,
      project_detail: project.project_detail,
      open_tasks: 0, //project.open_tasks,
      breached_tasks: 0, //project.breached_tasks,
      stage: project.process?.current_stage?.name,
      status: project.status,
      state: project.state,
      process: project.process,
      location: project.location,
      contacts: project.contacts,
      subprojects: mapSubprojects(project.subprojects),
      service_areas: project.service_areas,
      owner: project.owner.name,
      team: project.owner.default_team,
      tbr_number: project.tbr_number,
      request_number: project.request_number,
      architect: project.architect,
      supervisor: project.supervisor,
      contractor: project.contractor,
      last_activity: project.last_activity,
      network_folder: project.network_folder,
      budget: project.budget,
      config: {
        tender: project.tender,
        site_tour: project.site_tour,
        site_tour_date: project.site_tour_date,
        quality_commitee: project.quality_commitee,
      },
    };
  };

  const mapSubprojects = (subprojects) => {
    if (!subprojects || subprojects.length === 0) {
      return [];
    }

    return subprojects.map(mapProject);
  };

  const mapBudgetItem = (budgetItem) => {
    return {
      title: budgetItem.name,
      ...budgetItem,
    };
  };

  /**
   * This function maps contacts from projects array (or single project) to array of unique contacts
   * @param {*} projects
   * @returns array of mapped unique contacts or single mapped contact
   */
  const mapContactsFromProjects = (projects) => {
    let contacts = [];

    if (Array.isArray(projects.contacts)) {
      contacts = projects.contacts.map((project) => {
        return {
          id: project.id,
          contact_id: project.id,
          name: project.name,
        };
      });
    } else {
      return {
        id: projects.contacts[0].id,
        contact_id: projects.contacts[0].id,
        name: projects.contacts[0].name,
      };
    }

    const uniqueContacts = contacts.filter(
      (contact, index, self) =>
        index === self.findIndex((t) => t.id === contact.id)
    );

    return uniqueContacts;
  };

  const mapProjectCustomer = (customer) => {
    return {
      id: customer.id,
      customer_name: customer.customer.name,
      customer_id: customer.customer.id,
      notes: customer.notes,
      offer_amount: customer.offer_amount,
      offer_second: customer.offer_second,
      offer_winner: customer.offer_winner,
      offer_received_at: customer.offer_received_at,
      offer_requested_at: customer.offer_requested_at,
      offer_refusal_to_win: customer.offer_refusal_to_win,
      customer_project_status: customer.customer_project_status,
    };
  };

  return {
    // ACTIONS
    getProjectsFromApi,
    createProject,
    getProjectFromApi,
    updateProject,
    updateProjectConfig,
    assignContactToProject,
    unassignContactFromProject,
    addServiceArea,
    removeServiceArea,
    getProjectCustomers,
    createProjectCustomer,
    updateProjectCustomer,
    deleteProjectCustomer,
    getProjectBudget,
    getBudgetItems,
    getBudgetItem,
    updateBudgetItem,
    getProjectPayments,
    createBudgetItem,
    updateBudget,

    // UTILITIES
    parseProject,
    parseBudget,
    parseUpdateBudgetItem,
    parseUpdateProject,
    parseProjectCustomer,
    parseUpdateProjectConfig,
    mapProject,
    mapContactsFromProjects,
    mapProjectCustomer,
  };
}
