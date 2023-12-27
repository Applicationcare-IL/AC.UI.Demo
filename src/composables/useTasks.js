import { useTasksStore } from "@/stores/tasksStore";
import { SLAS } from "@/constants";

export function useTasks() {
  const tasksStore = useTasksStore();

  // ACTIONS

  /**
   * This function is used to get tasks from the API and maps the response to the required format.
   * @param {*} params
   * @returns {Promise<{tasks: any[], totalRecords: number}>}
   */
  const getTasksFromApi = async (params) => {
    const response = await tasksStore.getTasksFromApi(params);

    const tasks = response.data.map((task) => {
      return mapTask(task);
    });

    const totalRecords = response.meta.total;

    return { data: tasks, totalRecords };
  };

  /**
   * This function is used to get task from the API and maps the response to the required format.
   * @param {*} id
   * @returns {Promise<{tasks: any[]}>}
   */
  const getTaskFromApi = async (id) => {
    const response = await tasksStore.getTaskFromApi(id);
    return mapTask(response.data);
  };

  /**
   * This function is used to get tasks types from the API.
   * @param {*} params
   * @returns {Promise<{tasks: any[]}>}
   */
  const getTasksTypesFromApi = async (params) => {
    return await tasksStore.getTasksTypesFromApi(params);
  };

  const createTask = async (task) => {
    return await tasksStore.createTask(task);
  };

  const updateTask = async (id, task) => {
    return await tasksStore.updateTask(id, task);
  };

  const completeTask = async (task) => {
    return await tasksStore.completeTask(task);
  };

  const completeTasks = async (task, reasons) => {
    return await tasksStore.completeTasks(task, reasons);
  };

  // UTILITIES
  const mapTask = (task) => {
    return {
      id: task.id,
      name: task.id,
      task_number: task.id,
      process_number: "10",
      task_type: task.task_type?.name,
      task_family: task.task_family,
      stage: task.stage?.name,
      sla: task.sla,
      days_for_closing: task.sla?.days_for_closing,
      contact: task.contact?.name,
      contact_id: task.contact?.id,
      state: task.state?.value,
      status: task.status,
      is_open: task.status?.value == "open",
      due_date: task.sla?.due_date,
      started_at: task.started_at,
      owner: task.owner?.name,
      team: task.owner?.default_team,
      customer: task.customer?.name,
      customer_id: task.customer?.id,
      call: "כן",
      close_date: task.completed_at,
      last_change: task.last_activity.updater.at,
      remarks: task.remarks,
      related_entity: task.entity,
      description: task.description,
      notes: task.notes,
    };
  };

  const parseTask = (task) => {
    return {
      task_type: task["task-type"].id,
      description: task.description,
      due_date: task.due_date,
      started_at: task.started_at,
      customer_id: task.customer.id,
      contact_id: task.contact.id,
      entity_type: task.entity_type ? task.entity_type : null,
      entity_id: task.entity_id ? task.entity_id : null,
    };
  };

  const parseUpdateTask = (task) => {
    return {
      notes: task.notes ? task.notes : "",
      status: task.status.value,
    };
  };

  /**
   * This function maps contacts from tasks array (or single task) to array of unique contacts
   * @param {*} tasks
   * @returns array of mapped unique contacts or single mapped contact
   */
  const mapContactsFromTasks = (tasks) => {
    let contacts = [];

    if (Array.isArray(tasks)) {
      contacts = tasks.map((task) => {
        return {
          id: task.contact_id,
          contact_id: task.contact_id,
          name: task.contact,
        };
      });
    } else {
      return {
        id: tasks.contact_id,
        contact_id: tasks.contact_id,
        name: tasks.contact,
      };
    }

    const uniqueContacts = contacts.filter(
      (contact, index, self) =>
        index === self.findIndex((t) => t.id === contact.id)
    );

    return uniqueContacts;
  };

  // MOCKED DATA
  const getTasksData = () => {
    const tasks = [];

    for (let i = 0; i < 100; i++) {
      const is_open = Math.random() < 0.5;
      tasks.push({
        task_number: "469879" + i,
        process_number: "687984" + i,
        task_type: "תשאול לקוח",
        family: "מוקד",
        contact: "שלומי שבת",
        contact_id: "795" + i,
        status: is_open ? "פתוח" : "סגור",
        due_date: "11/12/23",
        SLA: is_open
          ? SLAS[parseInt(Math.random() * 3)]
          : SLAS[parseInt(Math.random() * 2 + 3)],
        owner: "Israel Israeli",
        team: "אגף רישוי ופיקוח (הנדסה)",
        customer: "טיילור סוויפט",
        call: "כן",
        open_date: "11/11/22",
        close_date: is_open ? "" : "11/12/23",
        last_change: "11/11/22 10:23",
        remarks: "תוכן של הערה שכתובה יפה מאוד",
        stage: "קבלת בקשה",
        is_open: is_open,
        service_number: "469879" + i,
        location: {
          house_number: "12",
          apartment: "42",
          entrance: "ב",
          street: "שמעון פרס",
          city: "כוכב יאיר",
          country: "ישראל",
          zip: "1234567",
        },
        site: {
          name: "מועצה דתית בית הכנסת",
          contact: "שלומי שבת",
          contact_id: "795" + i,
          contact_role: "אחראי תברואה",
          phone: "054-1234567",
          email: "mailmail@mailmail.com",
          type: "ציבורי",
        },
      });
    }

    return tasks;
  };

  const getTasksMini = () => {
    return Promise.resolve(getTasksData().slice(0, 5));
  };

  const getTasksSmall = () => {
    return Promise.resolve(getTasksData().slice(0, 10));
  };

  const getTasks = () => {
    return Promise.resolve(getTasksData());
  };

  const getTasksWithOrdersSmall = () => {
    return Promise.resolve(getTasksWithOrdersData().slice(0, 10));
  };

  const getTasksWithOrders = () => {
    return Promise.resolve(getTasksWithOrdersData());
  };

  const getTask = (task_number) => {
    return Promise.resolve(
      getTasksData().find((task) => task.task_number === task_number)
    );
  };

  return {
    // API
    getTasksFromApi,
    getTasksTypesFromApi,
    getTaskFromApi,
    createTask,
    updateTask,
    completeTask,
    completeTasks,
    // UTILITIES
    mapTask,
    parseTask,
    parseUpdateTask,
    mapContactsFromTasks,
    // MOCKED DATA
    getTasksMini,
    getTasksSmall,
    getTasks,
    getTasksWithOrdersSmall,
    getTasksWithOrders,
    getTask,
  };
}
