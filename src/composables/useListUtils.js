import { ref } from "vue";

const selectedRowsPerPage = ref(15);

export function useListUtils() {
  const listRowsPerPage = [
    { label: "15", value: 15 },
    { label: "30", value: 30 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
  ];

  // LIST TABLE COLUMNS
  const getContactColumns = () => {
    return [
      {
        name: "star",
        type: "star",
        header: "contact.main",
        class: "column-star",
      },
      {
        name: "name",
        type: "link",
        to: "contact",
        linkParameter: "id",
        class: "link-col",
      },
      { name: "telephone", type: "text" },
      { name: "landline", type: "text" },
      { name: "email", type: "text" },
      { name: "address", type: "text" },
      {
        name: "open_services",
        type: "alert",
        header: "contact.open-services",
        class: "numeric",
      },
      {
        name: "open_tasks",
        type: "alert",
        header: "contact.open-tasks",
        class: "numeric",
      },
      {
        name: "role",
        type: "role",
        header: "role",
        optionSet: "contact_customer_role",
        class: "p-0",
      },
      {
        name: "actions",
        type: "actions",
        header: "actions",
        class: "buttons",
        buttons: ["unlink", "edit"],
      },
    ];
  };

  const getSelectedContactsForNewCustomerColumns = () => {
    return [
      {
        name: "star",
        type: "star",
        header: "contact.main",
        class: "column-star",
      },
      {
        name: "name",
        type: "link",
        to: "contact",
        linkParameter: "id",
        class: "link-col",
      },
      { name: "telephone", type: "text" },
      { name: "email", type: "text" },
      {
        name: "role",
        type: "role",
        header: "role",
        optionSet: "contact_customer_role",
        class: "p-0",
      },
      {
        name: "actions",
        type: "actions",
        header: "actions",
        class: "buttons",
        buttons: ["unlink"],
      },
    ];
  };

  const getSelectedContactsForNewProjectColumns = () => {
    return [
      {
        name: "name",
        type: "link",
        to: "contact",
        linkParameter: "id",
        class: "link-col",
      },
      { name: "email", type: "text" },
      {
        name: "role",
        type: "role",
        header: "role",
        optionSet: "contact_customer_role",
        class: "p-0",
      },
      {
        name: "actions",
        type: "actions",
        header: "actions",
        class: "buttons",
        buttons: ["unlink"],
      },
    ];
  };

  const getContactDetailColumns = () => {
    return [
      {
        name: "star",
        type: "star",
        header: "contact.main",
        class: "column-star",
      },
      {
        name: "name",
        type: "link",
        to: "contact",
        linkParameter: "id",
        class: "link-col",
      },
      { name: "telephone", type: "text" },
      { name: "email", type: "text" },
      {
        name: "role",
        type: "role",
        header: "role",
        optionSet: "contact_customer_role",
        class: "p-0",
      },
    ];
  };

  const getCustomerColumns = () => {
    return [
      {
        name: "star",
        type: "star",
        header: "customer.main",
        class: "column-star",
      },
      {
        name: "id",
        type: "link",
        header: "customer.number-abbreviation",
        class: "link-col",
      },
      { name: "name", type: "text" },
      { name: "type", type: "option-set", header: "customer.type" },
      {
        name: "open_services",
        type: "text",
        header: "customer.open-services",
        class: "numeric",
      },
      {
        name: "breached_services",
        type: "alert",
        header: "customer.breached-services",
        class: "numeric",
      },
      {
        name: "open_tasks",
        type: "text",
        header: "customer.open-tasks",
        class: "numeric",
      },
      {
        name: "breached_tasks",
        type: "alert",
        header: "customer.breached-tasks",
        class: "numeric",
      },
      {
        name: "service_areas",
        type: "tags",
        header: "service_areas",
        class: "tags buttons",
      },
      { name: "role", type: "text", header: "role" },
      {
        name: "actions",
        type: "actions",
        header: "actions",
        class: "buttons",
      },
    ];
  };

  const getCustomerDetailColumns = () => {
    return [
      {
        name: "star",
        type: "star",
        header: "customer.main",
        class: "column-star",
      },
      {
        name: "id",
        type: "link",
        header: "customer.number-abbreviation",
        class: "link-col",
      },
      { name: "name", type: "text" },
      { name: "type", type: "option-set", header: "customer.type" },
      {
        name: "open_services",
        type: "text",
        header: "customer.open-services",
        class: "numeric",
      },
      {
        name: "breached_services",
        type: "alert",
        header: "customer.breached-services",
        class: "numeric",
      },
      {
        name: "open_tasks",
        type: "text",
        header: "customer.open-tasks",
        class: "numeric",
      },
      {
        name: "breached_tasks",
        type: "alert",
        header: "customer.breached-tasks",
        class: "numeric",
      },
      {
        name: "service_areas",
        type: "tags",
        header: "service_areas",
        class: "tags buttons",
      },
      { name: "role", type: "text", header: "role" },
      {
        name: "actions",
        type: "actions",
        header: "actions",
        class: "buttons",
      },
    ];
  };

  const getServiceColumns = () => {
    return [
      {
        name: "service_number",
        type: "link",
        header: "service.number",
        class: "link-col",
      },
      { name: "open_date", type: "text", header: "service.open-date" },
      { name: "due_date", type: "text", header: "service.due-date" },
      { name: "area.value", type: "text", header: "classification-1" },
      { name: "type.value", type: "text", header: "classification-2" },
      { name: "request1.value", type: "text", header: "classification-3" },
      { name: "duration", type: "text", header: "service.duration" },
      { name: "owner.name", header: "service.owner" },
      { name: "sla", type: "sla", header: "service.sla", class: "sla" },
      {
        name: "priority",
        type: "priority",
        header: "service.priority",
        class: "numeric",
      },
      { name: "recurring", type: "translate", header: "service.recurring" },
      { name: "last_change", type: "text", header: "service.last-change" },
      { name: "closed", type: "text", header: "service.date-closed" },
      { name: "stage", type: "text", header: "service.stage" },
    ];
  };

  const getTaskColumns = () => {
    return [
      {
        name: "task_number",
        type: "link",
        header: "task.number",
        class: "link-col",
      },
      { name: "family", type: "text" },
      { name: "task_type", type: "text", header: "task.type" },
      { name: "stage", type: "text" },
      { name: "sla", type: "sla", class: "sla" },
      { name: "open_date", type: "text" },
      { name: "due_date", type: "text" },
      { name: "owner", type: "text" },
      { name: "status", type: "translate", prefix: "statuses" },
      { name: "notes", type: "text" },
    ];
  };

  const getDocumentColumns = () => {
    return [
      {
        name: "id",
        type: "link",
        class: "link-col",
      },
      { name: "type", type: "text" },
      { name: "detail", type: "text" },
      { name: "name", type: "text" },
      { name: "uploaded_from", type: "text" },
      { name: "task_id", type: "link" },
      { name: "uploaded_on", type: "text" },
      { name: "file", type: "file" },
    ];
  };

  const getSignatureTaskColumns = () => {
    return [
      {
        name: "task_number",
        type: "link",
        header: "task.number",
        class: "link-col",
      },
      { name: "family", type: "text" },
      { name: "task_type", type: "text", header: "task.type" },
      { name: "stage", type: "text" },
      { name: "sla", type: "sla", class: "sla" },
      { name: "open_date", type: "text" },
      { name: "due_date", type: "text" },
      { name: "owner", type: "text" },
      { name: "status", type: "translate", prefix: "statuses" },
      {
        name: "sign_button",
        type: "sign_button",
        header: "",
        class: "sign-button",
      },
    ];
  };

  // METHODS
  const getAlertCellConditionalStyle = (data) => {
    return [{ "bg-red-100 text-red-600": data > 0 }];
  };

  const getSelectFilterButtonValues = (entityPlural, i18n) => {
    return [
      { name: i18n.t("all-entities", { label: entityPlural }), value: 2 },
      { name: i18n.t("my-entities", { label: entityPlural }), value: 1 },
    ];
  };

  const getStatusConditionalStyle = (status) => {
    return [
      {
        "bg-green-200 text-green-900": ["active", "open"].includes(status),
        "bg-red-100 text-red-900": ["terminated", "not_active"].includes(
          status
        ),
      },
    ];
  };

  const getPriorityConditionalStyle = (data) => {
    return [
      "text-blue-600",
      {
        "bg-blue-75": data.priority === 1 && data.is_active,
        "bg-blue-50": data.priority === 2 && data.is_active,
        "bg-blue-25": data.priority === 3 && data.is_active,
      },
    ];
  };

  return {
    listRowsPerPage,
    selectedRowsPerPage,
    // LIST TABLE COLUMNS
    getContactColumns,
    getSelectedContactsForNewCustomerColumns,
    getSelectedContactsForNewProjectColumns,
    getContactDetailColumns,
    getCustomerColumns,
    getCustomerDetailColumns,
    getServiceColumns,
    getTaskColumns,
    getDocumentColumns,
    getSignatureTaskColumns,
    // METHODS
    getAlertCellConditionalStyle,
    getSelectFilterButtonValues,
    getStatusConditionalStyle,
    getPriorityConditionalStyle,
  };
}