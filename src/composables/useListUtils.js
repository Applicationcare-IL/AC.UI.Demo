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

  const getContactIncomingCallsColumns = () => {
    return [
      {
        name: "name",
        type: "link",
        to: "contact",
        linkParameter: "id",
        class: "link-col",
      },
      { name: "telephone", type: "text" },
      { name: "email", type: "text" },
      { name: "incoming-call", type: "take-call-btn" },
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
      { name: "customers", type: "customers", header: "project.organization" },
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
      // {
      //   name: "status",
      //   type: "option-set",
      //   header: "status",
      //   class: "p-0 text-center",
      // },
      // {
      //   name: "state",
      //   type: "state",
      //   header: "state.state",
      //   class: "p-0 text-center",
      // },
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

  const getCustomerColumnsForAssets = () => {
    return [
      {
        name: "name",
        type: "link",
        header: "asset.organization",
        class: "link-col",
      },
      {
        name: "main_contact",
        type: "contact-link",
        header: "customer.main-contact",
        class: "link-col",
      },
      {
        name: "phone",
        type: "contact-text",
        header: "contact.phone",
      },
      {
        name: "landline",
        type: "contact-text",
        header: "contact.landline",
      },
      {
        name: "email",
        type: "contact-text",
        header: "contact.email",
      },
      {
        name: "asset_role",
        type: "asset_role",
        header: "role",
        optionSet: "asset_customer_role",
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
      { name: "area", type: "optionset", header: "classification-1" },
      { name: "type", type: "optionset", header: "classification-2" },
      { name: "request1", type: "optionset", header: "classification-3" },
      { name: "duration", type: "text", header: "service.duration" },
      { name: "owner.name", header: "service.owner" },
      { name: "sla", type: "sla", header: "service.sla", class: "sla" },
      { name: "status", type: "optionset", header: "service.status" },
      { name: "state", type: "optionset", header: "service.state" },
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

  const getExistingServiceColumns = () => {
    return [
      {
        name: "service_number",
        type: "link",
        header: "service.number",
        class: "link-col",
      },
      { name: "open_date", type: "text", header: "service.open-date" },
      { name: "due_date", type: "text", header: "service.due-date" },
      { name: "area", type: "optionset", header: "classification-1" },
      { name: "type", type: "optionset", header: "classification-2" },
      { name: "request1", type: "optionset", header: "classification-3" },
      { name: "duration", type: "text", header: "service.duration" },
      { name: "owner.name", type: "text", header: "service.owner" },
      { name: "sla", type: "sla", header: "service.sla", class: "sla" },
      { name: "status", type: "optionset", header: "service.status" },
      { name: "state", type: "optionset", header: "service.state" },
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

  const getRelatedServiceColumns = () => {
    return [
      {
        name: "unlink",
        type: "unlink",
        header: "‎",
      },
      {
        name: "service_number",
        type: "link",
        header: "service.number",
        class: "link-col",
      },
      { name: "open_date", type: "text", header: "service.open-date" },
      { name: "due_date", type: "text", header: "service.due-date" },
      {
        name: "relationship",
        type: "optionset",
        header: "service.relation-type",
      },
      { name: "area", type: "optionset", header: "classification-1" },
      { name: "type", type: "optionset", header: "classification-2" },
      { name: "request1", type: "optionset", header: "classification-3" },
      { name: "duration", type: "text", header: "service.duration" },
      { name: "owner.name", type: "text", header: "service.owner" },
      { name: "sla", type: "sla", header: "service.sla", class: "sla" },
      { name: "status", type: "optionset", header: "service.status" },
      { name: "state", type: "optionset", header: "service.state" },
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
      { name: "task_family", type: "task_family", header: "task.family" },
      { name: "task_type.name", type: "text", header: "task.type" },
      { name: "stage", type: "text" },
      { name: "sla", type: "sla", class: "sla" },
      { name: "started_at", type: "text" },
      { name: "due_date", type: "text" },
      { name: "close_date", type: "text" },
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

  const getTaskSummaryColumns = () => {
    return [
      {
        name: "task_number",
        type: "link",
        header: "task.number",
        class: "link-col",
      },
      { name: "related", type: "related_entity" },
      { name: "status", type: "optionset", prefix: "statuses" },
      { name: "due_date", type: "text" },
      { name: "contact", type: "contact", class: "link-col" },
      { name: "sla", type: "sla", class: "sla" },
      { name: "read", type: "text" },
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

  const getPaymentsColumns = () => {
    return [
      {
        name: "payment-number",
        type: "text",
        field: "id",
        editable: false,
      },
      {
        name: "budget-item-number",
        type: "budget-item",
        editable: true,
        field: "budget_item",
      },
      {
        name: "project_team",
        type: "project_team",
        field: "project_team",
        header: "project.team",
        editable: true,
      },
      {
        name: "milestone",
        type: "milestone",
        field: "milestone",
        header: "milestone.milestone",
        editable: true,
      },
      {
        name: "status",
        type: "status",
        field: "payment_status",
        editable: true,
      },
      {
        name: "proforma-invoice-number",
        type: "text",
        field: "proforma_invoice_number",
        editable: true,
      },
      {
        name: "proforma-invoice-date",
        type: "calendar",
        field: "proforma_invoice_date",
        editable: true,
      },
      {
        name: "proforma-invoice-amount",
        type: "currency",
        field: "proforma_invoice_amount",
        editable: true,
      },
      {
        name: "invoice-number",
        type: "text",
        field: "invoice_number",
        editable: true,
      },
      {
        name: "invoice-date",
        type: "calendar",
        field: "invoice_date",
        editable: true,
      },
      {
        name: "terms-of-payment",
        type: "terms-of-payment",
        field: "basic_term",
        editable: true,
      },
      {
        name: "amount-paid",
        type: "currency",
        field: "amount_paid",
        editable: true,
      },
      {
        name: "payment-date",
        type: "calendar",
        field: "payment_date",
        editable: false,
      },
      {
        name: "reported",
        type: "checkbox",
        field: "reported",
        editable: true,
      },
      {
        name: "date-reported-date",
        type: "calendar",
        field: "report_date",
        editable: true,
      },
      {
        name: "amount-approved-to-be-paid",
        type: "currency",
        field: "amount_approved",
        editable: true,
      },
      {
        name: "batch-number",
        type: "text",
        field: "batch_number",
        editable: true,
      },
    ];
  };

  const getMilestonesTableColumns = () => {
    return [
      {
        name: "milestone-id",
        type: "milestone-link",
        field: "id",
        editable: false,
      },
      {
        name: "milestone-name",
        type: "text",
        field: "name",
        editable: false,
      },
      {
        name: "milestone-type",
        type: "optionSet",
        field: "milestone_type",
        editable: false,
      },
      {
        name: "planned-date",
        type: "date",
        field: "planned_date",
        editable: false,
      },
      {
        name: "base-date",
        type: "date",
        field: "base_date",
        editable: false,
      },
      {
        name: "actual-date",
        type: "date",
        field: "actual_date",
        editable: false,
      },
      {
        name: "status",
        type: "status",
        field: "milestone_status",
        editable: false,
      },
      {
        name: "description",
        type: "text",
        field: "description",
        editable: false,
      },
    ];
  };

  const getBudgetItemsTableColumns = () => {
    return [
      {
        name: "budget-item-name",
        type: "budget-item-link",
      },
      {
        name: "estimate",
        field: "estimate",
        type: "currency",
        editable: true,
      },
      {
        name: "planned-contract",
        field: "planned_contract",
        type: "currency",
        editable: true,
      },
      {
        name: "unexpected",
        field: "unexpected",
        type: "currency",
        editable: true,
      },
      {
        name: "management-fee",
        field: "management_fee",
        type: "currency",
        editable: true,
      },
      {
        name: "total",
        field: "total",
        type: "currency",
      },
      {
        name: "approved-council",
        field: "approved_council",
        type: "currency",
        editable: true,
      },
      {
        name: "approved-ministry",
        field: "approved_ministry",
        type: "currency",
        editable: true,
      },
      {
        name: "executed-payments",
        field: "executed_payments",
        type: "currency",
      },
      {
        name: "balance",
        field: "balance",
        type: "balance",
      },
    ];
  };

  const getProjectTeamColumns = () => {
    return [
      {
        name: "actions",
        type: "actions",
        header: "actions",
        class: "buttons",
        buttons: ["unlink", "edit"],
      },
      {
        name: "contact_name",
        type: "link",
        to: "contact",
        linkParameter: "contact_id",
        class: "link-col",
      },
      { name: "telephone", type: "text" },
      { name: "email", type: "text" },
      {
        name: "contract_number",
        type: "text",
        header: "project.contract-number",
        editable: true,
      },
      { name: "contract", type: "attachment", header: "project.contract" },
      {
        name: "contract_amount",
        type: "currency",
        header: "project.contract-amount",
        editable: true,
      },
      {
        name: "contract_amount_paid",
        type: "currency",
        header: "project.paid-so-far",
        editable: false,
      },
      {
        name: "contract_amount_remaining",
        type: "currency",
        header: "project.remains-to-be-paid",
        editable: false,
      },
      { name: "customers", type: "customers", header: "project.organization" },
      {
        name: "role_project",
        type: "role_project",
        header: "project.role_in_project",
        optionSet: "contact_project_role",
        class: "p-0",
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

  const getAssetColumnsforCustomerDetail = () => {
    return [
      {
        name: "number",
        type: "text",
        header: "asset.number",
      },
      {
        name: "type",
        type: "optionset",
        header: "asset.type",
        optionSet: "asset_type",
      },
      {
        name: "owner",
        type: "link",
        header: "asset.owner",
      },
      {
        name: "payer",
        type: "link",
        header: "asset.payer",
      },
      {
        name: "consumer",
        type: "link",
        header: "asset.consumer",
      },
      {
        name: "usage_start_date",
        type: "date",
        header: "asset.usage-start-date",
      },
      {
        name: "state",
        type: "state",
        header: "asset.state",
        class: "p-0",
      },
      {
        name: "open_services",
        type: "text",
        header: "asset.open-services",
        class: "numeric",
      },
      {
        name: "breached_services",
        type: "alert",
        header: "asset.breached-services",
        class: "numeric",
      },
      {
        name: "open_tasks",
        type: "text",
        header: "asset.open-tasks",
        class: "numeric",
      },
      {
        name: "breached_tasks",
        type: "alert",
        header: "asset.breached-tasks",
        class: "numeric",
      },
      {
        name: "address",
        type: "text",
        header: "address",
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

  // TODO: Maybe this should be a new component
  const getPriorityClasses = (data) => {
    return [
      "text-purple-900",
      {
        "bg-purple-400": parseInt(data.priority) === 1 && data.is_active,
        "bg-purple-200": data.priority === 2 && data.is_active,
        "bg-purple-100": data.priority === 3 && data.is_active,
      },
    ];
  };

  const highlightStatusClass = (status) => {
    return [
      {
        "bg-green-200 text-green-900": status === "active",
        "bg-yellow-100 text-gray-900": status === "terminated",
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
    getCustomerColumnsForAssets,
    getCustomerPreviewColumns,
    getServiceColumns,
    getRelatedServiceColumns,
    getServicePreviewColumns,
    getExistingServiceColumns,
    getTaskColumns,
    getTaskPreviewColumns,
    getTaskSummaryColumns,
    getProjectDocumentColumns,
    getBudgetItemsTableColumns,
    getPaymentsColumns,
    getTaskDocumentColumns,
    getServiceDocumentsColumns,
    getSignatureTaskColumns,
    getProjectTeamColumns,
    getCompetitionProcessColumns,
    getContactIncomingCallsColumns,
    getMilestonesTableColumns,
    getAssetColumnsforCustomerDetail,
    // METHODS
    getAlertCellConditionalStyle,
    getStatusConditionalStyle,
    getPriorityClasses,
    highlightStatusClass,
  };
}
