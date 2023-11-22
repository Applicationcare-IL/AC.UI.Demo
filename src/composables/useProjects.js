import { useProjectsStore } from "@/stores/projectsStore";

export function useProjects() {
  const projectsStore = useProjectsStore();

  // ACTIONS
  const getProjectsFromApi = async (params) => {
    return getProjectsData();

    const response = await projectsStore.getProjectsFromApi(params);

    const services = response.data.map((project) => {
      //   return mapService(service);
      return project;
    });

    const totalRecords = response.meta.total;

    return { services, totalRecords };
  };

  // UTILITIES
  const parseProject = (project) => {
    console.log(project.direction.id);
    return {
      contact_id: project.contact.id,
      customer_id: project.customer.id,
      urgent: project.priority.id,
      direction: project.direction.id,
      channel: project.channel.id,
      priority: project.priority.id,
      process_definition_id: 1,
      description: project.description,
      address: "Address",
      area_id: project.area?.id,
      type_id: project.type?.id,
    };
  };

  const mapProject = (project) => {
    return {
      name: project.id,
    };
  };

  // MOCKED DATA
  const randomStatus = () => {
    const status = ["active", "not_active"];
    return status[Math.floor(Math.random() * status.length)];
  };

  const generateMockProject = (i) => {
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

  const getProjectsData = () => {
    const projects = [];

    for (let i = 0; i < 1000; i++) {
      projects.push({
        ...generateMockProject(i),
        subProjects: [
          generateMockProject(i + "-" + 1),
          generateMockProject(i + "-" + 2),
          generateMockProject(i + "-" + 3),
        ],
      });
    }

    return { data: projects, totalRecords: 1000 };
  };

  return {
    // ACTIONS
    getProjectsFromApi,

    // UTILITIES
    parseProject,
    mapProject,

    // MOCKED DATA
    getProjectsData,
  };
}
