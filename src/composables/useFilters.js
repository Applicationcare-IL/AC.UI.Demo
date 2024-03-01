import { useI18n } from "vue-i18n";

export function useFilters() {
  const { getTasksTypesFromApi } = useTasks();
  const i18n = useI18n();

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
        placeholder: i18n.t("filters.select-city") + ":",
      },
      {
        type: "dropdown",
        name: "street",
        optionSet: "service_street",
        placeholder: i18n.t("filters.select-street") + ":",
      },
      {
        type: "buttons",
        name: "state",
        optionSet: "state",
        label: i18n.t("status") + ":",
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
        label: i18n.t("status") + ":",
      },
      {
        type: "buttons",
        name: "service_sla_status",
        label: i18n.t("filters.service-sla-status") + ":",
      },
      {
        type: "buttons",
        name: "task_sla_status",
        optionSet: "task_sla",
        label: i18n.t("filters.task-sla-status") + ":",
      },
    ],
    customer: [
      {
        type: "dropdown",
        name: "service_area",
        optionSet: "service_area",
        placeholder: i18n.t("customer.service-areas-placeholder") + ":",
      },
      {
        type: "buttons",
        name: "type",
        optionSet: "customer_type",
        label: i18n.t("customer.type") + ":",
      },
      {
        type: "buttons",
        name: "rating",
        optionSet: "customer_rating",
        label: i18n.t("customer.rating") + ":",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "customer_status",
        label: i18n.t("status") + ":",
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
        label: i18n.t("status") + ":",
      },
    ],
    service: [
      {
        type: "dropdown",
        name: "area",
        optionSet: "service_area",
        label: i18n.t("service.service-area-placeholder") + ":",
      },
      {
        type: "dropdown",
        name: "type",
        optionSet: "service_type",
        label: i18n.t("service.service-type-placeholder") + ":",
      },
      {
        type: "sla_status",
        name: "sla",
        label: i18n.t("filters.service-sla-status") + ":",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "service_status",
        label: i18n.t("status") + ":",
      },
      {
        type: "buttons",
        name: "priority",
        optionSet: "service_priority",
        label: i18n.t("service.priority") + ":",
      },
      {
        type: "buttons",
        name: "urgency",
        optionSet: "service_urgent",
        label: i18n.t("service.urgency") + ":",
      },
      {
        type: "date",
        name: "open",
        label: i18n.t("filters.open-date") + ":",
        from: "opened_from",
        to: "opened_to",
      },
      {
        type: "date",
        name: "goal",
        label: i18n.t("filters.due-date") + ":",
        from: "due_date_from",
        to: "due_date_to",
      },
    ],
    task: [
      {
        type: "entity",
        name: "task_type",
        optionSet: "task_type",
        label: i18n.t("task.type") + ":",
        placeholder: i18n.t("task.task-type-placeholder") + ":",
        searchFunction: searchTaskTypes,
      },
      // {
      //   type: "dropdown",
      //   name: "task_family",
      //   optionSet: "task_family",
      //   label: i18n.t("task.family") + ":",
      //   placeholder: i18n.t("task.task-family-placeholder") + ":",
      // },
      {
        type: "sla_status",
        name: "sla",
        label: i18n.t("filters.service-sla-status") + ":",
      },
      {
        type: "buttons",
        name: "state",
        optionSet: "state",
        label: i18n.t("status") + ":",
      },
      {
        type: "date",
        name: "open",
        label: i18n.t("filters.open-date") + ":",
        from: "opened_from",
        to: "opened_to",
      },
      {
        type: "date",
        name: "goal",
        label: i18n.t("filters.due-date") + ":",
        from: "due_date_from",
        to: "due_date_to",
      },
    ],
    project: [
      {
        type: "dropdown",
        name: "project_type",
        optionSet: "project_type",
        label: i18n.t("project.project_type") + ":",
        placeholder: i18n.t("project.project_types_placeholder") + ":",
      },
      {
        type: "dropdown",
        name: "project_area",
        optionSet: "project_area",
        label: i18n.t("project.project_area") + ":",
        placeholder: i18n.t("project.project_areas_placeholder") + ":",
      },
      {
        type: "dropdown",
        name: "project_detail",
        optionSet: "project_detail",
        label: i18n.t("project.project_detail") + ":",
        placeholder: i18n.t("project.project_details_placeholder") + ":",
      },
      {
        type: "sla_status",
        name: "sla",
        label: i18n.t("filters.service-sla-status") + ":",
      },
      {
        type: "date",
        name: "open",
        label: i18n.t("filters.open-date") + ":",
        from: "opened_from",
        to: "opened_to",
      },
      {
        type: "date",
        name: "goal",
        label: i18n.t("filters.due-date") + ":",
        from: "due_date_from",
        to: "due_date_to",
      },
    ],
  };

  return {
    // ACTIONS
    filterList,
  };
}
