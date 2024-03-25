import { useTasksStore } from "@/stores/tasksStore";

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

  const getTaskTypes = async () => {
    return await getTasksTypesFromApi().then((data) => {
      return data.data;
    });
  };

  /**
   * This function is used to get signature tasks from the API and maps the response to the required format
   * @param {*} params
   * @returns
   */
  const getSignatureTaskFromApi = async (params) => {
    const response = await tasksStore.getSignatureTaskFromApi(params);

    const tasks = response.data.map((task) => {
      return mapSignatureTask(task);
    });

    const totalRecords = response.meta.total;

    return { data: tasks, totalRecords };
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

  const signTask = async (signatureId, data) => {
    return await tasksStore.signTask(signatureId, data);
  };

  const generateSignaturesDocument = async (projectId) => {
    return await tasksStore.generateSignaturesDocument(projectId);
  };

  const getTopTaskFamilies = async (params) => {
    const response = await tasksStore.getTopTaskFamilies(params);
    return response.data;
  };

  const exportTasks = async (params) => {
    return await tasksStore.exportTasks(params);
  };

  // UTILITIES
  const mapTask = (task) => {
    return {
      id: task.id,
      title: task.id,
      name: task.id,
      task_number: task.id,
      process_number: "10",
      task_type: task.task_type,
      task_family: task.task_family,
      stage: task.stage?.name,
      sla: task.sla,
      days_for_closing: task.sla?.days_for_closing,
      contact: task.contact,
      contact_id: task.contact?.id,
      state: task.state,
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
      project_created: task.project_created,
      last_activity: task.last_activity,
      read: task.read,
    };
  };

  const mapSignatureTask = (task) => {
    return {
      id: task.id,
      task_id: task.task_id,
      owner: task.owner?.name,
      stage: task.stage?.name,
      sla: task.sla,
      days_for_closing: task.sla?.days_for_closing,
      notes: task.remarks,
      task_type: task.task_type.name,
      status: task.status,
      signature_status: task.signature_status,
      open_date: task.last_activity?.creator?.at,
      state: task.state?.value,
      is_open: task.status?.value == "open",
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
        name: tasks.contact.name,
      };
    }

    const uniqueContacts = contacts.filter(
      (contact, index, self) =>
        index === self.findIndex((t) => t.id === contact.id)
    );

    return uniqueContacts;
  };

  return {
    // API
    getTasksFromApi,
    getTaskTypes,
    getTasksTypesFromApi,
    getTaskFromApi,
    getSignatureTaskFromApi,
    generateSignaturesDocument,
    createTask,
    updateTask,
    completeTask,
    completeTasks,
    signTask,
    getTopTaskFamilies,
    exportTasks,
    // UTILITIES
    mapTask,
    parseTask,
    parseUpdateTask,
    mapContactsFromTasks,
  };
}
