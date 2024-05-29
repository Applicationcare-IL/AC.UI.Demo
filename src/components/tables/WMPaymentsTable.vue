<template>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          v-if="!props.readOnly"
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          :disabled="budgetItems.length < 1 || isSomePaymentInCreateMode"
          @click="handleNewPayment"
        >
          {{ t("new") }}
        </WMButton>
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="payment" />
      <WMFilterButton :is-active="isFilterApplied || isFilterVisible" @click="openFilterSidebar" />

      <WMSidebar
        :visible="isFilterVisible"
        name="filterPayment"
        @close-sidebar="closeFilterSidebar"
        @open-sidebar="openFilterSidebar"
      >
        <WMFilterForm entity="payment" filter-form-name="payment" />
      </WMSidebar>
    </div>
  </div>
  <DataTable
    v-model:selection="selectedPayments"
    v-model:editingRows="editingRows"
    lazy
    :value="payments"
    data-key="id"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="10"
    :first="0"
    :total-records="totalRecords"
    :class="`p-datatable-payments js-datatable-payments`"
    edit-mode="row"
    :row-class="rowClass"
    @page="onPage($event)"
    @row-edit-save="onRowEditSave"
    @row-edit-cancel="onRowEditCancel"
  >
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple" />

    <Column v-if="!props.readOnly" :row-editor="true" :frozen="true" align-frozen="right" />

    <template v-for="column in columns">
      <Column
        v-if="column.type == 'text'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          {{ slotProps.data[column.field] }}
        </template>
        <template v-if="column.editable" #editor="{ data }">
          <InputText v-model="data[column.field]" />
        </template>
      </Column>

      <Column
        v-if="column.type == 'project'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data[column.field]"
            :to="{
              name: 'projectDetail',
              params: { id: slotProps.data[column.field].id },
            }"
            >{{ slotProps.data[column.field].name }}</router-link
          >
        </template>
      </Column>

      <Column
        v-if="column.type == 'currency'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data[column.field]"
            :read-only="true"
            :name="column.name"
          />
        </template>
        <template v-if="column.editable" #editor="{ data }">
          <WMInputCurrency v-model="data[column.field]" :name="column.field" :read-only="false" />
        </template>
      </Column>

      <Column
        v-if="column.type == 'attachment'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <WMUploadAttachmentButton
            entity="payment"
            :entity-id="slotProps.data.id"
            :file-name="column.fileName"
            :has-file="slotProps.data[column.fileName]"
            :download-url="slotProps.data[column.fileName]?.download_url"
            :disabled="props.readOnly"
          />
        </template>
      </Column>

      <Column
        v-if="column.type == 'budget-item'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template v-if="column.editable" #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="budgetItems"
            option-label="name"
            placeholder="Select a budget item"
          >
            <template #option="slotProps">
              {{ slotProps.option.name }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          {{ slotProps.data[column.field].name }}
        </template>
      </Column>

      <Column
        v-if="column.type == 'project_team'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template v-if="column.editable" #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="teamMembers"
            option-label="name"
            placeholder="Select a team Member"
          >
            <template #option="slotProps">
              {{ slotProps.option.name }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          <span v-if="slotProps.data[column.field]">
            {{ slotProps.data[column.field].name }}
          </span>
        </template>
      </Column>

      <Column
        v-if="column.type == 'milestone'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template v-if="column.editable && !props.milestoneId" #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="milestones"
            option-label="name"
            placeholder="Select a milestone"
          >
            <template #option="slotProps">
              {{ slotProps.option.name }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          <span v-if="slotProps.data[column.field]">
            {{ slotProps.data[column.field].name }}
          </span>
        </template>
      </Column>

      <Column
        v-if="column.type == 'status'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
        class="p-0"
      >
        <template v-if="column.editable" #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="paymentStatuses"
            :option-label="optionLabelWithLang"
            option-value="id"
            placeholder="Select a Status"
            :class="`p-dropdown-payment-status p-dropdown-payment-status--${
              getStatus(data[field]).value
            }`"
          >
            <template #option="slotProps">
              {{ slotProps.option[optionLabelWithLang] }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          <div
            v-if="slotProps.data[column.field] && getStatus(slotProps.data[column.field]).value"
            class="w-full p-dropdown p-component p-inputwrapper p-inputwrapper-filled"
            :class="`p-dropdown-payment-status p-dropdown-payment-status--${
              getStatus(slotProps.data[column.field]).value
            }`"
          >
            <span class="p-dropdown-label p-inputtext cursor-text">
              {{ getStatus(slotProps.data[column.field])[optionLabelWithLang] }}
            </span>
          </div>
          <div v-else>
            <span class="px-2">{{ $t("payments.status-not-selected") }}</span>
          </div>
        </template>
      </Column>

      <Column
        v-if="column.type == 'calendar'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template v-if="column.editable" #editor="{ data, field }">
          <Calendar v-model="data[field]" show-icon />
        </template>
        <template #body="slotProps">
          {{
            slotProps.data[column.field]
              ? formatDate(new Date(slotProps.data[column.field]), "DD/MM/YY")
              : ""
          }}
          <i class="pi pi-calendar"></i>
        </template>
      </Column>

      <Column
        v-if="column.type == 'terms-of-payment'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          {{ slotProps.data[column.field]?.[optionLabelWithLang] }}
        </template>
      </Column>
    </template>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { formatDate } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";
import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const {
  getProjectPayments,
  getBudgetItems,
  updateProjectPayment,
  createProjectPayment,
  parseProjectPayment,
  getMilestones,
  getProjectTeam,
  mapShortMilestone,
} = useProjects();
const toast = useToast();
const { t } = useI18n();
const optionSetsStore = useOptionSetsStore();
const { optionLabelWithLang } = useLanguages();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  milestoneId: {
    type: Number,
    required: true,
  },
  relatedEntity: {
    type: String,
    required: true,
  },
  relatedEntityId: {
    type: Number,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array,
    required: true,
  },
});

// REFS
const selectedPayments = ref([]);
const payments = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");
const editingRows = ref([]);
const paymentStatuses = ref([]);
const budgetItems = ref([]);
const teamMembers = ref([]);
const basicTerms = ref([]);
const milestones = ref([]);

const isFilterVisible = ref(false);

// COMPUTED
const isSomePaymentInCreateMode = computed(() => {
  if (payments.value.length < 1) return false;

  return payments.value.some((payment) => payment.mode === "create");
});

const isFilterApplied = computed(() => {
  if (!utilsStore.filters["payment"]) return 0;
  return Object.keys(utilsStore.filters["payment"]).length;
});

// COMPONENT METHODS AND LOGIC
optionSetsStore.getOptionSetValuesFromApi("payment_status").then((data) => {
  paymentStatuses.value = data;
});

optionSetsStore.getOptionSetValuesFromApi("basic_term").then((data) => {
  basicTerms.value = data;
});

const getColumHeader = (column) => {
  return column.header ? t(column.header) : t(`payments.${column.name}`);
};

const getStatus = (id) => {
  const status = paymentStatuses.value.find((item) => item.id === id);
  return status ? status : "";
};

const getTermOfPayment = (id) => {
  const term = basicTerms.value.find((item) => item.id === id);
  return term ? term : "";
};

const getPaymentTemplate = () => {
  let paymentTemplate = {
    temp_id: uuidv4(),
    mode: "create",
    budget_item: {
      ...budgetItems.value[0],
    },
    customer: "",
    status: {
      ...paymentStatuses.value[0],
    },
    milestone: {
      id: "",
      name: "",
    },
    proforma_invoice_number: "PRO-12345",
    proforma_invoice_date: new Date(),
    proforma_invoice_amount: 100000,
    invoice_number: "INV-67890",
    invoice_date: new Date(),
    payment_date: new Date(),
    amount_paid: 80000,
    reported: true,
    report_date: new Date(),
    amount_approved: 80000,
    batch_number: "BATCH-2024-02-12",
    terms_of_payment_id: "",
    project_team: {
      id: "",
      name: "",
    },
  };

  return paymentTemplate;
};

const rowClass = (data) => {
  return [{ "bg-new-row": data.mode === "create" }];
};

const handleNewPayment = async () => {
  payments.value = [getPaymentTemplate(), ...payments.value];

  await nextTick();

  const firstRow = document.querySelector(
    ".js-datatable-payments .p-datatable-tbody tr:first-child"
  );

  const editButton = firstRow.querySelector(".p-row-editor-init");

  if (editButton) {
    editButton.click();
  }
};

const loadLazyData = () => {
  const filters = utilsStore.filters["payment"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = 10;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: selectedRowsPerPageParam,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  if (props.milestoneId) {
    params.append("milestone", props.milestoneId);
  }

  if (props.relatedEntity === "task") {
    params.append("task", props.relatedEntityId);
  }

  if (props.relatedEntity === "customer") {
    params.append("customer", props.relatedEntityId);
  }

  let projectId = props.projectId ? props.projectId : -1;

  getProjectPayments(projectId, params).then((response) => {
    payments.value = response.payments;
    totalRecords.value = response.totalRecords;
  });

  getBudgetItems({ project: props.projectId }).then((response) => {
    budgetItems.value = response.budgetItems;
  });

  getProjectTeam(props.projectId).then(({ contacts }) => {
    teamMembers.value = contacts;
  });

  getMilestones({ project: props.projectId }).then((response) => {
    milestones.value = response.map((milestone) => {
      return mapShortMilestone(milestone);
    });
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onRowEditSave = (event) => {
  let { newData, index } = event;

  const paymentId = newData.id;

  if (!validateForm(newData)) {
    toast.error("Please fill all the required fields");
    editingRows.value = [...editingRows.value, newData]; // keep the rows in edit mode
    return;
  }

  if (!newData.project_team?.id) {
    toast.error("Please select a team member");
    editingRows.value = [...editingRows.value, newData]; // keep the rows in edit mode
    return;
  }

  if (newData.mode === "create") {
    createProjectPayment(props.projectId, parseProjectPayment(newData))
      .then((response) => {
        delete newData.mode;
        newData.id = response.id;
        newData.basic_term = getTermOfPayment(response.basic_term?.id);
        newData.payment_date = response.payment_date;
        payments.value[index] = newData;
        toast.successAction("payment", "created");
      })
      .catch((error) => {
        toast.error(error);
      });

    return;
  }

  updateProjectPayment(props.projectId, paymentId, parseProjectPayment(newData)).then(
    (response) => {
      newData.basic_term = getTermOfPayment(response.basic_term?.id);
      newData.payment_date = response.payment_date;
      payments.value[index] = newData;
      toast.successAction("payment", "updated");
    }
  );
};

const validateForm = (obj) => {
  const requiredFields = [
    "budget_item",
    "project_team",
    "proforma_invoice_number",
    "proforma_invoice_date",
    "proforma_invoice_amount",
    "invoice_number",
    "invoice_date",
    "payment_date",
    "amount_paid",
    "report_date",
    "amount_approved",
    "batch_number",
  ];

  for (const field of requiredFields) {
    if (!obj.hasOwnProperty(field) || obj[field] === "") {
      return false;
    }
  }

  return true;
};

const onRowEditCancel = (event) => {
  let { data } = event;

  if (data.mode === "create") {
    payments.value.shift();
  }
};

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

const refreshTable = () => {
  loadLazyData();
};

// PROVIDE, EXPOSE
defineExpose({
  refreshTable,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["payment"],
  () => {
    searchValue.value = utilsStore.searchString["payment"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

watch(
  () => payments.value,
  () => {
    utilsStore.selectedElements["payments"] = payments.value;
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
