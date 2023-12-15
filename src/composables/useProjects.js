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

  // UTILITIES
  const parseProject = (project) => {
    return {
      name: project["project-name"],
      description: project["project-description"],
      project_type: project.project_type?.id,
      project_area: project.project_area?.id,
      project_detail: project.project_detail?.id,
      customer_id: "",
      contacts: project.teamMembers.map((teamMember) => {
        return {
          id: teamMember.id,
          role: teamMember.role?.id,
        };
      }),
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
      project_type: project.project_type.value,
      project_area: project.project_area.value,
      project_detail: project.project_detail.value,
      open_tasks: project.open_tasks,
      breached_tasks: project.breached_tasks,
      stage: project.process.current_stage?.name,
      status: project.state.value,
      process: project.process,
    };
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

  return {
    // ACTIONS
    getProjectsFromApi,
    createProject,
    getProjectFromApi,
    updateProject,
    assignContactToProject,
    unassignContactFromProject,

    // UTILITIES
    parseProject,
    parseUpdateProject,
    mapProject,
  };
}
