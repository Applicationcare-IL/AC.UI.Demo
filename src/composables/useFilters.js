import { useI18n } from "vue-i18n";

import useAdminRoles from "@/composables/useAdminRoles";
import useAdminTeams from "@/composables/useAdminTeams";
import useAdminUsers from "@/composables/useAdminUsers";

const useFilters = () => {
  const { getTasksTypesFromApi } = useTasks();
  const { getCustomersFromApi } = useCustomers();
  const { getProjectsFromApi, getMilestones, getBudgetItems } = useProjects();
  const { getContactsFromApi } = useContacts();
  const { getTeams } = useAdminTeams();
  const { getRoles } = useAdminRoles();
  const { getUsers } = useAdminUsers();

  const i18n = useI18n();

  const searchTaskTypes = (query) => {
    return getTasksTypesFromApi({
      search: query,
    });
  };

  const searchCustomers = (query) => {
    return getCustomersFromApi({
      search: query,
    });
  };

  const searchProjects = async (query) => {
    const response = await getProjectsFromApi({
      search: query,
    });

    return {
      data: response.projects,
    };
  };

  const searchMilestones = async (query) => {
    const response = await getMilestones({
      search: query,
    });

    return {
      data: response.milestones,
    };
  };

  const searchBudgetItems = async (query) => {
    const response = await getBudgetItems({
      search: query,
    });

    return {
      data: response.budgetItems,
    };
  };

  const searchContacts = (query) => {
    return getContactsFromApi({
      search: query,
    });
  };

  const searchTeams = async (query) => {
    return getTeams({
      search: query,
    });
  };

  const searchRoles = async (query) => {
    return getRoles({
      search: query,
    });
  };

  const searchUsers = async (query) => {
    return getUsers({
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
        type: "dropdown",
        name: "created-assigned",
        options: [
          {
            name: "all",
            label: i18n.t("filters.all"),
            value: true,
          },
          {
            name: "created_by_me",
            label: i18n.t("filters.created-by-me"),
            value: true,
          },
          {
            name: "assigned_by_me",
            label: i18n.t("filters.assigned-by-me"),
            value: true,
          },
        ],
        label: i18n.t("filters.created-assigned") + ":",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "service_status",
        label: i18n.t("status") + ":",
      },
      {
        type: "dropdown",
        name: "priority",
        options: [
          {
            name: "all",
            label: i18n.t("filters.all"),
            value: true,
          },
          {
            name: "priority",
            label: 1,
            value: 1,
          },
          {
            name: "priority",
            label: 2,
            value: 2,
          },
          {
            name: "priority",
            label: 3,
            value: 3,
          },
          {
            name: "priority",
            label: 4,
            value: 4,
          },
          {
            name: "priority",
            label: 5,
            value: 5,
          },
        ],
        label: i18n.t("service.priority") + ":",
      },
      {
        type: "buttons",
        name: "urgent",
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
    "related-service": [
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
        type: "dropdown",
        name: "created-assigned",
        options: [
          {
            name: "all",
            label: i18n.t("filters.all"),
            value: true,
          },
          {
            name: "created_by_me",
            label: i18n.t("filters.created-by-me"),
            value: true,
          },
          {
            name: "assigned_by_me",
            label: i18n.t("filters.assigned-by-me"),
            value: true,
          },
        ],
        label: i18n.t("filters.created-assigned") + ":",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "service_status",
        label: i18n.t("status") + ":",
      },
      {
        type: "dropdown",
        name: "priority",
        options: [
          {
            name: "all",
            label: i18n.t("filters.all"),
            value: true,
          },
          {
            name: "priority",
            label: 1,
            value: 1,
          },
          {
            name: "priority",
            label: 2,
            value: 2,
          },
          {
            name: "priority",
            label: 3,
            value: 3,
          },
          {
            name: "priority",
            label: 4,
            value: 4,
          },
          {
            name: "priority",
            label: 5,
            value: 5,
          },
        ],
        label: i18n.t("service.priority") + ":",
      },
      {
        type: "buttons",
        name: "urgent",
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
        type: "state",
        name: "state",
        label: i18n.t("state") + ":",
      },
      {
        type: "entity",
        name: "task_type",
        label: i18n.t("task.type") + ":",
        placeholder: i18n.t("task.task-type-placeholder") + ":",
        searchFunction: searchTaskTypes,
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
    asset: [
      {
        type: "dropdown",
        name: "asset_type",
        optionSet: "asset_type",
        label: i18n.t("asset.type") + ":",
        placeholder: i18n.t("asset.asset-type-placeholder") + ":",
      },
      {
        type: "entity",
        name: "asset_owner",
        label: i18n.t("asset.owner") + ":",
        placeholder: i18n.t("asset.owner-placeholder") + ":",
        searchFunction: searchCustomers,
      },
      {
        type: "entity",
        name: "asset_payer",
        label: i18n.t("asset.payer") + ":",
        placeholder: i18n.t("asset.payer-placeholder") + ":",
        searchFunction: searchCustomers,
      },
      {
        type: "entity",
        name: "asset_consumer",
        label: i18n.t("asset.consumer") + ":",
        placeholder: i18n.t("asset.consumer-placeholder") + ":",
        searchFunction: searchCustomers,
      },
      {
        type: "buttons",
        name: "state",
        optionSet: "state",
        label: i18n.t("status") + ":",
      },
      {
        type: "date",
        name: "usage_start_date",
        label: i18n.t("filters.open-date") + ":",
        from: "usage_start_date_from",
        to: "usage_start_date_to",
      },
    ],
    payment: [
      {
        toggable: true,
        type: "dropdown",
        name: "payment_status",
        optionSet: "payment_status",
        label: i18n.t("payments.status") + ":",
      },
      {
        toggable: true,
        type: "entity",
        name: "projects",
        label: i18n.t("project.project") + ":",
        searchFunction: searchProjects,
      },
      {
        toggable: true,
        type: "entity",
        name: "milestone",
        label: i18n.t("milestone.milestones") + ":",
        searchFunction: searchMilestones,
      },
      {
        toggable: true,
        type: "entity",
        name: "budget_item",
        label: i18n.t("budget.budget-item") + ":",
        searchFunction: searchBudgetItems,
      },
      {
        toggable: true,
        type: "entity",
        name: "customer",
        label: i18n.t("project.organization") + ":",
        searchFunction: searchCustomers,
      },
      {
        toggable: true,
        type: "entity",
        name: "contact",
        label: i18n.t("contact.contacts") + ":",
        searchFunction: searchContacts,
      },
      {
        toggable: true,
        type: "date",
        name: "open",
        label: i18n.t("payments.payment-date") + ":",
        from: "payment_date_from",
        to: "payment_date_to",
      },
    ],
    employee: [
      {
        type: "state",
        name: "state",
        label: i18n.t("state") + ":",
      },
      {
        type: "entity",
        name: "teams",
        label: i18n.t("teams") + ":",
        searchFunction: searchTeams,
      },
      {
        type: "entity",
        name: "roles",
        label: i18n.t("roles") + ":",
        searchFunction: searchRoles,
      },
      {
        type: "entity",
        name: "manager_id",
        label: i18n.t("manager") + ":",
        searchFunction: searchUsers,
      },
    ],
    team: [
      {
        type: "state",
        name: "state",
        label: i18n.t("state") + ":",
      },
      {
        type: "entity",
        name: "manager_id",
        label: i18n.t("manager") + ":",
        searchFunction: searchUsers,
      },
    ],
    role: [
      {
        type: "state",
        name: "state",
        label: i18n.t("state") + ":",
      },
    ],
    message: [
      {
        type: "selectableButtons",
        name: "message_target",
        label: i18n.t("message.target") + ":",
        options: [
          // name, value de user, projects, etc.
        ],
      },
      {
        type: "state",
        name: "state",
        label: i18n.t("state") + ":",
      },
      {
        type: "booleanSwitch",
        name: "message_rating",
        label: i18n.t("message.rating") + ":",
        options: [
          {
            name: "important",
            value: true,
          },
          {
            name: "normal",
            value: false,
          },
        ],
      },
      {
        type: "date",
        name: "start",
        label: i18n.t("start-date") + ":",
        from: "start_date_from",
        to: "start_date_to",
      },
      {
        type: "date",
        name: "end",
        label: i18n.t("end-date") + ":",
        from: "end_date_from",
        to: "end_date_to",
      },
    ],
    "quick-code": [
      {
        type: "state",
        name: "state",
        label: i18n.t("state") + ":",
      },
      {
        type: "entity",
        name: "teams",
        label: i18n.t("teams") + ":",
        searchFunction: searchTeams,
      },
      {
        type: "dropdown",
        name: "area",
        optionSet: "service_area",
        placeholder: i18n.t("customer.service-areas-placeholder") + ":",
      },
    ],
  };

  return {
    filterList,
  };
};

export default useFilters;
