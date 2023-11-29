import { useProjectsStore } from "@/stores/projectsStore";

export function useProjects() {
  const projectsStore = useProjectsStore();

  // ACTIONS
  const getProjectsFromApi = async (params) => {
    return getProjectsData();

    const response = await projectsStore.getProjectsFromApi(params);

    const projects = response.data.map((project) => {
      //   return mapProject(project);
      return project;
    });

    const totalRecords = response.meta.total;

    return { projects, totalRecords };
  };

  const getProjectFromApi = async (id) => {
    return getMockedProjectResponse();

    const response = await projectsStore.getProjectFromApi(id);
    return mapProject(response.data);
  };

  const createProject = async (project) => {
    return await projectsStore.createProject(project);
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

  const getMockedProjectResponse = () => {
    return {
      id: 1,
      project_number: "003-02-2022",
      project_name: "Project Name",
      state: "active",
      city: {
        id: 1822,
        value: "tel-aviv-yafo",
      },
      street: {
        id: 1823,
        value: "yehuda-hehasid-street",
      },
      project_type: {
        id: 1892,
        value: "project_type_1",
      },
      project_area: {
        id: 1893,
        value: "project_area_1",
      },
      project_detail: {
        id: 1894,
        value: "project_detail_1",
      },
      open_tasks: "",
      breached_tasks: "",
      process: {
        id: 62,
        owner: {
          id: 1,
          type: "employee",
        },
        customer: {
          id: 4,
          name: "Bernat",
          surname: "Magraner",
        },
        contact: {
          id: 3,
          name: "Bernat",
          surname: "Magraner",
        },
        status: {
          id: 294,
          value: "canceled",
        },
        state: {
          id: 292,
          value: "not_active",
        },
        opened: "2023-07-02T00:00:00.000000Z",
        closed: null,
        sla: {
          due_date: "2023-07-04",
          days_from_opening_date: null,
          days_for_closing: null,
          sla_date: "2023-07-03",
          sla: "no_breach",
        },
        current_stage: null,
        stages: [],
      },
    };
  };

  return {
    // ACTIONS
    getProjectsFromApi,
    createProject,
    getProjectFromApi,

    // UTILITIES
    parseProject,
    mapProject,

    // MOCKED DATA
    getProjectsData,
  };
}
