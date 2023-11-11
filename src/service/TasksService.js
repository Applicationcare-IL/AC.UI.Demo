import axiosConfig from "@/service/axiosConfig";

export const TasksService = {
  getTasksData() {
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
          ? slas[parseInt(Math.random() * 3)]
          : slas[parseInt(Math.random() * 2 + 3)],
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
  },

  getTasksMini() {
    return Promise.resolve(this.getTasksData().slice(0, 5));
  },

  getTasksSmall() {
    return Promise.resolve(this.getTasksData().slice(0, 10));
  },

  getTasks() {
    return Promise.resolve(this.getTasksData());
  },

  getTasksWithOrdersSmall() {
    return Promise.resolve(this.getTasksWithOrdersData().slice(0, 10));
  },

  getTasksWithOrders() {
    return Promise.resolve(this.getTasksWithOrdersData());
  },
  getTask(task_number) {
    return Promise.resolve(
      this.getTasksData().find((task) => task.task_number === task_number)
    );
  },
  getTasksFromApi(params) {
    console.log(params);
    return axiosConfig
      .get("/tasks", { params })
      .then((response) => {
        console.log(response);
        const tasks = response.data.data.map((service) => {
          return this.mapTask(service);
        });
        const totalRecords = response.data.meta.total;
        console.log(tasks);
        return { tasks, totalRecords };
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getTasksTypesFromApi(params) {
    return axiosConfig
      .get("/tasks/types", { params })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getTaskFromApi(id) {
    return axiosConfig
      .get("/tasks/" + id)
      .then((response) => {
        console.log(response);
        const service = response.data.data;
        return this.mapTask(service);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  createTask(task) {
    return axiosConfig
      .post("/tasks", task)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  completeTask(id) {
    return axiosConfig
      .post("/tasks/" + id + "/complete")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  parseTask(task) {
    return {
      task_type: task["task-type"].id,
      description: task.description,
      due_date: task.due_date,
      started_at: task.started_at,
      customer_id: task.customer.id,
      contact_id: task.contact.id,
      entity_type: task.entity_type ? task.entity_type.type : null,
      entity_id: task.entity_id ? task.entity_id.id : null,
    };
  },

  mapTask(task) {
    const is_open = Math.random() < 0.5;
    return {
      name: task.id,
      task_number: task.id,
      process_number: "687984",
      task_type: task.task_type?.name,
      family: task.family?.value,
      stage: task.stage?.name,
      sla: task.sla?.sla,
      days_for_closing: task.sla?.days_for_closing,
      contact: "שלומי שבת",
      contact_id: "795",
      status: task.status?.value, //is_open ? 'פתוח' : 'סגור',
      is_open: task.status?.value == "open",
      due_date: task.sla?.due_date,
      open_date: task.started_at,
      owner: task.owner?.name,
      team: "אגף רישוי ופיקוח (הנדסה)",
      customer: "טיילור סוויפט",
      call: "כן",
      close_date: is_open ? "" : "11/12/23",
      last_change: "11/11/22 10:23",
      remarks: "תוכן של הערה שכתובה יפה מאוד",
      service_number: "469879",
      notes: task.notes,
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
        contact_id: "795",
        contact_role: "אחראי תברואה",
        phone: "054-1234567",
        email: "mailmail@mailmail.com",
        type: "ציבורי",
      },
    };
  },
};

const slas = ["10 ימים", "2 ימים", "3 ימים", "עמד ביעד", "הסתיים בחריגה"];
