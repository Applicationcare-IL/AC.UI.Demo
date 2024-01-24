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

  const getContactPreviewColumns = () => {
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
        name: "role_project",
        type: "role_project",
        header: "project.role_in_project",
        optionSet: "contact_project_role",
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
        header: "customer.service-areas",
        class: "tags buttons",
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

  const getCustomerPreviewColumns = () => {
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
      { name: "owner.name", type: "owner", header: "owner" },

      { name: "role", type: "role", header: "role" },
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

  const getServicePreviewColumns = () => {
    return [
      {
        name: "service_number",
        type: "link",
        header: "service.number",
        class: "link-col",
      },
      { name: "area.value", type: "text", header: "classification-1" },
      { name: "type.value", type: "text", header: "classification-2" },
      { name: "request1.value", type: "text", header: "classification-3" },
      { name: "owner.name", header: "service.owner" },
      { name: "sla", type: "sla", header: "service.sla", class: "sla" },
      {
        name: "priority",
        type: "priority",
        header: "service.priority",
        class: "numeric",
      },
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
      { name: "task_family", type: "task_family", header: "task.family" },
      { name: "task_type.name", type: "text", header: "task.type" },
      { name: "stage", type: "text" },
      { name: "sla", type: "sla", class: "sla" },
      { name: "started_at", type: "text" },
      { name: "due_date", type: "text" },
      { name: "owner", type: "text" },
      { name: "status", type: "optionset", prefix: "statuses" },
      { name: "notes", type: "text" },
    ];
  };

  const getTaskPreviewColumns = () => {
    return [
      {
        name: "task_number",
        type: "link",
        header: "task.number",
        class: "link-col",
      },
      { name: "owner", type: "text" },
      { name: "family", type: "text" },
      { name: "task_type.name", type: "text", header: "task.type" },
      { name: "sla", type: "sla", class: "sla" },
      { name: "due_date", type: "text" },
      { name: "status", type: "optionset", prefix: "statuses" },
    ];
  };

  const getProjectDocumentColumns = () => {
    return [
      {
        name: "id",
        type: "text",
      },
      { name: "type", type: "type", optionSet: "document_type" },
      { name: "detail", type: "detail", optionSet: "document_detail" },
      { name: "name", type: "name" },
      { name: "uploaded_from", type: "text" },
      { name: "task", type: "task" },
      { name: "owner", type: "text" },
      { name: "upload_date", type: "text" },
    ];
  };

  const getTaskDocumentColumns = () => {
    return [
      {
        name: "id",
        type: "text",
      },
      { name: "type", type: "type", optionSet: "document_type" },
      { name: "detail", type: "detail", optionSet: "document_detail" },
      { name: "name", type: "name" },
      { name: "uploaded_from", type: "text" },
      { name: "owner", type: "text" },
      { name: "upload_date", type: "text" },
    ];
  };

  const getServiceDocumentsColumns = () => {
    return [
      {
        name: "id",
        type: "text",
      },
      { name: "name", type: "name", width: "100%" },
      { name: "owner", type: "text" },
      { name: "upload_date", type: "text" },
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
      { name: "task_type", type: "text", header: "task.type" },
      { name: "owner", type: "text", header: "owner" },
      { name: "open_date", type: "text" },
      { name: "sla", type: "sla", class: "sla" },
      { name: "signature_status", type: "optionset", header: "status" },
      { name: "notes", type: "text" },
      {
        name: "sign_button",
        type: "sign_button",
        header: "",
        class: "sign-button",
      },
    ];
  };

  const getProjectTeamColumns = () => {
    return [
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
      { name: "address", type: "address" },
      { name: "customer.name", type: "text", header: "project.organization" },
      {
        name: "role_project",
        type: "role_project",
        header: "project.role_in_project",
        optionSet: "contact_project_role",
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

  const getCompetitionProcessColumns = () => {
    return [
      {
        name: "customer_name",
        type: "text",
        header: "organization.organization_name",
      },
      { name: "offer_requested_at", type: "date", editable: true },
      { name: "offer_received_at", type: "date", editable: true },
      { name: "offer_amount", type: "offer_amount" },

      {
        name: "status",
        type: "status",
        optionSet: "customer_project_status",
      },
      { name: "refusal_to_win", type: "refusal_to_win" },
      { name: "qualified_second", type: "qualified_second" },
      { name: "notes", type: "text" },

      {
        name: "actions",
        type: "actions",
        header: "",
        class: "buttons",
        buttons: ["unlink", "edit"],
      },
    ];
  };

  // METHODS
  const getAlertCellConditionalStyle = (data) => {
    return [{ "bg-red-100 text-red-600": data > 0 }];
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
    getContactPreviewColumns,
    getSelectedContactsForNewCustomerColumns,
    getSelectedContactsForNewProjectColumns,
    getContactDetailColumns,
    getCustomerColumns,
    getCustomerPreviewColumns,
    getServiceColumns,
    getServicePreviewColumns,
    getTaskColumns,
    getTaskPreviewColumns,
    getProjectDocumentColumns,
    getTaskDocumentColumns,
    getServiceDocumentsColumns,
    getSignatureTaskColumns,
    getProjectTeamColumns,
    getCompetitionProcessColumns,
    // METHODS
    getAlertCellConditionalStyle,
    getStatusConditionalStyle,
    getPriorityConditionalStyle,
  };
}
