import { useOptionSetsStore } from "@/stores/optionSets";
import { useProjectsStore } from "@/stores/projectsStore";

export function useProjects() {
  const projectsStore = useProjectsStore();
  const optionSetsStore = useOptionSetsStore();

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

  const assignContactToProject = async (params) => {
    return await projectsStore.assignContactToProject(params);
  };

  const updateTeamMember = async (projectId, teamMemberId, data) => {
    return await projectsStore.updateTeamMember(projectId, teamMemberId, data);
  };

  const unassignContactFromProject = async (params) => {
    return await projectsStore.unassignContactFromProject(params);
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

  const exportProjects = async (params) => {
    return await projectsStore.exportProjects(params);
  };

  // TEAM
  const getProjectTeam = async (projectId, params) => {
    const response = await projectsStore.getProjectTeam(projectId, params);

    const contacts = response.data.map((contact) => {
      return mapProjectTeamMember(contact);
    });

    const totalRecords = response.meta.total;

    return { contacts, totalRecords };
  };

  const getProjectTeamRoles = async (projectId, params) => {
    return await projectsStore.getProjectTeamRoles(projectId, params);
  };

  // BUDGETS
  const getProjectBudget = async (projectId) => {
    const response = await projectsStore.getProjectBudget(projectId);

    return mapProjectBudget(response.data);
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

  const calculateBudget = async (projectId, data) => {
    const response = await projectsStore.calculateBudget(projectId, data);
    return response;
  };

  const calculateBudgetItem = async (projectId, budgetItemId, data) => {
    return await projectsStore.calculateBudgetItem(
      projectId,
      budgetItemId,
      data
    );
  };

  const calculateNewBudgetItem = async (data) => {
    return await projectsStore.calculateNewBudgetItem(data);
  };

  // PAYMENTS
  const getProjectPayments = async (projectId, params) => {
    const response = await projectsStore.getProjectPayments(projectId, params);

    const payments = response.data.map((payment) => {
      return mapPayment(payment);
    });

    const totalRecords = response.meta.total;

    return { payments: payments, totalRecords };
  };

  const createProjectPayment = async (projectId, data) => {
    return await projectsStore.createProjectPayment(projectId, data);
  };

  const updateProjectPayment = async (projectId, paymentId, data) => {
    return await projectsStore.updateProjectPayment(projectId, paymentId, data);
  };

  // MILESTONES
  const createMilestone = async (projectId, data) => {
    return await projectsStore.createMilestone(projectId, data);
  };

  const getProjectMilestones = async (projectId, params) => {
    return await projectsStore.getProjectMilestones(projectId, params);
  };

  const getProjectMilestone = async (projectId, milestoneId) => {
    const response = await projectsStore.getProjectMilestone(
      projectId,
      milestoneId
    );

    return mapMilestone(response);
  };

  const updateProjectMilestone = async (projectId, milestoneId, data) => {
    return await projectsStore.updateProjectMilestone(
      projectId,
      milestoneId,
      data
    );
  };

  const completeMilestone = async (projectId, milestoneId) => {
    const completeMilestoneStatusId = await optionSetsStore.getValueId(
      "milestone_status",
      "complete"
    );

    const inactiveStateId = await optionSetsStore.getValueId(
      "state",
      "not_active"
    );

    const data = {
      milestone_status: completeMilestoneStatusId,
      state: inactiveStateId,
    };

    return await projectsStore.updateProjectMilestone(
      projectId,
      milestoneId,
      data
    );
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
        neighborhood: project.neighborhood,
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
        neighborhood: project.neighborhood?.id,
      },
      tbr_number: project["tbr-number"],
      request_number: project["request-number"],
      network_folder: project["network-folder"],
    };
  };

  const parseBudget = (budget) => {
    return {
      tbr_number: budget.tbr_number,
      tbr_accepted: budget.tbr_accepted,
      tbr_expected: budget.tbr_expected,
      tbr_municipality_expenses: budget.tbr_municipality_expenses,
      tbr_reported: budget.tbr_reported,
      funds_accepted_non_tbr: budget.funds_accepted_non_tbr,
      expected_non_tbr: budget.expected_non_tbr,
    };
  };

  const parseUpdateBudgetItem = (budgetItem) => {
    return {
      name: budgetItem["budget-item-name"],
      description: budgetItem.description,
      estimate: budgetItem.estimate,
      planned_contract: budgetItem.planned_contract,
      executed_payments: budgetItem["executed-payments"],
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
    let isTender =
      project["contractor-option"].value === "tender" ? true : false;

    let notTenderResponse = {
      tender: false,
    };

    if (!isTender) {
      return notTenderResponse;
    }

    const siteTourNeeded = project["site-tour-needed"].value;

    const tenderResponse = {
      tender: true,
      site_tour: siteTourNeeded,
      quality_commitee: project["quality-committee-required"]?.value,
    };

    if (siteTourNeeded) {
      tenderResponse.site_tour_date = getISODate(project["site-tour-date"]);
    }

    return tenderResponse;
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

    const dateISO = `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;

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

  const parseProjectPayment = (payment) => {
    return {
      ...payment,
      proforma_invoice_date: parseDate(payment.proforma_invoice_date),
      invoice_date: parseDate(payment.invoice_date),
      payment_date: parseDate(payment.payment_date),
      report_date: parseDate(payment.report_date),
      terms_of_payment: payment.terms_of_payment_id,
      milestone: payment.milestone?.id,
    };
  };

  const parseMilestone = (milestone) => {
    return {
      name: milestone["milestone-name"],
      project_id: milestone.project_id,
      milestone_type: milestone.type?.id,
      description: milestone.description,
      planned_date: parseDate(milestone.plannedDate),
      actual_date: parseDate(milestone.actualDate),
      base_date: parseDate(milestone.baseDate),
    };
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

  const mapProjectBudget = (budget) => {
    return {
      ...budget,
      title: budget.project?.name,
    };
  };

  const mapBudgetItem = (budgetItem) => {
    return {
      title: budgetItem.name,
      ...budgetItem,
      test: budgetItem.total_approved ? budgetItem.total_approved : 8,
      total: budgetItem.total_approved
        ? budgetItem.total_approved
        : budgetItem.total,
    };
  };

  const mapProjectTeamMember = (teamMember) => {
    return {
      id: teamMember.id,
      contact_id: teamMember.contact.id,
      name:
        teamMember.contact.name +
        " " +
        teamMember.contact.surname +
        " - " +
        teamMember.role_project?.value_en +
        " - " +
        teamMember.customer?.name,
      basic_term: teamMember.basic_term?.id,
      contact_name: teamMember.contact.name,
      telephone: teamMember.contact.phone,
      email: teamMember.contact.email,
      customer: teamMember.customer,
      customers: teamMember.customers,
      role_project: teamMember.role_project,
      contract_number: teamMember.contract_number,
      contract_amount: teamMember.contract_amount,
      contract_amount_paid: teamMember.contract_amount_paid,
      contract_amount_remaining: teamMember.contract_amount_remaining,
      contract: teamMember.contract,
    };
  };

  const mapPayment = (payment) => {
    return {
      ...payment,
      budget_item: payment.budget_item?.id,
      // customer: payment.customer.id,
      payment_status: payment.payment_status?.id,
      proforma_invoice_date: formatDate(
        new Date(payment.proforma_invoice_date),
        "DD/MM/YY"
      ),
      project_team: payment.project_team?.id,
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

  const mapMilestone = (milestone) => {
    return {
      ...milestone,
      title: milestone.name,
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
    createProjectPayment,
    updateProjectPayment,
    createBudgetItem,
    updateBudget,
    calculateBudget,
    calculateBudgetItem,
    calculateNewBudgetItem,
    getProjectMilestone,
    getProjectMilestones,
    createMilestone,
    updateProjectMilestone,
    completeMilestone,
    exportProjects,
    getProjectTeam,
    getProjectTeamRoles,
    updateTeamMember,
    // UTILITIES
    parseProject,
    parseBudget,
    parseUpdateBudgetItem,
    parseUpdateProject,
    parseProjectCustomer,
    parseUpdateProjectConfig,
    parseProjectPayment,
    parseMilestone,
    // maps
    mapProject,
    mapContactsFromProjects,
    mapProjectCustomer,
    mapMilestone,
  };
}
