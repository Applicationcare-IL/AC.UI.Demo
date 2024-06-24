import { useOptionSetsStore } from "@/stores/optionSets";
import { useProjectsStore } from "@/stores/projectsStore";

export function useProjects() {
  const projectsStore = useProjectsStore();
  const optionSetsStore = useOptionSetsStore();
  const { formatDateToAPI, formatDateFromAPI } = useDates();

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

  const deleteProjectCustomer = async (projectId, customerId, serviceAreaId) => {
    const data = {
      customer: customerId,
      service_area: serviceAreaId,
    };

    return await projectsStore.deleteProjectCustomer(projectId, data);
  };

  const exportProjects = async (params) => {
    return await projectsStore.exportProjects(params);
  };

  const cancelProject = async (projectId) => {
    return await projectsStore.cancelProject(projectId);
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
    const response = await projectsStore.getProjectTeamRoles(projectId, params);
    return response.data;
  };

  // BUDGETS
  const getProjectBudget = async (projectId) => {
    const response = await projectsStore.getProjectBudget(projectId);

    return mapProjectBudget(response.data);
  };

  const updateBudget = async (projectId, data) => {
    return await projectsStore.updateBudget(projectId, data);
  };

  const getBudgetItems = async (params) => {
    const response = await projectsStore.getBudgetItems(params);

    const budgetItems = response.data.map((budgetItem) => {
      return mapBudgetItem(budgetItem);
    });

    const totalRecords = response.meta.total;

    return { budgetItems, totalRecords };
  };

  const getBudgetItem = async (budgetItemId) => {
    const response = await projectsStore.getBudgetItem(budgetItemId);

    return mapBudgetItem(response.data);
  };

  const createBudgetItem = async (data) => {
    return await projectsStore.createBudgetItem(data);
  };

  const updateBudgetItem = async (budgetItemId, data) => {
    return await projectsStore.updateBudgetItem(budgetItemId, data);
  };

  const calculateBudget = async (projectId, data) => {
    const response = await projectsStore.calculateBudget(projectId, data);
    return response;
  };

  const calculateBudgetItem = async (budgetItemId, data) => {
    return await projectsStore.calculateBudgetItem(budgetItemId, data);
  };

  const calculateNewBudgetItem = async (data) => {
    return await projectsStore.calculateNewBudgetItem(data);
  };

  // PAYMENTS
  const getProjectPayments = async (params) => {
    const response = await projectsStore.getProjectPayments(params);

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
  // TODO: with the refactoring of the milestones, we should probably extract this to a separate composable
  const createMilestone = async (data) => {
    return await projectsStore.createMilestone(data);
  };

  const getMilestones = async (params) => {
    const response = await projectsStore.getMilestones(params);

    const milestones = response.data;
    const totalRecords = response.meta.total;

    return { milestones, totalRecords };
  };

  const getProjectMilestone = async (milestoneId) => {
    const response = await projectsStore.getProjectMilestone(milestoneId);

    return mapMilestone(response);
  };

  const updateProjectMilestone = async (milestoneId, data) => {
    return await projectsStore.updateProjectMilestone(milestoneId, data);
  };

  const completeMilestone = async (milestoneId) => {
    const completeMilestoneStatusId = await optionSetsStore.getValueId(
      "milestone_status",
      "complete"
    );

    const inactiveStateId = await optionSetsStore.getValueId("state", "not_active");
    const today = formatDateToAPI(new Date());

    const data = {
      milestone_status: completeMilestoneStatusId,
      state: inactiveStateId,
      actual_date: today,
    };

    return await projectsStore.updateProjectMilestone(milestoneId, data);
  };

  // UTILITIES
  const parseProject = (project) => {
    let parsedProject = {
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
          customer: teamMember.customer.id,
        };
      }),
    };

    let location = {};

    let addressOptions = {};
    if (project.showAddressOptions) {
      addressOptions = {
        city: project.city?.id,
        street: project.street?.id,
        house_number: project["house-number"],
        neighborhood: project.neighborhood,
      };
    }

    let cityData = {};
    if (project.showCityDataOptions) {
      cityData = {
        block: project.block,
        parcel: project.parcel,
        sub_parcel: project["sub-parcel"],
      };
    }

    location = {
      ...addressOptions,
      ...cityData,
    };

    parsedProject = {
      ...parsedProject,
      location: location,
    };

    return parsedProject;
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
      is_default: false, // the default one is created by migration
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
    let isTender = project["contractor-option"].value === "tender" ? true : false;

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

    const dateISO = `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;

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
    let result = {
      proforma_invoice_date: parseDate(payment.proforma_invoice_date),
      proforma_invoice_number: payment.proforma_invoice_number
        ? payment.proforma_invoice_number
        : "",
      proforma_invoice_amount: payment.proforma_invoice_amount
        ? payment.proforma_invoice_amount
        : 0,
      invoice_date: parseDate(payment.invoice_date),
      invoice_number: payment.invoice_number,
      payment_date: parseDate(payment.payment_date),
      report_date: parseDate(payment.report_date),
      budget_item: payment.budget_item.id,
      reported: payment.reported ? true : false,
      payment_status: payment.payment_status,
      amount_paid: payment.amount_paid ? payment.amount_paid : 0,
      amount_approved: payment.amount_approved ? payment.amount_approved : 0,
      batch_number: payment.batch_number,
      basic_term: payment.basic_term,
      task: payment.task,
    };

    if (payment.terms_of_payment_id) {
      payment.terms_of_payment = payment.terms_of_payment_id;
    }

    if (payment.milestone?.id) {
      result.milestone = payment.milestone.id;
    }

    if (payment.project_team?.id) {
      result.project_team = payment.project_team.id;
    }

    return result;
  };

  const parseMilestone = (milestone) => {
    const parsedMilestone = {
      name: milestone["milestone-name"],
      project: milestone.project,
      milestone_type: milestone.type?.id,
      description: milestone.description,
    };

    if (milestone.plannedDate) {
      parsedMilestone.planned_date = formatDateToAPI(milestone.plannedDate);
    }

    if (milestone.actualDate) {
      parsedMilestone.actual_date = formatDateToAPI(milestone.actualDate);
    }

    if (milestone.baseDate) {
      parsedMilestone.base_date = formatDateToAPI(milestone.baseDate);
    }

    return parsedMilestone;
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
      open_tasks: project.open_tasks,
      breached_tasks: project.breached_tasks,
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
      total: budgetItem.total_approved ? budgetItem.total_approved : budgetItem.total,
    };
  };

  const mapProjectTeamMember = (teamMember) => {
    return {
      id: teamMember?.id,
      contact_id: teamMember?.contact?.id,
      name:
        teamMember?.contact?.name +
        " " +
        teamMember?.contact?.surname +
        " - " +
        teamMember?.role_project?.value_en +
        " - " +
        teamMember?.customer?.name,
      basic_term: teamMember.basic_term,
      calculate_term: teamMember.calculate_term,
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

  const mapShortMilestone = (milestone) => {
    return {
      id: milestone.id,
      name: milestone.name,
    };
  };

  const mapPayment = (payment) => {
    return {
      ...payment,
      budget_item: mapBudgetItem(payment.budget_item),
      payment_status: payment.payment_status?.id,
      proforma_invoice_date: formatDate(new Date(payment.proforma_invoice_date), "DD/MM/YY"),
      project_team: payment.project_team ? mapProjectTeamMember(payment.project_team) : null,
      milestone: payment.milestone ? mapShortMilestone(payment.milestone) : null,
      project: payment.budget_item?.project,
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
      (contact, index, self) => index === self.findIndex((t) => t.id === contact.id)
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
      planned_date: milestone.planned_date ? formatDateFromAPI(milestone.planned_date) : null,
      actual_date: milestone.actual_date ? formatDateFromAPI(milestone.actual_date) : null,
      base_date: milestone.base_date ? formatDateFromAPI(milestone.base_date) : null,
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
    getMilestones,
    createMilestone,
    updateProjectMilestone,
    completeMilestone,
    exportProjects,
    getProjectTeam,
    getProjectTeamRoles,
    updateTeamMember,
    cancelProject,
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
    mapShortMilestone,
  };
}
