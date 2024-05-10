<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('task.payment-request-task-title')"
    :style="{ minWidth: '30vw' }"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2 mb-3">
        <WMInput
          :value="selectedProject"
          name="payment-request-project"
          type="input-select"
          :highlighted="true"
          :label="$t('project.project') + ':'"
          :options="contactProjects"
          custom-option-label="project_name"
          width="350"
          @update:selected-item="onProjectChange"
        />

        <WMInput
          :value="selectedRole"
          name="payment-request-role"
          type="input-select"
          :highlighted="true"
          :label="$t('project.role_in_project') + ':'"
          :options="contactRolesInProject"
          width="350"
          option-set
          @update:selected-item="onRoleChange"
        />
      </div>

      <div class="flex flex-row gap-6">
        <WMInputCurrency
          v-model="remainsToBePaid"
          :label="$t('payments.remains-to-be-paid') + ':'"
          :read-only="true"
          name="remains-to-be-paid"
        />

        <WMInputCurrency
          v-model="paidSoFar"
          :label="$t('payments.paid-so-far') + ':'"
          :read-only="true"
          name="paid-so-far"
        />
      </div>

      <div class="flex flex-row gap-2">
        <WMInput
          name="invoice_type"
          type="input-select-button"
          :highlighted="true"
          :label="$t('payments.invoice-type') + ':'"
          :options="invoiceTypeOptions"
          :value="selectedInvoiceType"
          width="80"
          @update:selected-item="onInvoiceTypeChange"
        />
      </div>

      <div class="flex flex-row gap-2">
        <WMInput
          v-model="invoiceNumber"
          type="input-text"
          name="invoice_number"
          width="200"
          :label="$t('payments.invoice-number') + ':'"
          @change="onInvoiceNumberChange"
        />

        <WMInputCurrency
          v-model="amount"
          :label="$t('payments.amount') + ':'"
          required
          name="amount"
        />
      </div>

      <div class="flex gap-2 mt-5 justify-content-end">
        <Button
          type="button"
          :label="$t('buttons.cancel')"
          severity="secondary"
          @click="modelValue = false"
        />
        <Button
          type="button"
          :label="$t('task.create-payment-request')"
          @click="handleCreatePaymentRequestTask"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
// IMPORTS
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { getProjectsFromApi, getProjectTeamRoles } = useProjects();
const { layoutConfig } = useLayout();
const { createTask, parseTask, getPaymentTaskInfo } = useTasks();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  task: Object,
});

const emit = defineEmits("requestPaymentTaskCreated");

// REFS
const modelValue = defineModel();

const selectedProject = ref("");
const selectedRole = ref("");
const selectedProjectTeam = ref("");
const contactProjects = ref([]);
const contactRolesInProject = ref([]);
const invoiceNumber = ref("");
const amount = ref(0);

const invoiceTypeOptions = [
  { value: "invoice", name: t("payments.invoice") },
  { value: "proforma_invoice", name: t("payments.proforma-invoice") },
];
const selectedInvoiceType = ref(invoiceTypeOptions[0]);

const remainsToBePaid = ref(0);
const paidSoFar = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleCreatePaymentRequestTask = () => {
  console.log("Create payment request task");

  const task = {
    ...props.task,
    payment: {
      project_team: selectedProjectTeam.value,
    },
  };

  const parsedTask = parseTask(task);
  console.log("parsedTask", parsedTask);

  createTask(parseTask(task))
    .then((response) => {
      modelValue.value = false;
      emit("requestPaymentTaskCreated", response.data.id);
    })
    .catch((error) => {
      console.error(error);
    });
};

const loadContactProjects = () => {
  let params = {
    project_team: `${props.task.customer.id},${props.task.contact.id}`,
  };

  getProjectsFromApi(params).then((projects) => {
    contactProjects.value = projects.projects;
    selectedProject.value = projects.projects[0];

    loadContactRolesInProject(selectedProject.value.id);
  });
};

const loadContactRolesInProject = () => {
  let params = {
    contact: props.task.contact.id,
    customer: props.task.customer.id,
    project: selectedProject.value.id,
  };

  getProjectTeamRoles(selectedProject.value.id, params).then((roles) => {
    contactRolesInProject.value = roles;
    selectedRole.value = roles[0];
    loadPaymentTaskInfo();
  });
};

const refreshData = () => {
  loadContactProjects();
};

const onProjectChange = (project) => {
  selectedProject.value = project;
  loadContactRolesInProject(project.id);
};

const onRoleChange = (role) => {
  selectedRole.value = role;

  loadPaymentTaskInfo();
};

const loadPaymentTaskInfo = () => {
  let params = {
    project_id: selectedProject.value.id,
    contact_id: props.task.contact.id,
    customer_id: props.task.customer.id,
    role_project_id: selectedRole.value.id,
  };

  getPaymentTaskInfo(params).then((info) => {
    remainsToBePaid.value = info.contract_amount_remaining;
    paidSoFar.value = info.contract_amount_paid;
    selectedProjectTeam.value = info.project_team_id;
  });
};

const onInvoiceTypeChange = (invoiceType) => {
  selectedInvoiceType.value = invoiceType;
};

const onInvoiceNumberChange = (event) => {
  invoiceNumber.value = event.target.value;
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => modelValue.value,
  (boolean) => {
    if (boolean) {
      refreshData();
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
