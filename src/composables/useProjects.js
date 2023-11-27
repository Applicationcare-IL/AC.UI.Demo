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

  const createProject = async (service) => {
    return await projectsStore.createProject(service);
  };

  // UTILITIES
  const parseProject = (project) => {
    console.log(project);
    return {
      project_number: "",
      project_name: "nobis",
      city: 2,
      street: 13,
      project_type: 19,
      project_area: 7,
      project_detail: 1,
      customer_id: 13,
      contact_id: 10,
      process_definition_id: 11,
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
    createProject,

    // UTILITIES
    parseProject,
    mapProject,

    // MOCKED DATA
    getProjectsData,
  };
}
