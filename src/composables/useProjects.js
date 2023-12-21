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

  const deleteProjectCustomer = async (
    projectId,
    customerId,
    serviceAreaId
  ) => {
    console.log("deleteProjectCustomer", projectId, customerId, serviceAreaId);

    const data = {
      customer: customerId,
      service_area: serviceAreaId,
    };

    return await projectsStore.deleteProjectCustomer(projectId, data);
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
          role: teamMember.role_project?.id,
        };
      }),
      location: {
        city_id: project.city?.id,
        street_id: project.street?.id,
        house_number: project["house-number"],
        apartment_number: "",
        entrance: "",
        zip_id: "",
      },
    };
  };

  const parseUpdateProject = (project) => {
    return {
      name: project["project-name"],
      project_type: project.project_type?.id,
      project_area: project.project_area?.id,
      project_detail: project.project_detail?.id,
      location: {
        city: "",
        street: "",
        house_number: "",
        apartment: "",
        entrance: "",
        zip: "",
      },
    };
  };

  const mapProject = (project) => {
    return {
      project_id: project.id,
      project_number: project.number,
      project_name: project.name,
      city_data: project.location?.city?.value,
      address: project.location?.street?.value,
      project_type: project.project_type?.value,
      project_area: project.project_area?.value,
      project_detail: project.project_detail?.value,
      open_tasks: project.open_tasks,
      breached_tasks: project.breached_tasks,
      stage: project.process?.current_stage?.name,
      status: project.state?.value,
      process: project.process,
      location: project.location,
      contacts: project.contacts,
      subprojects: mapSubprojects(project.subprojects),
      service_areas: project.service_areas,
    };
  };

  const mapSubprojects = (subprojects) => {
    if (!subprojects || subprojects.length === 0) {
      return [];
    }

    return subprojects.map(mapProject);
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

  // MOCKED DATA
  const randomStatus = () => {
    const status = ["active", "not_active"];
    return status[Math.floor(Math.random() * status.length)];
  };

  const generateFakeProject = (i) => {
    const is_active = Math.random() < 0.5;

    return {
      project_id: i,
      project_number: "003-02-" + i,
      project_name: "שכונת הבוכרים",
      city_data: "גוש 1234, חלקה 456",
      address: "שמעון פרס 15, רחובות",
      project_type: "בנייה ציבורית",
      project_area: "בנייה ציבורית",
      project_detail: "בנייה ציבורית",
      open_tasks: "12",
      breached_tasks: "0",
      stage: "תכנון",
      status: randomStatus(),
    };
  };

  const getCompetitionOrganizations = async () => {
    return Array(10).fill(fakeOrganization);
  };

  const fakeOrganization = {
    name: "א.א. בוני הדרום",
    offer_requested: "11/12/23",
    offer_recieved: "11/12/23",
    offer_amount: "30000",
    status: "התקבלה הצעה",
    qualified_first: true,
    quealified_second: false,
    notes: "משהו חשוב שכולל מילים שכתבו על הארגון ",
    file: "",
  };

  return {
    // ACTIONS
    getProjectsFromApi,
    createProject,
    getProjectFromApi,
    updateProject,
    assignContactToProject,
    unassignContactFromProject,
    addServiceArea,
    removeServiceArea,
    getProjectCustomers,
    createProjectCustomer,
    deleteProjectCustomer,

    // UTILITIES
    parseProject,
    parseUpdateProject,
    mapProject,
    mapContactsFromProjects,
  };
}
