const { getTasksTypesFromApi } = useTasks();

export function useFilters() {
  const searchTaskTypes = (query) => {
    return getTasksTypesFromApi({
      search: query,
    });
  };

  const filterList = {
    contact: [
      {
        type: "dropdown",
        name: "city",
        optionSet: "service_city",
        placeholder: "בחירת עיר",
      },
      {
        type: "dropdown",
        name: "street",
        optionSet: "service_street",
        placeholder: "בחירת רחוב",
      },
      // {
      //   type: "dropdown",
      //   name: "owner",
      //   entity: "owner",
      //   placeholder: "בחירת בעלים",
      // },
      {
        type: "buttons",
        name: "status",
        optionSet: "state",
        label: "סטטוס:",
      },
      {
        type: "buttons",
        name: "service_sla_status",
        optionSet: "service_sla",
        label: "תהליכים פתוחים:",
      },
      {
        type: "buttons",
        name: "task_sla_status",
        optionSet: "task_sla",
        label: "משימות פתוחות:",
      },
    ],
    contactDetail: [
      {
        type: "dropdown",
        name: "role",
        optionSet: "contact_customer_role",
        placeholder: "בחירת תפקיד",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "state",
        label: "סטטוס:",
      },
      {
        type: "buttons",
        name: "service_sla_status",
        optionSet: "service_sla",
        label: "תהליכים פתוחים:",
      },
      {
        type: "buttons",
        name: "task_sla_status",
        optionSet: "task_sla",
        label: "משימות פתוחות:",
      },
    ],
    customer: [
      {
        type: "dropdown",
        name: "area",
        optionSet: "service_area",
        placeholder: "בחירת תחום",
      },
      {
        type: "buttons",
        name: "type",
        optionSet: "customer_type",
        label: "סוג:",
      },
      {
        type: "buttons",
        name: "rating",
        optionSet: "customer_rating",
        label: "דירוג:",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "customer_status",
        label: "סטטוס:",
      },
      {
        type: "buttons",
        name: "service_sla_status",
        optionSet: "service_sla",
        label: "תהליכים פתוחים:",
      },
      {
        type: "buttons",
        name: "task_sla_status",
        optionSet: "task_sla",
        label: "משימות פתוחות:",
      },
    ],
    customerDetail: [
      {
        type: "dropdown",
        name: "area",
        optionSet: "service_area",
        placeholder: "בחירת תחום",
      },
      {
        type: "dropdown",
        name: "role",
        optionSet: "contact_customer_role",
        placeholder: "בחירת תפקיד",
      },
      {
        type: "buttons",
        name: "type",
        optionSet: "customer_type",
        label: "סוג:",
      },
      {
        type: "buttons",
        name: "rating",
        optionSet: "customer_rating",
        label: "דירוג:",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "customer_status",
        label: "סטטוס:",
      },
      {
        type: "buttons",
        name: "service_sla_status",
        optionSet: "service_sla",
        label: "תהליכים פתוחים:",
      },
      {
        type: "buttons",
        name: "task_sla_status",
        optionSet: "task_sla",
        label: "משימות פתוחות:",
      },
    ],
    service: [
      {
        type: "dropdown",
        name: "area",
        optionSet: "service_area",
        placeholder: "בחירת תחום",
      },
      {
        type: "dropdown",
        name: "type",
        optionSet: "service_type",
        placeholder: "בחירת תת-תחום",
      },
      {
        type: "buttons",
        name: "sla_status",
        optionSet: "service_sla",
        label: "סטטוס SLA:",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "service_status",
        label: "סטטוס:",
      },
      {
        type: "buttons",
        name: "priority",
        optionSet: "service_priority",
        label: "עדיפות:",
      },
      {
        type: "buttons",
        name: "urgency",
        optionSet: "service_urgent",
        label: "דחיפות",
      },
      {
        type: "date",
        name: "open",
        label: "תאריך פתיחה:",
      },
      {
        type: "date",
        name: "goal",
        label: "תאריך יעד:",
      },
    ],
    task: [
      {
        type: "dropdown",
        name: "area",
        optionSet: "task_family",
        placeholder: "בחירת משפחה",
      },
      {
        type: "entity",
        name: "type",
        optionSet: "task_type",
        placeholder: "בחירת סוג משימה",
        searchFunction: searchTaskTypes,
      },
      {
        type: "buttons",
        name: "sla_status",
        optionSet: "task_sla",
        label: "סטטוס SLA:",
      },
      {
        type: "buttons",
        name: "state",
        optionSet: "state",
        label: "סטטוס:",
      },
      {
        type: "date",
        name: "open",
        label: "תאריך פתיחה:",
      },
      {
        type: "date",
        name: "goal",
        label: "תאריך יעד:",
      },
    ],
    project: [
      {
        type: "dropdown",
        name: "type",
        optionSet: "project_type",
        placeholder: "בחירת סוג פרויקט",
      },
      {
        type: "dropdown",
        name: "area",
        optionSet: "project_area",
        placeholder: "בחירת תחום",
      },
      {
        type: "dropdown",
        name: "detail",
        optionSet: "project_detail",
        placeholder: "בחירת תת-תחום",
      },
      {
        type: "buttons",
        name: "state",
        optionSet: "state",
        label: "סטטוס:",
      },
      {
        type: "date",
        name: "open",
        label: "תאריך התחלה:",
      },
    ],
  };

  return {
    // ACTIONS
    filterList,
  };
}
