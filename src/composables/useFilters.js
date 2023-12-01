export function useFilters() {
  const filterList = {
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
  };

  return {
    // ACTIONS
    filterList,
  };
}
